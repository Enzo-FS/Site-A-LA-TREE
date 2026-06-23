import { Injectable, inject } from '@angular/core';
import { collection, getDocs } from '@angular/fire/firestore';
import { Food } from '../models/models';
import { FIRESTORE_GERENCIA } from './firestore-gerencia.token';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  // Catálogo vem do banco 'gerencia-a-la-tree' (onde o painel administrativo cadastra os produtos)
  private firestore = inject(FIRESTORE_GERENCIA);
  private produtosRef = collection(this.firestore, 'cardapio');

  async listarProdutos(): Promise<any[]> {
    const snap = await getDocs(this.produtosRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async buscarProdutoPorId(produtoId: string): Promise<any | null> {
    const produtos = await this.listarProdutos();
    return produtos.find(p => p.id === produtoId) || null;
  }

  produtoParaFood(produto: any, index: number): Food {
    return {
      id: index + 1,
      name: produto.name || produto.nome || 'Produto',
      category: produto.categoria || produto.category || 'Pratos',
      price: produto.price ?? produto.preco ?? 0,
      rating: produto.rating ?? 4.5,
      time: produto.tempo || produto.time || '30-45 min',
      img: produto.imageUrl || produto.imagem || produto.img || '',
      desc: produto.descricao
        || produto.desc
        || produto.ingredientes?.map((i: any) => (typeof i === 'string' ? i : i.nome)).join(', ')
        || ''
    };
  }

  produtosParaFoods(produtos: any[]): Food[] {
    return produtos.map((p, i) => this.produtoParaFood(p, i));
  }
}
