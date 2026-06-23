import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-layout">
      <header class="admin-header">
        <h2>Painel da <span>Gerência</span></h2>
        <p>O que você deseja gerenciar hoje?</p>
      </header>
      
      <div class="dashboard-grid">
        <div class="dash-card" (click)="irPara('/painel')">
          <div class="icon-wrapper">📦</div>
          <h3>Pedidos</h3>
          <p>Gerenciar fila e status</p>
        </div>
        
        <div class="dash-card" (click)="irPara('/catalogo')">
          <div class="icon-wrapper">🍔</div>
          <h3>Catálogo</h3>
          <p>Adicionar/Editar itens</p>
        </div>
        
        <div class="dash-card" (click)="irPara('/estoque')">
          <div class="icon-wrapper">📊</div>
          <h3>Estoque</h3>
          <p>Controle de insumos</p>
        </div>
        
        <div class="dash-card" (click)="irPara('/informacoes')">
          <div class="icon-wrapper">⚙️</div>
          <h3>Informações</h3>
          <p>Configurações da loja</p>
        </div>
      </div>

      <button class="logout-btn" (click)="sair()">Sair do Sistema</button>
    </div>
  `,
  styles: [`
    .admin-layout { padding: 3rem 1.5rem; min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; max-width: 430px; margin: 0 auto; }
    .admin-header { margin-bottom: 2.5rem; text-align: center; }
    .admin-header h2 { font-size: 1.8rem; color: var(--text); font-weight: 800; }
    .admin-header h2 span { color: var(--orange); }
    .admin-header p { color: var(--text-soft); font-size: 0.9rem; margin-top: 0.5rem; }
    
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; flex: 1; align-content: start; }
    .dash-card {
      background: var(--card); border-radius: var(--radius-md); padding: 1.5rem 0.5rem;
      text-align: center; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.03);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    
    /* 👇 AQUI ESTÁ A CORREÇÃO DO CLIQUE DUPLO 👇 */
    .dash-card:active { transform: translateY(4px); background: var(--surface); }
    
    .icon-wrapper { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .dash-card h3 { font-size: 0.95rem; color: var(--text); font-weight: 700; margin-bottom: 0.25rem; }
    .dash-card p { font-size: 0.7rem; color: var(--text-soft); }
    
    .logout-btn { margin-top: 2rem; padding: 1rem; border-radius: var(--radius-sm); background: transparent; border: 2px solid var(--red); color: var(--red); font-weight: 700; cursor: pointer; transition: 0.15s; font-family: inherit; }
    
    /* 👇 Aproveitei para blindar o botão de sair também 👇 */
    .logout-btn:active { background: var(--red); color: #fff; transform: translateY(2px); }
  `]
})
export class AdminDashboardComponent {
  private router = inject(Router);
  
  irPara(rota: string) {
    this.router.navigate([rota]);
  }
  
  sair() {
    this.router.navigate(['/login']);
  }
}