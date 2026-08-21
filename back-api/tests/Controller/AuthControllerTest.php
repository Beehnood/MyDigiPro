<?php

namespace App\Tests\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthControllerTest extends WebTestCase
{
    private $client;

    protected function setUp(): void
    {
        parent::setUp();
        static::ensureKernelShutdown();
        $this->client = static::createClient();
        $this->resetDatabase();
    }

    public function testSuccessfulLoginReturnsJwtToken(): void
    {
        $this->createTestUser();

        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'email' => 'testlogin@example.com',
            'password' => 'Password123',
        ]));

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $responseData);
        $this->assertNotEmpty($responseData['token']);
    }

    public function testAccessDeniedWithoutToken(): void
    {
        $this->client->request('GET', '/api/admin/secret');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testRegister(): void
    {
        $uniqueId = uniqid();

        $this->client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json'
        ], json_encode([
            'email' => "test{$uniqueId}@example.com",
            'password' => 'Password123',
            'username' => "user{$uniqueId}",
            'interests' => ['28', '35', '18'],
        ]));

        $this->assertResponseStatusCodeSame(201);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('message', $response);
    }

    public function testRegisterStoresSelectedGenreIds(): void
    {
        $genreIds = ['28', '35', '18'];

        $this->client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'email' => 'genres@example.com',
            'password' => 'Password123',
            'username' => 'genre-user',
            'interests' => $genreIds,
        ]));

        $this->assertResponseStatusCodeSame(201);

        $entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $user = $entityManager->getRepository(User::class)->findOneBy([
            'email' => 'genres@example.com',
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertSame($genreIds, explode(',', $user->getInterests()));
    }

    public function testRegisterRejectsDuplicateGenreIds(): void
    {
        $this->client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'email' => 'duplicate-genres@example.com',
            'password' => 'Password123',
            'username' => 'duplicate-genre-user',
            'interests' => ['28', '28', '18'],
        ]));

        $this->assertResponseStatusCodeSame(400);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertSame('Veuillez choisir 3 genres différents.', $response['error']);
    }

    public function testRegisterWithInvalidData(): void
    {
        $this->client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json'
        ], json_encode([
            'email' => 'invalid-email',
            'password' => 'short',
            'username' => 'test',
            'interests' => ['28', '35', '18'],
        ]));

        $this->assertResponseStatusCodeSame(400);
    }

    public function testLogin(): void
    {
        $this->createTestUser();

        $this->client->request('POST', '/api/login', [], [], [
            'CONTENT_TYPE' => 'application/json'
        ], json_encode([
            'email' => 'testlogin@example.com',
            'password' => 'Password123'
        ]));

        $this->assertResponseIsSuccessful();
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $response);
    }

    private function createTestUser(): void
    {
        $this->client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json'
        ], json_encode([
            'email' => 'testlogin@example.com',
            'password' => 'Password123',
            'username' => 'testloginuser',
            'interests' => ['28', '35', '18'],
        ]));
    }

    public function testRandomizer(): void
    {
        $this->client->request('GET', '/api/randomize');

        $this->assertResponseStatusCodeSame(401);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertSame('Non authentifié', $response['error']);
    }

    private function resetDatabase(): void
    {
        $entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $metadata = $entityManager->getMetadataFactory()->getAllMetadata();

        if ($metadata === []) {
            return;
        }

        $schemaTool = new SchemaTool($entityManager);
        $schemaTool->dropDatabase();
        $schemaTool->createSchema($metadata);
    }
}
