<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class JwtCreateListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();
        if ($user instanceof UserInterface) {
            $payload = $event->getData();
            $payload['roles'] = $user->getRoles();
            $event->setData($payload);
        }
    }
}