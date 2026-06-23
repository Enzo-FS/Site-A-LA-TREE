// Model de produto para o Firestore (coleção: produtos)
// Preparado para futuramente usar Firebase Storage para imagens
export interface ProdutoModel {
  id?: string;            // ID automático do Firestore
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;         // URL da imagem (local ou Firebase Storage)
  categoria: string;
  rating?: number;
  tempo?: string;         // Ex: "30–45 min"
  ativo?: boolean;        // Para desabilitar produto sem deletar
  createdAt?: Date | any;
}
