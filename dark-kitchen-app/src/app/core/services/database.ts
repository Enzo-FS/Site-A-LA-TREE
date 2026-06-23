import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FIRESTORE_MOTOBOY } from './firestore-motoboy.token';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // 👇 A ÚNICA LINHA QUE MUDOU: Trocamos inject(Firestore) por inject(FIRESTORE_MOTOBOY)
  private firestore: Firestore = inject(FIRESTORE_MOTOBOY);

  // 1. Função de Gravar (Mantida igual)
  addMotoboy(dados: any) {
    const motoboysRef = collection(this.firestore, 'motoboys');
    return addDoc(motoboysRef, dados);
  }

  // 2. Função de Ler (Mantida igual)
  getMotoboys(): Observable<any[]> {
    const motoboysRef = collection(this.firestore, 'motoboys');
    
    // Criamos o nosso próprio fluxo de dados contornando o bug do AngularFire
    return new Observable(observer => {
      
      const unsubscribe = onSnapshot(motoboysRef, 
        (snapshot) => {
          // Extrai os dados e já cola a ID do documento junto
          const motoboys = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          observer.next(motoboys); // Manda a lista pronta para a tela
        },
        (error) => {
          console.error("Erro interno ao tentar escutar o Firebase:", error);
          observer.error(error);
        }
      );

      // Limpa a memória quando a tela for fechada
      return () => unsubscribe();
    });
  }
}