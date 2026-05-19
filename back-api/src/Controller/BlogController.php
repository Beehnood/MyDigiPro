<?php

namespace App\Controller;

use App\Entity\Blog;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Bundle\SecurityBundle\Security;


final class BlogController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private Security $security
    ) {
    }

    #[Route('/api/blogs', name: 'app_blog_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $blogs = $this->entityManager->getRepository(Blog::class)->findBy([], ['createdAt' => 'DESC']);
        return new JsonResponse(
            $this->serializer->serialize($blogs, 'json', ['groups' => ['blog:read']]),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/api/blogs/{id}', name: 'app_blog_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $blog = $this->entityManager->getRepository(Blog::class)->find($id);
        if (!$blog) {
            return new JsonResponse(['error' => 'Blog not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(
            $this->serializer->serialize($blog, 'json', ['groups' => ['blog:read']]),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/api/blogs', name: 'app_blog_create', methods: ['POST'])]
    public function create(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $tooLargeResponse = $this->getTooLargeUploadResponse($request);
        if ($tooLargeResponse) {
            return $tooLargeResponse;
        }

        $user = $this->security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $blog = new Blog();
        $blog->setUser($user);
        $blog->setTitle($request->request->get('title', ''));
        $blog->setContent($request->request->get('content', ''));

        /** @var UploadedFile|null $imageFile */
        $imageFile = $request->files->get('imageFile');
        if ($imageFile) {
            $blog->setImageFile($imageFile);
        }

        /** @var UploadedFile|null $videoFile */
        $videoFile = $request->files->get('videoFile');
        if ($videoFile) {
            $blog->setVideoFile($videoFile);
        }


        $blog->setCreatedAt(new \DateTimeImmutable());


        $errors = $validator->validate($blog);
        if (count($errors) > 0) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => json_decode($this->serializer->serialize($errors, 'json'), true)
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($blog);
        $this->entityManager->flush();

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Blog post created successfully',
            'data' => [
                'id' => $blog->getId(),
                'title' => $blog->getTitle(),
                'content' => $blog->getContent(),
                'image' => $blog->getImage(),
                'video' => $blog->getVideo(),
                'createdAt' => $blog->getCreatedAt()->format('Y-m-d H:i:s'),
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/blogs/{id}', name: 'app_blog_update', methods: ['PUT', 'PATCH', 'POST'])]
    public function update(int $id, Request $request, ValidatorInterface $validator): JsonResponse
    {
        $tooLargeResponse = $this->getTooLargeUploadResponse($request);
        if ($tooLargeResponse) {
            return $tooLargeResponse;
        }

        $blog = $this->entityManager->getRepository(Blog::class)->find($id);
        if (!$blog) {
            return new JsonResponse(['error' => 'Blog not found'], Response::HTTP_NOT_FOUND);
        }

        $user = $this->security->getUser();
        if ($blog->getUser() !== $user && !$this->isGranted('ROLE_ADMIN')) {
            return new JsonResponse(['error' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        // 🔹 Met à jour uniquement si la valeur est fournie
        $title = $request->request->get('title');
        if (!empty($title)) {
            $blog->setTitle($title);
            //  dd($title);
        }


        $content = $request->request->get('content');
        if (!empty($content)) {
            $blog->setContent($content);
        }


        /** @var UploadedFile|null $imageFile */
        $imageFile = $request->files->get('imageFile');
        if ($imageFile) {
            $blog->setImageFile($imageFile);

        }
        /** @var UploadedFile|null $videoFile */
        $videoFile = $request->files->get('videoFile');
        if ($videoFile) {
            $blog->setVideoFile($videoFile);
        }


        $blog->setUpdatedAt(new \DateTimeImmutable());

        // 🔹 Validation
        $errors = $validator->validate($blog);
        if (count($errors) > 0) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => json_decode($this->serializer->serialize($errors, 'json'), true)
            ], Response::HTTP_BAD_REQUEST);
        }

        // ✅ Sauvegarde en BDD
        $this->entityManager->flush();

        // ✅ Retourne l’objet JSON (pas une string sérialisée)
        $json = $this->serializer->serialize($blog, 'json', ['groups' => 'blog:read']);

        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }


    #[Route('/api/blogs/{id}', name: 'app_blog_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $blog = $this->entityManager->getRepository(Blog::class)->find($id);
        if (!$blog) {
            return new JsonResponse(['error' => 'Blog not found'], Response::HTTP_NOT_FOUND);
        }

        $user = $this->security->getUser();
        if ($blog->getUser() !== $user && !$this->isGranted('ROLE_ADMIN')) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($blog);
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    private function getTooLargeUploadResponse(Request $request): ?JsonResponse
    {
        $contentLength = (int) $request->server->get('CONTENT_LENGTH', 0);
        $postMaxSize = $this->parseIniSize((string) ini_get('post_max_size'));

        if ($postMaxSize > 0 && $contentLength > $postMaxSize) {
            return new JsonResponse([
                'error' => sprintf(
                    'Fichier trop volumineux. Taille envoyée: %s. Limite serveur actuelle: %s.',
                    $this->formatBytes($contentLength),
                    $this->formatBytes($postMaxSize)
                ),
            ], Response::HTTP_REQUEST_ENTITY_TOO_LARGE);
        }

        return null;
    }

    private function parseIniSize(string $value): int
    {
        $value = trim($value);
        if ($value === '') {
            return 0;
        }

        $unit = strtolower($value[-1]);
        $size = (float) $value;

        return match ($unit) {
            'g' => (int) ($size * 1024 * 1024 * 1024),
            'm' => (int) ($size * 1024 * 1024),
            'k' => (int) ($size * 1024),
            default => (int) $size,
        };
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1024 * 1024) {
            return round($bytes / 1024 / 1024, 1) . ' MB';
        }

        if ($bytes >= 1024) {
            return round($bytes / 1024, 1) . ' KB';
        }

        return $bytes . ' B';
    }

}
