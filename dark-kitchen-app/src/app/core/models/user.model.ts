// Model de usuário para o Firestore (coleção: clientes)
// A senha NÃO é salva aqui — fica somente no Firebase Authentication
export interface UserModel {
  id?: string;        // UID do Firebase Auth (usado como ID do documento)
  nome: string;
  email: string;
  endereco?: string;
  telefone?: string;
  createdAt?: Date | any;
}
