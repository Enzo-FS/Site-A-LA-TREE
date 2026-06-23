import { Injectable, signal, computed, inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Food, CartItem, User, PaymentType } from '../models/models';
import { AuthService } from './auth.service';
import { PedidoService } from './pedido.service';
import { ProdutoService } from './produto.service';

export const FOODS: Food[] = [];

export const FILTERS = ['Todos', 'Pratos', 'Lanches', 'Porções', 'Bebidas', 'Entrada'];

export const CAT_MAP: Record<string, string[] | null> = {
  'Todos': null,
  'Porções': ['Porções'],
  'Entrada': ['Entrada'],
  'Pratos': ['Pratos'],
  'Lanches': ['Lanches'], // 👈 Nova categoria mapeada aqui!
  'Bebidas': ['Bebidas'],
};

export const DAYS_MENU: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

export const DETAIL_TABS_CONTENT: Array<(desc: string) => string> = [
  (desc) => desc,
  () => 'Feito com ingredientes frescos e selecionados, seguindo a receita tradicional da casa criada com todo o carinho pelo nosso chef.',
  () => '• Embalagem térmica segura<br>• Tempo médio: 30–45 min<br>• Entrega limpa e sem contato disponível',
];

@Injectable({ providedIn: 'root' })
export class AppStateService {
  
  // 1. Guardamos APENAS o Injetor Mestre do Angular
  private injector = inject(Injector);

  // 2. Atalhos Preguiçosos: O Angular só vai construir esses serviços na hora exata do uso
  private get authService(): AuthService { return this.injector.get(AuthService); }
  private get pedidoService(): PedidoService { return this.injector.get(PedidoService); }
  private get produtoService(): ProdutoService { return this.injector.get(ProdutoService); }
  private get router(): Router { return this.injector.get(Router); }

  // ── State signals ────
  user = signal<User | null>(null);
  isGuest = signal(false);
  cart = signal<CartItem[]>([]);
  exploreFilter = signal('Todos');
  selectedFood = signal<Food | null>(null);
  detailTab = signal(0);
  notifOn = signal(true);
  selectedPayment = signal<PaymentType>('entrega');
  dayModalOpen = signal(false);
  dayModalTitle = signal('');
  dayModalFoods = signal<Food[]>([]);

  // Loading e erro para operações assíncronas
  loading = signal(false);
  authError = signal('');

  // Lista de pedidos do usuário (carregada da coleção pedidos)
  meusPedidos = signal<any[]>([]);

  // ── Computed ───────────────────────────────────────────────
  cartCount = computed(() => this.cart().reduce((s, i) => s + i.qty, 0));
  cartTotal = computed(() => this.cart().reduce((s, i) => s + i.food.price * i.qty, 0));

  constructor() {
    // 3. O Atraso Mágico: Garante que o AppStateService nasça 100% antes de chamar os ajudantes
    Promise.resolve().then(() => {
      this.tentarRestaurarSessao();
      this.carregarCardapio();
    });
  }

  async carregarCardapio(): Promise<void> {
    try {
      const produtos = await this.produtoService.listarProdutos();
      FOODS.length = 0;
      produtos.forEach((produto:any,index:number)=>{
        FOODS.push(this.produtoService.produtoParaFood(produto,index));
      });
    } catch (err) {
      console.error('Erro ao carregar cardápio:', err);
    }
  }

  // ── Sessão ─────────────────────────────────────────────────
  private async tentarRestaurarSessao(): Promise<void> {
    try {
      const u = await this.authService.restaurarSessao();
      if (u) {
        this.user.set(u);
        this.isGuest.set(false);
        this.router.navigate(['/home']); // Navegação real
      }
    } catch {
      // Sem sessão ativa
    }
  }

  // ── Auth ───────────────────────────────────────────────────

  async doRegister(
    name: string,
    email: string,
    pass: string,
    addr: string,
    telefone?: string
  ): Promise<string | null> {
    if (!name || !email || !pass) return 'Nome, e-mail e senha são obrigatórios.';
    this.loading.set(true);
    this.authError.set('');
    try {
      const u = await this.authService.cadastrar(name, email, pass, addr, telefone);
      this.user.set(u);
      this.isGuest.set(false);
      this.cart.set([]);
      this.router.navigate(['/home']); 
      return null;
    } catch (err) {
      const msg = this.authService.traduzirErro(err);
      this.authError.set(msg);
      return msg;
    } finally {
      this.loading.set(false);
    }
  }

