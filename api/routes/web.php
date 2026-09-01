<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return [
        'name' => 'Amo Pet House API',
        'version' => 'v1',
    ];
});
