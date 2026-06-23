import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService, FILTERS, FOODS } from '../../../core/services/app-state.service';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { FoodCardComponent } from '../food-card/food-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, FoodCardComponent],
  template: `
    <div class="explore-screen">
      <div class="top-bar">
        <button class="icon-btn" (click)="irPara('/home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span class="top-bar-title">Cardápio Completo</span>
        <div style="width:2.2rem"></div>
      </div>
      <div class="filter-bar">
        <button *ngFor="let f of filters" class="chip" [class.active]="f === state.exploreFilter()" (click)="state.setFilter(f)">{{ f }}</button>
      </div>
      <div class="explore-list">
        <div class="food-grid" *ngIf="filtered.length > 0">
          <app-food-card *ngFor="let f of filtered" [food]="f"></app-food-card>
        </div>
        <div *ngIf="filtered.length === 0" class="empty-state">
          <span>🍽️</span>
          <p>Nenhum item encontrado nesta categoria.</p>
        </div>
      </div>
      <app-bottom-nav active="explore"></app-bottom-nav>
    </div>
  `,
  styles: [`
    /* CSS blindado com as travas de responsividade do celular */
    .explore-screen { background: var(--bg); min-height: 100dvh; width: 100%; display: flex; flex-direction: column; padding-bottom: 90px; box-sizing: border-box; overflow-x: hidden; }
    .filter-bar { background: var(--white); padding: 0.5rem 1.25rem 1rem; display: flex; gap: 0.5rem; overflow-x: auto; scrollbar-width: none; width: 100%; box-sizing: border-box; }
    .filter-bar::-webkit-scrollbar { display: none; }
    .chip { padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.72rem; font-weight: 600; border: none; cursor: pointer; white-space: nowrap; transition: all 0.15s; font-family: 'Poppins', sans-serif; }
    .chip.active { background: var(--orange); color: #fff; }
    .chip:not(.active) { background: var(--gray-100); color: #666; }
    .explore-list { padding: 1rem 1.25rem; width: 100%; box-sizing: border-box; }
    .food-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 0; color: var(--gray-400); gap: 0.75rem; }
    .empty-state span { font-size: 3.5rem; }
    .empty-state p { font-size: 0.85rem; }
  `],
})
export class ExploreComponent implements OnInit {
  filters = FILTERS;
  
  public state = inject(AppStateService);
  private router = inject(Router);

  // 👇 A MÁGICA 2: Vigia a lista crua no exato segundo do carregamento!
  get filtered() { 
    const filtroAtual = this.state.exploreFilter();
    
    if (filtroAtual === 'Todos') {
        return FOODS; // Se for 'Todos', entrega a lista direto do banco em tempo real!
    }
    
    return this.state.filteredFoods(); 
  }

  ngOnInit() {
    this.state.setFilter('Todos');
  }

  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}