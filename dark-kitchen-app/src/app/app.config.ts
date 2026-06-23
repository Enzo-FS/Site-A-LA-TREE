import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; 

// ── Importações do Firebase ──────────────────────────────────────────
import { provideFirebaseApp, initializeApp, getApp, getApps } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

// ── Importações de Ambiente e Tokens ─────────────────────────────────
import { environment } from '../environments/environment';
import { FIRESTORE_GERENCIA } from './core/services/firestore-gerencia.token'; // Verifique esse caminho!
import { FIRESTORE_MOTOBOY } from './core/services/firestore-motoboy.token';   // Verifique esse caminho!

export const appConfig: ApplicationConfig = {
  // 👇 ESTE É O ARRAY DE PROVIDERS! 👇
  providers: [
    
    // 1. Roteador
    provideRouter(routes),

    // 2. App principal (cardapio-a-la-tree): clientes, pedidos
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

    // 3. App secundária (gerencia-a-la-tree): catálogo
    provideFirebaseApp(() => initializeApp(environment.firebaseGerencia, 'gerencia')),
    {
      provide: FIRESTORE_GERENCIA,
      useFactory: () => getFirestore(getApp('gerencia')),
    },

    // 4. App terciária (motoboy) - INICIALIZAÇÃO SEGURA (Anti-Tela Branca)
    {
      provide: FIRESTORE_MOTOBOY,
      useFactory: () => {
        const appsAtivos = getApps();
        // Tenta achar o app ligado. Se não achar, ele liga na hora!
        const motoboyApp = appsAtivos.find(app => app.name === 'motoboy') 
                           || initializeApp(environment.firebaseMotoboy, 'motoboy');
                           
        return getFirestore(motoboyApp);
      },
    },

  ]
};