import { Routes } from '@angular/router';
import { CascaPublica } from './compartilhado/layout/casca-publica';
import { CascaConta } from './compartilhado/layout/casca-conta';
import { autenticadoGuard } from './nucleo/guards/autenticado.guard';

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
        path: 'perfil',
        loadComponent: () => import('./funcionalidades/conta/perfil').then((m) => m.Perfil),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
