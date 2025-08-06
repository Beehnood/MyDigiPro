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


final class BlogController extends AbstractController
{
    #[Route('/api/blogs')]
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer

    ) {}

    #[Route ('/', name: 'app_blog_list', methods:['Get'])]
    public function list() :JsonResponse
    {
        $blogs = $this->entityManager->getRepository(Blog::class)->findAll();
        return new JsonResponse(
            $this->serializer->serialize($blogs, 'json'),
            Response::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{$id}', name: 'app_blog_show', methods: 'GET')]
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
   
   

    #[Route('/', name: 'app_blog_create', methods: 'POST')]
    public function create(Request $request): JsonResponse
    {
       $data = json_decode($request->getContent(), true);
       
       $blog = new Blog();
       $blog -> setTitle($data['title']?? '');
       $blog -> setContent($data['content']?? '');

       $this -> entityManager -> persist($blog);
       $this->entityManager->flush();

       return new JsonResponse(
        $this -> serializer ->serialize($blog,'json'),
        Response :: HTTP_CREATED,
        [],
        true
       );
    }


    #[Route('/{$id}', name: 'app_blog_update', methods: 'PUT')]
    public function update(int $id, Request $request): JsonResponse
{
    $blog = $this->entityManager->getRepository(Blog::class)->find($id);
    if(!$blog){
        return new JsonResponse(['error' => 'Blog not found'], Response::HTTP_NOT_FOUND);
    }

    $data = json_decode ($request->getContent(), true);
    $blog -> setTitle($data['title']??$blog->getContent());
    $blog-> setContent($data['content']?? $blog->getCOntent());

    $this->entityManager -> flush();
    return new JsonResponse(
        $this -> serializer ->serialize($blog,'json'),
        Response ::HTTP_OK, 
        [],
        true

    );

}
#[Route ('/{$id}', name: 'app_blog_delete', methods :['DELETE'])]
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
