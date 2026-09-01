# Amo Pet House

Hotel e cuidados para cães e gatos em Papicu, Fortaleza. Este repositório contém a API (Laravel 13) e o site (Angular 22).

## Stack

- API: Laravel 13, Sanctum, PostgreSQL 16, Redis, PHP 8.4
- Site: Angular 22, Angular Material 3
- Infra local: Docker Compose, Mailpit

## Como subir

Na raiz do projeto:

```bash
docker compose up --build
```

Em outro terminal, na primeira vez:

```bash
docker compose exec api php artisan migrate
docker compose exec api php artisan storage:link
```

- Site: http://localhost:4200
- API: http://localhost:8000
- E-mails locais: http://localhost:8025

## Contas

Crie um tutor em `/cadastrar`. Depois cadastre os animais em `/conta/animais`.

O pagamento online (Mercado Pago) não faz parte deste recorte: a reserva futura será confirmada no site e o valor cobrado no checkout presencial.

## Nomenclatura

O domínio está em português: `usuarios`, `animais`, `registros_vacinas`, rotas `/entrar`, `/cadastrar`, `/animais`.
