import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService, DETAIL_TABS_CONTENT } from '../../../core/services/app-state.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-screen" *ngIf="state.selectedFood() as food">
      <div class="detail-hero">
        <div class="detail-hero-img" [style.background-image]="'url(' + food.img + ')'"></div>
        <div class="detail-hero-overlay"></div>
        <button class="detail-back" (click)="irPara('/home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <button class="detail-fav">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
      </div>

      <div class="detail-card">
        <div class="detail-name">{{ food.name }}</div>
        <div class="detail-meta">
          <span class="rating">⭐ {{ food.rating }}</span>
          <span>R$ {{ food.price }},00</span>
          <span class="time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ food.time }}
          </span>
        </div>

        <div class="detail-tabs">
          <button *ngFor="let tab of tabLabels; let i = index"
            class="detail-tab" [class.active]="state.detailTab() === i" (click)="setTab(i)">{{ tab }}</button>
        </div>

        <div class="detail-content">
          <div [innerHTML]="tabContent"></div>
        </div>

        <div class="detail-add-btn" *ngIf="!state.isGuest()">
          <button class="btn btn-primary" (click)="addAndGo()">Adicionar ao Carrinho</button>
        </div>
        <div class="guest-lock" *ngIf="state.isGuest()">
          <p>Faça login para adicionar este item ao seu pedido.</p>
          <button class="btn btn-primary" (click)="irPara('/login')">Fazer Login</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-screen { background: #fff; min-height: 100vh; display: flex; flex-direction: column; }
    .detail-hero { position: relative; height: 40vh; flex-shrink: 0; }
    .detail-hero-img { width: 100%; height: 100%; background-size: cover; background-position: center; }
    .detail-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1), transparent); }
    .detail-back, .detail-fav { position: absolute; top: 3rem; width: 2.5rem; height: 2.5rem; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .detail-back { left: 1rem; }
    .detail-fav { right: 1rem; }
    .detail-back svg, .detail-fav svg { width: 1.1rem; height: 1.1rem; }
    .detail-card { background: #fff; border-radius: 1.5rem 1.5rem 0 0; margin-top: -1.5rem; position: relative; z-index: 5; padding: 1.5rem 1.25rem; flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
    .detail-name { font-size: 1.3rem; font-weight: 700; color: var(--gray-800); }
    .detail-meta { display: flex; align-items: center; gap: 1.25rem; margin-top: 0.5rem; }
    .detail-meta span { font-size: 0.8rem; font-weight: 600; color: var(--gray-700); }
    .detail-meta .rating { display: flex; align-items: center; gap: 4px; }
    .detail-meta .time { display: flex; align-items: center; gap: 3px; color: var(--gray-400); font-weight: 400; font-size: 0.75rem; }
    .detail-meta .time svg { width: 0.75rem; height: 0.75rem; }
    .detail-tabs { display: flex; gap: 1.5rem; margin-top: 1.25rem; border-bottom: 1px solid #f0f0f0; }
    .detail-tab { padding-bottom: 0.5rem; font-size: 0.82rem; font-weight: 500; border: none; background: none; cursor: pointer; font-family: 'Poppins', sans-serif; border-bottom: 2px solid transparent; transition: all 0.15s; }
    .detail-tab.active { color: var(--orange); border-bottom-color: var(--orange); }
    .detail-tab:not(.active) { color: var(--gray-400); }
    .detail-content { flex: 1; margin-top: 1rem; font-size: 0.82rem; color: var(--gray-500); line-height: 1.7; }
    .detail-add-btn { margin-top: 1.25rem; }
    .guest-lock { background: linear-gradient(to top, rgba(255,255,255,1) 60%, transparent); padding: 2rem 1rem 0; text-align: center; margin-top: 0.5rem; }
    .guest-lock p { font-size: 0.82rem; color: var(--gray-500); margin-bottom: 0.75rem; }
  `],
})
export class DetailComponent {
  tabLabels = ['Descrição', 'Ingredientes', 'Entrega'];

  get tabContent(): string {
    const food = this.state.selectedFood();
    const fn = DETAIL_TABS_CONTENT[this.state.detailTab()];
    return fn ? fn(food?.desc ?? '') : '';
  }

  constructor(public state: AppStateService) {}

  setTab(i: number): void { this.state.detailTab.set(i); }
  private router = inject(Router);
  addAndGo(): void {
    const food = this.state.selectedFood();
    if (food) { this.state.addToCart(food); this.router.navigate(['/meus-pedidos']); }
  }

  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}
