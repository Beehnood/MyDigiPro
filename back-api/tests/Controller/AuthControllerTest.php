<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthControllerTest extends WebTestCase
{
    private $client;

    protected function tearDown(): void
    {
        // Réinitialise le client entre les tests
        $this->client = null;
        parent::tearDown();
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->client = static::createClient();
    }

    
    public function testSuccessfulLoginReturnsJwtToken(): void
{
    $client = static::createClient();
    
    $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
        'email' => 'test@example.com',
        'password' => 'password123',
    ]));

    $this->assertResponseIsSuccessful();
    $responseData = json_decode($client->getResponse()->getContent(), true);
    $this->assertArrayHasKey('token', $responseData);
    $this->assertNotEmpty($responseData['token']);
}


public function testAccessDeniedWithoutToken(): void
{
    $client = static::createClient();
    $client->request('GET', '/api/films/random');

    $this->assertResponseStatusCodeSame(401); // Unauthorized
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
        // 1. D'abord créer un utilisateur
        $this->createTestUser();
        
        // 2. Puis tester le login
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
        
        $this->assertResponseIsSuccessful();
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('randomValue', $response);
        $this->assertIsInt($response['randomValue']);
    }
}