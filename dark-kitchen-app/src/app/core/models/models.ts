// ============================================================
// models.ts — Modelos centrais da aplicação
// ============================================================

// Produto do cardápio (usado internamente na UI e no serviço)
export interface Food {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  time: string;
  img: string;
  desc: string;
}

// Item no carrinho
export interface CartItem {
  food: Food;
  qty: number;
}

// Usuário logado (em memória, vindo do Firebase Auth + Firestore)
export interface User {
  id?: string;      // UID do Firebase Auth
  name: string;     // Campo 'nome' do Firestore
  email: string;
  endereco?: string;
  telefone?: string;
}

// Navegação de telas (SPA sem roteador)
export type Screen =
  | 'welcome'
  | 'login'
  | 'register'
  | 'home'
  | 'explore'
  | 'orders'
  | 'detail'
  | 'payment'
  | 'confirmation'
  | 'processing'
  | 'profile';

export type PaymentType = 'entrega' | 'pix';
