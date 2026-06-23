import { InjectionToken } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

/**
 * Token para a instância de Firestore do banco 'gerencia-a-la-tree'.
 * Usado para buscar o catálogo (coleção 'cardapio') cadastrado no
 * painel administrativo, separado do banco principal 'cardapio-a-la-tree'
 * (que cuida de login, pedidos e cadastros de usuário).
 */
export const FIRESTORE_GERENCIA = new InjectionToken<Firestore>('FIRESTORE_GERENCIA');
