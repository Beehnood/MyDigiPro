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



final class BlogController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer

    ) {}

    #[Route ('/api/blogs', name: 'app_blog_list', methods:['Get'])]
    public function list() :JsonResponse
    {
        $blogs = $this->entityManager->getRepository(Blog::class)->findBy([], ['createdAt' => 'DESC']);
        return new JsonResponse(
            $this->serializer->serialize($blogs, 'json'),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/api/blogs/{id}', name: 'app_blog_show', methods: 'GET')]
    public function show(int $id): JsonResponse
    {
        $blog = $this->entityManager->getRepository(Blog::class)->find($id);
        if (!$blog) {
            return new JsonResponse(['error' => 'Blog not found'], Response::HTTP_NOT_FOUND);
        }
        return new JsonResponse(
            $this->serializer->serialize($blog, 'json'),
            Response::HTTP_OK,
            [],
            true
        );
    }
   
   

    #[Route('/api/blogs', name: 'app_blog_create', methods: ['POST'])]
    public function create(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $blog = new Blog();
        $blog->setTitle($data['title'] ?? '');
        $blog->setContent($data['content'] ?? '');
        $blog->setCreatedAt(new \DateTimeImmutable());

        // Validation
        $errors = $validator->validate($blog);
        if (count($errors) > 0) {
            return new JsonResponse(
                $this->serializer->serialize($errors, 'json'),
                Response::HTTP_BAD_REQUEST,
                [],
                true
            );
        }

        $this->entityManager->persist($blog);
        $this->entityManager->flush();

        return new JsonResponse(
            $this->serializer->serialize($blog, 'json'),
            Response::HTTP_CREATED,
            [],
            true
        );
    }


    #[Route('/api/blogs/{id}', name: 'app_blog_update', methods: ['PUT'])]
public function update(int $id, Request $request): JsonResponse
{
    $blog = $this->entityManager->getRepository(Blog::class)->find($id);
    if (!$blog) {
        return new JsonResponse(['error' => 'Blog not found'], Response::HTTP_NOT_FOUND);
    }

    $data = json_decode($request->getContent(), true);

    $blog->setTitle($data['title'] ?? $blog->getTitle());
    $blog->setContent($data['content'] ?? $blog->getContent());

    $this->entityManager->flush();

    return new JsonResponse(
        $this->serializer->serialize($blog, 'json'),
        Response::HTTP_OK,
        [],
        true
    );
}

#[Route ('/api/blogs/{id}', name: 'app_blog_delete', methods :['DELETE'])]
public function delete(int $id,Request $request)
{
    $blog = $this ->entityManager->getRepository(Blog::class)->find($id);
    if(!$blog)
    {
        return new JsonResponse (['error' =>'Blog not found'], Response :: HTTP_NOT_FOUND);
    }
    $blog = $this -> entityManager -> remove($blog);
    $this -> entityManager -> flush();

    return new JsonResponse(
        ['message' => 'Blog deleted successfully'],
        Response::HTTP_NO_CONTENT
    );
}

}
