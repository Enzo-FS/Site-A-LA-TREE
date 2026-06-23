import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStateService } from '../../../core/services/app-state.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-bottom-nav">

      <div class="nav-item" [class.active]="active === 'home'" (click)="irPara('/home')">
        <div class="icon-space">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <span class="nav-label">Início</span>
      </div>

      <div class="nav-item" [class.active]="active === 'explore'" (click)="irPara('/explorar')">
        <div class="icon-space">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
        </div>
        <span class="nav-label">Menu</span>
      </div>

      <div class="nav-item" [class.active]="active === 'cart'" (click)="irParaCarrinho()">
        <div class="icon-space cart-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          @if (state.cart().length > 0) {
            <span class="cart-badge">{{ state.cart().length }}</span>
          }
        </div>
        <span class="nav-label">Carrinho</span>
      </div>

      <div class="nav-item" [class.active]="active === 'profile'" (click)="irPara(state.user() ? '/perfil' : '/login')">
        <div class="icon-space">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <span class="nav-label">Perfil</span>
      </div>

    </div>
  `,
  styles: [`
    .floating-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 430px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: #fff;
      border-top: 1px solid #f0f0f0;
      padding: 0.5rem 0 0.75rem;
      z-index: 100;
      box-shadow: 0 -2px 12px rgba(0,0,0,0.07);
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      cursor: pointer;
      flex: 1;
      color: var(--gray-400, #aaa);
      transition: color 0.15s;
      -webkit-tap-highlight-color: transparent;
    }
    .nav-item.active { color: var(--orange, #F08B19); }
    .icon-space {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .nav-label { font-size: 0.6rem; font-weight: 600; font-family: 'Poppins', sans-serif; }
    .cart-icon-wrapper { position: relative; }
    .cart-badge {
      position: absolute;
      top: -4px;
      right: -6px;
      background: var(--orange, #F08B19);
      color: #fff;
      font-size: 0.55rem;
      font-weight: 700;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Poppins', sans-serif;
    }
  `]
})
export class BottomNavComponent {
  @Input() active: string = 'home';

  public state = inject(AppStateService);
  private router = inject(Router);

  irPara(rota: string) {
    if (!rota) return;
    this.router.navigate([rota]);
  }

  irParaCarrinho() {
    this.irPara('/carrinho');
  }
}
