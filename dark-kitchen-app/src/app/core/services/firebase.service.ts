// firebase.service.ts
// Serviço de suporte — centraliza inicialização e expõe
// instâncias do Firebase para uso nos services especializados.
// Os services reais (auth, pedido, produto) injetam diretamente
// via @angular/fire, mas este arquivo serve como ponto de referência
// e pode ser expandido para operações genéricas de Firestore.

import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  readonly firestore = inject(Firestore);
  readonly auth = inject(Auth);

  /** Retorna referência a uma coleção */
  colRef(path: string) {
    return collection(this.firestore, path);
  }

  /** Retorna referência a um documento */
  docRef(path: string, id: string) {
    return doc(this.firestore, path, id);
  }

  /** Retorna UID do usuário atual (ou null) */
  get currentUid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
}