  /** Login com Interceptador de Papéis (Admin, Motoboy, Cliente) */
  async doLogin(email: string, pass: string): Promise<string | null> {
    if (!email || !pass) return 'Preencha todos os campos.';
    this.loading.set(true);
    this.authError.set('');
    
    try {
      // 👑 1. Interceptador de Administrador
      if (email === 'loja' && pass === 'loja') {
        this.user.set({ id: 'admin_id', name: 'Painel Gerencial', email: 'adminloja' });
        this.isGuest.set(false);
        this.router.navigate(['/painel']); // Redireciona para o StoreManager
        return null;
      }

      if (email === 'finan' && pass === 'finan') {
        this.user.set({ id: 'finan_id', name: 'Financ', email: 'Finloja' });
        this.isGuest.set(false);
        window.location.href = 'https://gerencia-a-la-tree.web.app/';
        return null;
      }

      // 🛵 2. Interceptador de Motoboy
      if (email === 'Motoca' && pass === 'motoca') {
        this.user.set({ id: 'motoboy_id', name: 'Painel Motoboy', email: 'Motoca' });
        this.isGuest.set(false);
        this.router.navigate(['/motoboy']); // Redireciona para o DriverPanel
        return null;
      }

      // 🍔 3. Fluxo Normal de Cliente (Valida no Banco de Dados)
      const u = await this.authService.login(email, pass);
      this.user.set(u);
      this.isGuest.set(false);
      this.cart.set([]);
      this.router.navigate(['/home']); // Redireciona para a Home do Cliente
      return null;

    } catch (err) {
      const msg = this.authService.traduzirErro(err);
      this.authError.set(msg);
      return msg;
    } finally {
      this.loading.set(false);
    }
  }

  enterAsGuest(): void {
    this.user.set(null);
    this.isGuest.set(true);
    this.cart.set([]);
    this.router.navigate(['/home']); 
  }

  async doLogout(): Promise<void> {
    try {
      await this.authService.logout();
    } finally {
      this.user.set(null);
      this.isGuest.set(false);
      this.cart.set([]);
      this.meusPedidos.set([]);
      this.router.navigate(['/login']); 
    }
  }

  // ── Pedidos ────────────────────────────────────────────────
  async finalizarPedido(): Promise<string | null> {
    const u = this.user();
    if (!u?.id) return 'Você precisa estar logado para fazer um pedido.';

    const itens = this.cart();
    if (itens.length === 0) return 'Carrinho vazio.';

    const endereco = u.endereco ?? 'Endereço não informado';
    const total = this.cartTotal();
    const forma = this.selectedPayment();

    try {
      const id = await this.pedidoService.criarPedido(
        u.id, itens, endereco, total, forma
      );
      this.cart.set([]);
      return id;
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      return null;
    }
  }

  async carregarMeusPedidos(): Promise<void> {
    const u = this.user();
    if (!u?.id) return;
    try {
      const pedidos = await this.pedidoService.buscarPedidosPorUsuario(u.id);
      this.meusPedidos.set(pedidos);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    }
  }

  // ── Carrinho ───────────────────────────────────────────────
  addToCart(food: Food): boolean {
    if (this.isGuest()) return false;
    const current = [...this.cart()];
    const existing = current.find(i => i.food.id === food.id);
    if (existing) existing.qty++;
    else current.push({ food, qty: 1 });
    this.cart.set(current);
    return true;
  }

