<?php

namespace Tests\Feature;

use Tests\TestCase;

class AplicacaoTest extends TestCase
{
    public function test_a_api_responde(): void
    {
        $this->get('/')->assertOk()->assertJsonPath('name', 'Amo Pet House API');
    }
}
