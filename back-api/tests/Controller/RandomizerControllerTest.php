<?php


namespace App\Tests\Controller;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

class RandomizerControllerTest extends WebTestCase
{
    public function testRandomizer(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/randomize');

        $this->assertResponseIsSuccessful();
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('randomValue', $response);
        $this->assertIsInt($response['randomValue']);
    }

    public function testRandomFilmWithAuth(): void
    {
        $client = static::createClient();

        // Authentifier un utilisateur
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'email' => 'test@example.com',
            'password' => 'password123',
        ]));

        $data = json_decode($client->getResponse()->getContent(), true);
        $token = $data['token'];

        // Requête avec token
        $client->request('GET', '/api/randomize', [], [], [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token
        ]);

        $this->assertResponseIsSuccessful();
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('title', $response);
    }

    public function testRandomFilmWithoutAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/randomize');

        $this->assertResponseStatusCodeSame(401);
    }

}