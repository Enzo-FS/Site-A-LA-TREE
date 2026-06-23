import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStateService } from '../../../core/services/app-state.service';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { CartItem } from '../../../core/models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  template: `
    <div class="cart-screen">

      <div class="top-bar">
        <button class="icon-btn" (click)="irPara('/home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span class="top-bar-title">Meu Carrinho</span>
        <button class="clear-btn" *ngIf="state.cart().length > 0" (click)="limpar()">Limpar</button>
        <div style="width:2.2rem" *ngIf="state.cart().length === 0"></div>
      </div>

      <!-- Carrinho vazio -->
      <div class="empty-cart" *ngIf="state.cart().length === 0">
        <div class="empty-icon">🛒</div>
        <h3>Carrinho vazio</h3>
        <p>Adicione itens do cardápio para continuar.</p>
        <button class="btn btn-primary" style="margin-top:1.5rem" (click)="irPara('/explorar')">
          Ver Cardápio
        </button>
      </div>

      <!-- Lista de itens -->
      <div class="cart-list" *ngIf="state.cart().length > 0">
        <div class="cart-item" *ngFor="let item of state.cart()">
          <div class="item-img">
            <img [src]="item.food.img" [alt]="item.food.name" onerror="this.style.display='none'" />
            <span class="item-emoji" *ngIf="!item.food.img">🍽️</span>
          </div>
          <div class="item-info">
            <h4>{{ item.food.name }}</h4>
            <p class="item-cat">{{ item.food.category }}</p>
            <span class="item-price">R$ {{ (item.food.price * item.qty).toFixed(2) }}</span>
          </div>
          <div class="item-controls">
            <button class="ctrl-btn" (click)="diminuir(item)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span class="ctrl-qty">{{ item.qty }}</span>
            <button class="ctrl-btn" (click)="aumentar(item)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Resumo + botão de continuar -->
      <div class="cart-footer" *ngIf="state.cart().length > 0">
        <div class="summary">
          <div class="summary-row">
            <span>Subtotal ({{ state.cartCount() }} item{{ state.cartCount() > 1 ? 's' : '' }})</span>
            <span>R$ {{ state.cartTotal().toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Entrega</span>
            <span class="free-tag">Grátis</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row total-row">
            <span>Total</span>
            <span>R$ {{ state.cartTotal().toFixed(2) }}</span>
          </div>
        </div>
        <button class="btn btn-primary" (click)="irPara('/pagamento')">
          Escolher Pagamento →
        </button>
      </div>

      <app-bottom-nav active="cart"></app-bottom-nav>
    </div>
  `,
  styles: [`
    .cart-screen {
      background: var(--bg);
      min-height: 100dvh;
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      overflow-x: hidden;
      padding-bottom: 90px;
    }

    /* Top bar */
    .top-bar {
      background: var(--white);
      padding: 3.5rem 1.25rem 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      box-sizing: border-box;
    }
    .icon-btn {
      width: 2.2rem; height: 2.2rem; border-radius: 50%;
      background: var(--gray-100); border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0;
    }
    .icon-btn svg { width: 1rem; height: 1rem; }
    .top-bar-title {
      flex: 1; text-align: center;
      font-size: 0.9rem; font-weight: 700; color: var(--gray-800);
    }
    .clear-btn {
      background: none; border: none;
      font-size: 0.75rem; font-weight: 600;
      color: var(--red, #E53E3E);
      cursor: pointer; font-family: var(--font-body);
      width: 2.2rem; text-align: right;
    }

    /* Vazio */
    .empty-cart {
      flex: 1;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 3rem 2rem; text-align: center;
    }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-cart h3 { font-size: 1.1rem; font-weight: 700; color: var(--gray-800); }
    .empty-cart p { font-size: 0.82rem; color: var(--gray-400); margin-top: 0.4rem; }

    /* Lista de itens */
    .cart-list {
      padding: 0.75rem 1.25rem 0;
      display: flex; flex-direction: column; gap: 0.65rem;
    }
    .cart-item {
      background: var(--white);
      border-radius: 1rem;
      padding: 0.85rem;
      display: flex; align-items: center; gap: 0.85rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .item-img {
      width: 3.5rem; height: 3.5rem;
      border-radius: 0.75rem;
      background: var(--gray-100);
      flex-shrink: 0;
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .item-img img { width: 100%; height: 100%; object-fit: cover; }
    .item-emoji { font-size: 1.75rem; }
    .item-info { flex: 1; min-width: 0; }
    .item-info h4 {
      font-size: 0.83rem; font-weight: 700;
      color: var(--gray-800);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .item-cat {
      font-size: 0.7rem; color: var(--gray-400);
      margin-top: 1px;
    }
    .item-price {
      font-size: 0.88rem; font-weight: 800;
      color: var(--orange);
      display: block; margin-top: 0.25rem;
    }

    /* Controles de quantidade */
    .item-controls {
      display: flex; align-items: center; gap: 0.4rem;
      flex-shrink: 0;
    }
    .ctrl-btn {
      width: 1.75rem; height: 1.75rem;
      border-radius: 50%;
      border: none;
      background: var(--gray-100);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: background 0.15s;
    }
    .ctrl-btn:active { background: var(--gray-200); }
    .ctrl-btn svg { width: 0.85rem; height: 0.85rem; color: var(--gray-800); }
    .ctrl-qty {
      font-size: 0.9rem; font-weight: 700;
      color: var(--gray-800);
      min-width: 1.2rem; text-align: center;
    }

    /* Footer com resumo */
    .cart-footer {
      position: fixed;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 430px;
      background: var(--white);
      border-top: 1px solid #f0f0f0;
      padding: 1rem 1.25rem 1rem;
      box-sizing: border-box;
      box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
    }
    .summary { margin-bottom: 0.85rem; }
    .summary-row {
      display: flex; justify-content: space-between;
      font-size: 0.78rem; color: var(--gray-600, #666);
      margin-bottom: 0.4rem;
    }
    .free-tag { color: #16a34a; font-weight: 600; }
    .summary-divider { height: 1px; background: #f0f0f0; margin: 0.5rem 0; }
    .total-row {
      font-size: 0.92rem; font-weight: 800;
      color: var(--gray-800);
    }
    .btn {
      display: flex; align-items: center; justify-content: center;
      width: 100%; padding: 0.9rem; border: none;
      border-radius: var(--radius);
      font-size: 0.92rem; font-weight: 700;
      font-family: var(--font-body);
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
    }
    .btn:active { opacity: 0.85; transform: scale(0.98); }
    .btn-primary { background: var(--orange); color: #fff; box-shadow: 0 4px 16px rgba(226,126,12,0.35); }
  `]
})
export class CartComponent {
  public state = inject(AppStateService);
  private router = inject(Router);

  irPara(rota: string) {
    this.router.navigate([rota]);
  }

  aumentar(item: CartItem) {
    this.state.cart.update(cart =>
      cart.map(i => i.food.id === item.food.id ? { ...i, qty: i.qty + 1 } : i)
    );
  }

  diminuir(item: CartItem) {
    this.state.cart.update(cart => {
      const updated = cart.map(i =>
        i.food.id === item.food.id ? { ...i, qty: i.qty - 1 } : i
      );
      return updated.filter(i => i.qty > 0);
    });
  }

  limpar() {
    this.state.cart.set([]);
  }
}
