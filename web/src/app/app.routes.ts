import { Routes } from '@angular/router';
import { CascaPublica } from './compartilhado/layout/casca-publica';
import { CascaConta } from './compartilhado/layout/casca-conta';
import { CascaAdmin } from './compartilhado/layout/casca-admin';
import { autenticadoGuard } from './nucleo/guards/autenticado.guard';
import { administradorGuard } from './nucleo/guards/administrador.guard';

export const routes: Routes = [
  {
    path: '',
    component: CascaPublica,
    children: [
      {
        path: '',
        loadComponent: () => import('./funcionalidades/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'sobre',
        loadComponent: () => import('./funcionalidades/paginas/paginas').then((m) => m.Sobre),
      },
      {
        path: 'servicos',
        loadComponent: () => import('./funcionalidades/paginas/paginas').then((m) => m.Servicos),
      },
      {
        path: 'regras',
        loadComponent: () => import('./funcionalidades/paginas/paginas').then((m) => m.Regras),
      },
      {
        path: 'contato',
        loadComponent: () => import('./funcionalidades/paginas/paginas').then((m) => m.Contato),
      },
      {
        path: 'entrar',
        loadComponent: () => import('./funcionalidades/autenticacao/entrar').then((m) => m.Entrar),
      },
      {
        path: 'cadastrar',
        loadComponent: () => import('./funcionalidades/autenticacao/cadastrar').then((m) => m.Cadastrar),
      },
      {
        path: 'recuperar-senha',
        loadComponent: () => import('./funcionalidades/autenticacao/senha').then((m) => m.RecuperarSenha),
      },
      {
        path: 'redefinir-senha',
        loadComponent: () => import('./funcionalidades/autenticacao/senha').then((m) => m.RedefinirSenha),
      },
    ],
  },
  {
    path: 'conta',
    component: CascaConta,
    canActivate: [autenticadoGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'animais' },
      {
        path: 'animais',
        loadComponent: () =>
          import('./funcionalidades/animais/lista-animais').then((m) => m.ListaAnimais),
      },
      {
        path: 'animais/novo',
        loadComponent: () =>
          import('./funcionalidades/animais/formulario-animal').then((m) => m.FormularioAnimal),
      },
      {
        path: 'animais/:id',
        loadComponent: () =>
          import('./funcionalidades/animais/formulario-animal').then((m) => m.FormularioAnimal),
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./funcionalidades/reserva/lista-reservas').then((m) => m.ListaReservas),
      },
      {
        path: 'reservas/nova',
        loadComponent: () =>
          import('./funcionalidades/reserva/nova-reserva').then((m) => m.NovaReserva),
      },
      {
        path: 'reservas/:id',
        loadComponent: () =>
          import('./funcionalidades/reserva/detalhe-reserva').then((m) => m.DetalheReserva),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./funcionalidades/conta/perfil').then((m) => m.Perfil),
      },
    ],
  },
  {
    path: 'admin',
    component: CascaAdmin,
    canActivate: [administradorGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./funcionalidades/administracao/painel').then((m) => m.PainelAdminPagina),
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./funcionalidades/administracao/reservas-admin').then((m) => m.ReservasAdmin),
      },
      {
        path: 'servicos',
        loadComponent: () =>
          import('./funcionalidades/administracao/servicos-admin').then((m) => m.ServicosAdmin),
      },
      {
        path: 'bloqueios',
        loadComponent: () =>
          import('./funcionalidades/administracao/bloqueios-admin').then((m) => m.BloqueiosAdmin),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
