import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { AppStateService } from '../../../core/services/app-state.service';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, BottomNavComponent], 
  template: `
    <div class="history-page">
      <header class="history-header">
        <h2>Meus Pedidos</h2>
        <p>Acompanhe o status e histórico</p>
      </header>

      <div class="profile-guest-card" *ngIf="state.isGuest()">
        <h3>Você está como Visitante</h3>
        <p>Faça login para acompanhar o histórico dos seus pedidos.</p>
        <button class="btn btn-primary" (click)="irPara('/login')">Fazer Login</button>
      </div>

      <div class="pedidos-section" *ngIf="!state.isGuest()">
        <div class="pedidos-header">
          <span>📦 Histórico de Compras</span>
          <button class="reload-btn" (click)="carregarPedidos()">↻ Atualizar</button>
        </div>

        <div *ngIf="carregando" class="pedidos-loading">Buscando seus pedidos...</div>

        <div *ngIf="!carregando && meusPedidos.length === 0" class="pedidos-empty">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🍽️</div>
          Você ainda não fez nenhum pedido.
          <br><button class="btn-explore mt-2" (click)="irPara('/explorar')">Explorar Cardápio</button>
        </div>

        <div class="pedido-item" *ngFor="let p of meusPedidos" (click)="abrirDetalhes(p.id)">
          <div class="pedido-item-top">
            <span class="pedido-date">{{ formatarData(p.createdAt) }}</span>
            <span class="pedido-status" [class]="'status-' + p.status">
              {{ traduzirStatus(p.status) }}
            </span>
          </div>
          <div class="pedido-item-bottom">
            <span class="pedido-itens">{{ p.itens?.length ?? 0 }} item(ns)</span>
            <div class="pedido-price-block">
              <span class="pedido-total">R$ {{ p.valorTotal }},00</span>
              <span class="arrow-detail">➔</span>
            </div>
          </div>
        </div>
      </div>

      <app-bottom-nav active="orders"></app-bottom-nav>
    </div>
  `,
  styles: [`
    .history-page { background: var(--bg, #F5F5F7); min-height: 100dvh; width: 100%; display: flex; flex-direction: column; padding: 2rem 1.5rem 90px; box-sizing: border-box; overflow-x: hidden; }
    .history-header { margin-bottom: 1.5rem; }
    .history-header h2 { font-size: 1.8rem; font-weight: 800; color: var(--text, #1A1A1A); }
    .history-header p { font-size: 0.9rem; color: var(--text-soft, #555); margin-top: 4px; }
    
    .profile-guest-card { background: linear-gradient(135deg,#FFF3E0,#FFE8C8); border-radius: 1.25rem; padding: 1.25rem; border: 2px dashed #F08B19; text-align: center; }
    .profile-guest-card h3 { font-size: 1rem; font-weight: 700; color: var(--orange-dark); margin-bottom: 0.4rem; }
    .profile-guest-card p { font-size: 0.78rem; color: #7B4A00; margin-bottom: 1rem; }
    .btn-explore { padding: 0.6rem 1.2rem; background: var(--orange); color: #FFF; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; }
    
    .pedidos-section { background: var(--white); border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .pedidos-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem 0.5rem; }
    .pedidos-header span { font-size: 0.85rem; font-weight: 700; color: var(--gray-800); }
    .reload-btn { background: none; border: none; font-size: 0.75rem; font-weight: 600; color: var(--orange); cursor: pointer; }
    .pedidos-loading, .pedidos-empty { font-size: 0.85rem; color: var(--gray-400); text-align: center; padding: 2.5rem 1rem; }
    
    .pedido-item { padding: 1rem 1.25rem; border-top: 1px solid #f3f3f3; cursor: pointer; transition: background 0.15s; }
    .pedido-item:active { background: #f9f9f9; }
    .pedido-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
    .pedido-date { font-size: 0.75rem; color: var(--gray-400); font-weight: 500; }
    .pedido-status { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.02em; }
    
    .status-recebido { background: #FFF3E0; color: #E65100; }
    .status-preparando { background: #FFF8E1; color: #F57F17; }
    .status-saiu_para_entrega { background: #E3F2FD; color: #0D47A1; }
    .status-entregue { background: #E8F5E9; color: #1B5E20; }
    
    .pedido-item-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
    .pedido-itens { font-size: 0.8rem; font-weight: 500; color: var(--gray-600); }
    .pedido-price-block { display: flex; align-items: center; gap: 0.5rem; }
    .pedido-total { font-size: 1rem; font-weight: 800; color: var(--orange); }
    .arrow-detail { font-size: 0.8rem; color: var(--orange); opacity: 0.7; }
    .mt-2 { margin-top: 1rem; }
  `]
})
export class OrdersComponent implements OnInit {
  meusPedidos: any[] = [];
  carregando = true;

  private pedidoService = inject(PedidoService);
  public state = inject(AppStateService);
  private router = inject(Router);

  ngOnInit() {
    this.carregarPedidos();
  }

  async carregarPedidos() {
    this.carregando = true;
    const user = this.state.user();
    if (user && user.id) {
      try {
        const pedidos = await this.pedidoService.buscarPedidosPorUsuario(user.id);
        this.meusPedidos = pedidos.reverse();
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      }
    }
    this.carregando = false;
  }

  formatarData(timestamp: any): string {
    if (!timestamp) return 'Data não disponível';
    // Se o Firebase retornou um Timestamp, converte para Date
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

  abrirDetalhes(pedidoId: string) {
    this.router.navigate(['/pedido', pedidoId]);
  }

  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}