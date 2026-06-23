import { CartItem } from './models';

// Status possíveis de um pedido
export type PedidoStatus =
  | 'recebido'
  | 'preparando'
  | 'saiu_para_entrega'
  | 'entregue';

// Model de pedido para o Firestore (coleção: pedidos)
export interface PedidoModel {
  id?: string;                    // ID automático do Firestore
  clienteId: string;              // UID do Firebase Auth do cliente
  itens: CartItemData[];
  enderecoEntrega: string;
  valorTotal: number;
  status: PedidoStatus;
  formaPagamento: 'entrega' | 'pix';
  createdAt?: Date | any;
}

// Versão serializada do CartItem para salvar no Firestore
export interface CartItemData {
  foodId: number;
  foodName: string;
  foodPrice: number;
  foodImg: string;
  qty: number;
}

// Converte CartItem[] em CartItemData[] para salvar
export function cartItemsToData(items: CartItem[]): CartItemData[] {
  return items.map(i => ({
    foodId: i.food.id,
    foodName: i.food.name,
    foodPrice: i.food.price,
    foodImg: i.food.img,
    qty: i.qty,
  }));
}