  adjustQty(id: number, delta: number): void {
    this.cart.set(
      this.cart()
        .map(i => i.food.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }

  removeItem(id: number): void {
    this.cart.set(this.cart().filter(i => i.food.id !== id));
  }

  // ── Explore ────────────────────────────────────────────────
  setFilter(f: string): void { this.exploreFilter.set(f); }

  filteredFoods(): Food[] {
    const cats = CAT_MAP[this.exploreFilter()];
    return cats ? FOODS.filter(f => cats.includes(f.category)) : FOODS;
  }

  // ── Detail ─────────────────────────────────────────────────
  openDetail(id: number): void {
    this.selectedFood.set(FOODS.find(f => f.id === id) ?? null);
    this.detailTab.set(0);
    this.router.navigate(['/detalhes']); 
  }

  // ── Day Modal ──────────────────────────────────────────────
  openDayModal(dayIndex: number, label: string): void {
    const ids = DAYS_MENU[dayIndex] || [];
    this.dayModalFoods.set(ids.map(id => FOODS.find(f => f.id === id)!).filter(Boolean));
    this.dayModalTitle.set(`Cardápio — ${label}`);
    this.dayModalOpen.set(true);
  }

  closeDayModal(): void { this.dayModalOpen.set(false); }

  logout() {
    // 1. Remove os dados do usuário da memória
    this.user.set(null); 
    
    // 2. Tira o status de visitante (se ele for um)
    this.isGuest.set(false); 
    
    // 3. Esvazia o carrinho para o próximo usuário não ver os itens
    this.cart.set([]); 
    
    // 4. Se o seu AuthService tiver uma função de logout real do Firebase, 
    // basta descomentar a linha abaixo no futuro:
    // this.authService.logout();
  }
}


/*import { Injectable, signal, computed, inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Food, CartItem, User, PaymentType } from '../models/models';
import { AuthService } from './auth.service';
import { PedidoService } from './pedido.service';
import { ProdutoService } from './produto.service';


//private router = inject(Router);

export const FOODS: Food[] = [];

export const FILTERS = ['Todos', 'Porções', 'Entrada', 'Pratos', 'Bebidas'];
export const CAT_MAP: Record<string, string[] | null> = {
  'Todos': null,
  'Porções': ['Porções'],
  'Entrada': ['Entrada'],
  'Pratos': ['Pratos'],
  'Bebidas': ['Bebidas'],
};

export const DAYS_MENU: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

export const DETAIL_TABS_CONTENT: Array<(desc: string) => string> = [
  (desc) => desc,
  () => 'Feito com ingredientes frescos e selecionados, seguindo a receita tradicional da casa criada com todo o carinho pelo nosso chef.',
  () => '• Embalagem térmica segura<br>• Tempo médio: 30–45 min<br>• Entrega limpa e sem contato disponível',
];

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private authService = inject(AuthService);
  private pedidoService = inject(PedidoService);
  private produtoService = inject(ProdutoService);
  private injector = inject(Injector);
  private get router(): Router {
  return this.injector.get(Router);
}

  // ── State signals (Removido currentScreen e prevScreen) ────
  user = signal<User | null>(null);
  isGuest = signal(false);
  cart = signal<CartItem[]>([]);
  exploreFilter = signal('Todos');
  selectedFood = signal<Food | null>(null);
  detailTab = signal(0);
  notifOn = signal(true);
  selectedPayment = signal<PaymentType>('entrega');
  dayModalOpen = signal(false);
  dayModalTitle = signal('');
  dayModalFoods = signal<Food[]>([]);

  // Loading e erro para operações assíncronas
  loading = signal(false);
  authError = signal('');

  // Lista de pedidos do usuário (carregada da coleção pedidos)
  meusPedidos = signal<any[]>([]);

  // ── Computed ───────────────────────────────────────────────
  cartCount = computed(() => this.cart().reduce((s, i) => s + i.qty, 0));
  cartTotal = computed(() => this.cart().reduce((s, i) => s + i.food.price * i.qty, 0));

  constructor() {
    // Tenta restaurar sessão existente ao iniciar o app
    this.tentarRestaurarSessao();
    this.carregarCardapio();
  }

  async carregarCardapio(): Promise<void> {
    try {
      const produtos = await this.produtoService.listarProdutos();
      FOODS.length = 0;
      produtos.forEach((produto:any,index:number)=>{
        FOODS.push(this.produtoService.produtoParaFood(produto,index));
      });
    } catch (err) {
      console.error('Erro ao carregar cardápio:', err);
    }
  }

  // ── Sessão ─────────────────────────────────────────────────
  private async tentarRestaurarSessao(): Promise<void> {
    try {
      const u = await this.authService.restaurarSessao();
      if (u) {
        this.user.set(u);
        this.isGuest.set(false);
        this.router.navigate(['/home']); // Navegação real
      }
    } catch {
      // Sem sessão ativa
    }
  }

  async doRegister(
    name: string,
    email: string,
    pass: string,
    addr: string,
    telefone?: string
  ): Promise<string | null> {
    if (!name || !email || !pass) return 'Nome, e-mail e senha são obrigatórios.';
    this.loading.set(true);
    this.authError.set('');
    try {
      const u = await this.authService.cadastrar(name, email, pass, addr, telefone);
      this.user.set(u);
      this.isGuest.set(false);
      this.cart.set([]);
      this.router.navigate(['/home']); // Navegação real
      return null;
    } catch (err) {
      const msg = this.authService.traduzirErro(err);
      this.authError.set(msg);
      return msg;
    } finally {
      this.loading.set(false);
    }
  }

 
  async doLogin(email: string, pass: string): Promise<string | null> {
    if (!email || !pass) return 'Preencha todos os campos.';
    this.loading.set(true);
    this.authError.set('');
    try {
      const u = await this.authService.login(email, pass);
      this.user.set(u);
      this.isGuest.set(false);
      this.cart.set([]);
      this.router.navigate(['/home']); // Navegação real
      return null;
    } catch (err) {
      const msg = this.authService.traduzirErro(err);
      this.authError.set(msg);
      return msg;
    } finally {
      this.loading.set(false);
    }
  }

 
  enterAsGuest(): void {
    this.user.set(null);
    this.isGuest.set(true);
    this.cart.set([]);
    this.router.navigate(['/home']); // Navegação real
  }


  async doLogout(): Promise<void> {
    try {
      await this.authService.logout();
    } finally {
      this.user.set(null);
      this.isGuest.set(false);
      this.cart.set([]);
      this.meusPedidos.set([]);
      this.router.navigate(['/login']); // Redireciona para o login ao sair
    }
  }

  // ── Pedidos ────────────────────────────────────────────────
  async finalizarPedido(): Promise<string | null> {
    const u = this.user();
    if (!u?.id) return 'Você precisa estar logado para fazer um pedido.';

    const itens = this.cart();
    if (itens.length === 0) return 'Carrinho vazio.';

    const endereco = u.endereco ?? 'Endereço não informado';
    const total = this.cartTotal();
    const forma = this.selectedPayment();

    try {
      const id = await this.pedidoService.criarPedido(
        u.id, itens, endereco, total, forma
      );
      this.cart.set([]);
      return id;
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      return null;
    }
  }

  async carregarMeusPedidos(): Promise<void> {
    const u = this.user();
    if (!u?.id) return;
    try {
      const pedidos = await this.pedidoService.buscarPedidosPorUsuario(u.id);
      this.meusPedidos.set(pedidos);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    }
  }

  // ── Carrinho ───────────────────────────────────────────────
  addToCart(food: Food): boolean {
    if (this.isGuest()) return false;
    const current = [...this.cart()];
    const existing = current.find(i => i.food.id === food.id);
    if (existing) existing.qty++;
    else current.push({ food, qty: 1 });
    this.cart.set(current);
    return true;
  }

  adjustQty(id: number, delta: number): void {
    this.cart.set(
      this.cart()
        .map(i => i.food.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }

  removeItem(id: number): void {
    this.cart.set(this.cart().filter(i => i.food.id !== id));
  }

  // ── Explore ────────────────────────────────────────────────
  setFilter(f: string): void { this.exploreFilter.set(f); }

  filteredFoods(): Food[] {
    const cats = CAT_MAP[this.exploreFilter()];
    return cats ? FOODS.filter(f => cats.includes(f.category)) : FOODS;
  }

  // ── Detail ─────────────────────────────────────────────────
  openDetail(id: number): void {
    this.selectedFood.set(FOODS.find(f => f.id === id) ?? null);
    this.detailTab.set(0);
    // Aqui usamos o router para ir para a tela de detalhes
    this.router.navigate(['/detalhes']); 
  }

  // ── Day Modal ──────────────────────────────────────────────
  openDayModal(dayIndex: number, label: string): void {
    const ids = DAYS_MENU[dayIndex] || [];
    this.dayModalFoods.set(ids.map(id => FOODS.find(f => f.id === id)!).filter(Boolean));
    this.dayModalTitle.set(`Cardápio — ${label}`);
    this.dayModalOpen.set(true);
  }

  closeDayModal(): void { this.dayModalOpen.set(false); }
}

*/