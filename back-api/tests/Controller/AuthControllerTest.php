<?php

namespace App\Tests\Controller;

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
            'password' => 'password123',
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
            'password' => 'password123',
            'username' => "user{$uniqueId}",
            'firstName' => 'Test',
            'lastName' => 'User',
            'country' => 'France',
            'city' => 'Paris'
        ]));

        $this->assertResponseStatusCodeSame(201);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('message', $response);
    }

    public function testRegisterWithInvalidData(): void
    {
        $this->client->request('POST', '/api/register', [], [], [
            'CONTENT_TYPE' => 'application/json'
        ], json_encode([
            'email' => 'invalid-email',
            'password' => 'short',
            'username' => 'test',
            'firstName' => 'Test',
            'lastName' => 'User',
            'city' => 'Paris'
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
            'password' => 'password123'
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
            'password' => 'password123',
            'username' => 'testloginuser',
            'firstName' => 'Test',
            'lastName' => 'Login',
            'country' => 'France',
            'city' => 'Paris'
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
