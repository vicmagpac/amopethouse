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

Na primeira vez:

```bash
docker compose exec api php artisan migrate --seed
docker compose exec api php artisan storage:link
```

- Site: http://localhost:4201
- API: http://localhost:8001
- E-mails locais: http://localhost:8026

## Contas

- Tutor: crie em `/cadastrar`, cadastre os pets em `/conta/animais` e agende em `/conta/reservas/nova`.
- Equipe: `admin@amopethouse.com.br` / `AdminAmo@2026` → painel em `/admin`.

O pagamento online (Mercado Pago) não faz parte deste recorte: a reserva é confirmada no site e o valor é cobrado no checkout presencial. A equipe marca “Recebido” no painel.

## Nomenclatura

O domínio está em português: `usuarios`, `animais`, `reservas`, `tipos_servico`, rotas `/entrar`, `/cadastrar`, `/conta/reservas`, `/admin`.
