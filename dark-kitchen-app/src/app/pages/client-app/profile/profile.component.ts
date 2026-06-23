import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStateService } from '../../../core/services/app-state.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  template: `
    <div class="profile-screen">
      <div class="top-bar">
        <button class="icon-btn" (click)="irPara('/home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span class="top-bar-title">Minha Conta</span>
        <div style="width:2.2rem"></div>
      </div>

      <!-- Card do usuário logado -->
      <div class="profile-card" *ngIf="!state.isGuest() && state.user() as u">
        <div class="profile-info">
          <h3>{{ u.name }}</h3>
          <p>{{ u.email }}</p>
          <small *ngIf="u.endereco">📍 {{ u.endereco }}</small>
          <small *ngIf="u.telefone" style="margin-top:2px">📞 {{ u.telefone }}</small>
        </div>
        <div class="profile-avatar">👤</div>
      </div>

      <!-- Card visitante -->
      <div class="profile-guest-card" *ngIf="state.isGuest()">
        <h3>Você está como Visitante</h3>
        <p>Crie uma conta ou faça login para acompanhar seus pedidos.</p>
        <button class="btn btn-primary" (click)="irPara('/login')">Fazer Login / Cadastrar</button>
      </div>

      <!-- Seção de pedidos inline (somente usuário logado) -->
      <div class="pedidos-section" *ngIf="!state.isGuest() && state.user()">
        <div class="section-title-row">
          <span class="section-title">📦 Meus Pedidos</span>
          <button class="reload-btn" (click)="carregarPedidos()">↻ Atualizar</button>
        </div>

        <div *ngIf="carregando" class="pedidos-loading">Buscando seus pedidos...</div>

        <div *ngIf="!carregando && meusPedidos.length === 0" class="pedidos-empty">
          <div style="font-size:2rem;margin-bottom:0.4rem">🍽️</div>
          Você ainda não fez nenhum pedido.
          <br>
          <button class="btn-explore" (click)="irPara('/explorar')">Ver Cardápio</button>
        </div>

        <div class="pedido-card" *ngFor="let p of meusPedidos" (click)="abrirPedido(p.id)">
          <div class="pedido-card-top">
            <span class="pedido-date">{{ formatarData(p.createdAt) }}</span>
            <span class="pedido-status" [class]="'status-' + p.status">{{ traduzirStatus(p.status) }}</span>
          </div>
          <div class="pedido-card-bottom">
            <span class="pedido-itens">{{ p.itens?.length ?? 0 }} item(ns)</span>
            <span class="pedido-total">R$ {{ p.valorTotal }},00</span>
          </div>
        </div>
      </div>

      <!-- Ações da conta -->
      <div *ngIf="!state.isGuest() && state.user()">
        <div class="menu-list">
          <button class="menu-item danger" (click)="logout()">
            <span>Sair da Conta</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <div *ngIf="state.isGuest()">
        <div class="menu-list" style="margin-top:0.85rem">
          <button class="menu-item"><span>Contate-nos</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>

      <app-bottom-nav active="profile"></app-bottom-nav>
    </div>
  `,
  styles: [`
    .profile-screen { background: var(--bg); min-height: 100dvh; width: 100%; display: flex; flex-direction: column; padding-bottom: 90px; box-sizing: border-box; overflow-x: hidden; }

    .top-bar { display: flex; align-items: center; justify-content: space-between; padding: 3rem 1.25rem 0.75rem; background: var(--white); }
    .top-bar-title { font-size: 1rem; font-weight: 700; color: var(--gray-800); }
    .icon-btn { background: none; border: none; cursor: pointer; width: 2.2rem; height: 2.2rem; display: flex; align-items: center; justify-content: center; }
    .icon-btn svg { width: 1.25rem; height: 1.25rem; color: var(--gray-800); }

    .profile-card { margin: 0.75rem 1.25rem 0; border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; background: var(--orange); }
    .profile-info { flex: 1; min-width: 0; }
    .profile-info h3 { font-size: 1.2rem; font-weight: 700; color: #fff; }
    .profile-info p { font-size: 0.78rem; color: rgba(255,255,255,0.8); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .profile-info small { font-size: 0.7rem; color: rgba(255,255,255,0.65); display: block; margin-top: 4px; }
    .profile-avatar { width: 3.25rem; height: 3.25rem; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0; }

    .profile-guest-card { background: linear-gradient(135deg,#FFF3E0,#FFE8C8); border-radius: 1.25rem; padding: 1.25rem; margin: 0.75rem 1.25rem 0; border: 2px dashed #F08B19; text-align: center; }
    .profile-guest-card h3 { font-size: 1rem; font-weight: 700; color: var(--orange-dark); margin-bottom: 0.4rem; }
    .profile-guest-card p { font-size: 0.78rem; color: #7B4A00; margin-bottom: 1rem; }
    .btn { padding: 0.65rem 1.5rem; border-radius: 0.75rem; border: none; font-family: 'Poppins', sans-serif; font-weight: 700; cursor: pointer; font-size: 0.85rem; }
    .btn-primary { background: var(--orange); color: #fff; }

    /* Seção de pedidos */
    .pedidos-section { background: var(--white); border-radius: 1rem; margin: 0.75rem 1.25rem 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .section-title-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem 0.5rem; }
    .section-title { font-size: 0.85rem; font-weight: 700; color: var(--gray-800); }
    .reload-btn { background: none; border: none; font-size: 0.75rem; font-weight: 600; color: var(--orange); cursor: pointer; font-family: 'Poppins', sans-serif; }
    .pedidos-loading { font-size: 0.82rem; color: var(--gray-400); text-align: center; padding: 1.5rem 1rem; }
    .pedidos-empty { font-size: 0.82rem; color: var(--gray-400); text-align: center; padding: 1.5rem 1rem; }
    .btn-explore { margin-top: 0.75rem; padding: 0.5rem 1.2rem; background: var(--orange); color: #fff; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 0.78rem; }

    .pedido-card { padding: 0.85rem 1.25rem; border-top: 1px solid #f3f3f3; cursor: pointer; transition: background 0.15s; }
    .pedido-card:active { background: #fafafa; }
    .pedido-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; }
    .pedido-date { font-size: 0.72rem; color: var(--gray-400); font-weight: 500; }
    .pedido-status { font-size: 0.68rem; font-weight: 700; padding: 0.18rem 0.55rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.02em; }
    .status-recebido { background: #FFF3E0; color: #E65100; }
    .status-preparando { background: #FFF8E1; color: #F57F17; }
    .status-saiu_para_entrega { background: #E3F2FD; color: #0D47A1; }
    .status-entregue { background: #E8F5E9; color: #1B5E20; }
    .pedido-card-bottom { display: flex; justify-content: space-between; align-items: center; }
    .pedido-itens { font-size: 0.78rem; color: var(--gray-600); font-weight: 500; }
    .pedido-total { font-size: 0.95rem; font-weight: 800; color: var(--orange); }

    .menu-list { background: var(--white); border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin: 0.85rem 1.25rem 0; }
    .menu-item { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1rem; border: none; background: var(--white); cursor: pointer; border-bottom: 1px solid #f3f3f3; font-family: 'Poppins', sans-serif; text-align: left; }
    .menu-item:last-child { border-bottom: none; }
    .menu-item:active { background: #f9f9f9; }
    .menu-item span { font-size: 0.82rem; font-weight: 500; color: var(--gray-800); }
    .menu-item.danger span { color: var(--red, #ef4444); }
    .menu-item svg { width: 0.9rem; height: 0.9rem; color: #ccc; }
    .menu-item.danger svg { color: #fca5a5; }
  `]
})
export class ProfileComponent implements OnInit {
  public state = inject(AppStateService);
  private router = inject(Router);
  private pedidoService = inject(PedidoService);

  meusPedidos: any[] = [];
  carregando = true;

  ngOnInit() {
    this.carregarPedidos();
  }

  async carregarPedidos() {
    this.carregando = true;
    const user = this.state.user();
    if (user && user.id) {
      try {
        const pedidos = await this.pedidoService.buscarPedidosPorUsuario(user.id);
        this.meusPedidos = pedidos;
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    }
    this.carregando = false;
  }

  formatarData(timestamp: any): string {
    if (!timestamp) return 'Data não disponível';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  traduzirStatus(status: string): string {
    if (status === 'recebido') return 'Aguardando';
    if (status === 'preparando') return 'Preparando';
    if (status === 'saiu_para_entrega') return 'A Caminho';
    if (status === 'entregue') return 'Entregue';
    return status;
  }

  abrirPedido(pedidoId: string) {
    this.router.navigate(['/pedido', pedidoId]);
  }

  irPara(rota: string) {
    this.router.navigate([rota]);
  }

  logout() {
    this.state.logout();
    this.irPara('/home');
  }
}
