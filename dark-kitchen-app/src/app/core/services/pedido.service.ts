import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { PedidoModel, PedidoStatus, cartItemsToData } from '../models/pedido.model';
import { CartItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private firestore = inject(Firestore);
  private pedidosRef = collection(this.firestore, 'pedidos');

  /**
   * Cria um novo pedido no Firestore.
   * Chamado no ProcessingComponent após confirmação.
   */
  async criarPedido(
    clienteId: string,
    itens: any[], // 👈 Pode deixar como any[] para aceitar o carrinho completo
    enderecoEntrega: string,
    valorTotal: number,
    formaPagamento: 'entrega' | 'pix'
  ): Promise<string> {
    const pedido = {
      clienteId,
      // 👇 A MÁGICA: Removemos o cartItemsToData! Salvamos o carrinho cru e completo.
      itens: itens, 
      enderecoEntrega,
      valorTotal,
      formaPagamento,
      status: 'recebido',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(this.pedidosRef, pedido);
    return docRef.id;
  }

  /**
   * Lista TODOS os pedidos (uso administrativo futuro).
   */
  async listarPedidos(): Promise<PedidoModel[]> {
    const q = query(this.pedidosRef, orderBy('createdAt', 'desc'));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q as any);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PedidoModel));
  }

  /**
   * Busca pedidos de um cliente específico pelo seu UID.
   */
  async buscarPedidosPorUsuario(clienteId: string): Promise<PedidoModel[]> {
    const q = query(
      this.pedidosRef,
      where('clienteId', '==', clienteId),
      orderBy('createdAt', 'desc')
    );
    const snap: QuerySnapshot<DocumentData> = await getDocs(q as any);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PedidoModel));
  }

  /**
   * Busca um pedido específico por ID.
   */
  async buscarPedidoPorId(pedidoId: string): Promise<PedidoModel | null> {
    const docRef = doc(this.firestore, 'pedidos', pedidoId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as PedidoModel;
  }

  /**
   * Atualiza o status de um pedido.
   * Usado pelo administrador para controlar o andamento.
   */
  async atualizarStatusPedido(
    pedidoId: string,
    status: PedidoStatus
  ): Promise<void> {
    const docRef = doc(this.firestore, 'pedidos', pedidoId);
    await updateDoc(docRef, { status });
  }

  /** Retorna label amigável do status */
  labelStatus(status: PedidoStatus): string {
    const map: Record<PedidoStatus, string> = {
      recebido: '✅ Recebido',
      preparando: '👨‍🍳 Preparando',
      saiu_para_entrega: '🛵 Saiu para entrega',
      entregue: '🏠 Entregue',
    };
    return map[status] ?? status;
  }
  async atribuirMotoboy(pedidoId: string, nomeMotoboy: string) {
    const pedidoRef = doc(this.firestore, 'pedidos', pedidoId);
    
    // Atualiza o documento adicionando o nome da moto e mudando o status
    await updateDoc(pedidoRef, {
      motoboy: nomeMotoboy,
      status: 'saiu_para_entrega'
    });
  }
}
