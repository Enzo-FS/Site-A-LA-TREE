
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private firestore = inject(Firestore);

  async cadastrar(nome:string,email:string,senha:string,endereco:string,telefone?:string){
    const uid = email.replace(/[^a-zA-Z0-9]/g,'_');
    await setDoc(doc(this.firestore,'clientes',uid),{
      nome,email,endereco,telefone:telefone||'',createdAt:new Date()
    });
    return {id:uid,name:nome,email,endereco,telefone};
  }

  async login(email:string,senha:string){
    const uid = email.replace(/[^a-zA-Z0-9]/g,'_');
    const snap = await getDoc(doc(this.firestore,'clientes',uid));
    if(!snap.exists()) throw new Error('Usuário não encontrado');
    const d:any=snap.data();
    return {id:uid,name:d.nome,email:d.email,endereco:d.endereco,telefone:d.telefone};
  }

  async logout(){}
  async restaurarSessao(){ return null; }
  traduzirErro(e:any){ return e?.message || 'Erro'; }
}
