import { Component, Input } from '@angular/core';
import { AppStateService } from '../../../core/services/app-state.service';
import { Food } from '../../../core/models/models';

@Component({
  selector: 'app-food-card',
  standalone: true,
  template: `
    <div class="food-card" (click)="state.openDetail(food.id)">
      <div class="food-card-img" [style.background-image]="'url(' + food.img + ')'"></div>
      <div class="food-card-body">
        <div class="food-card-name">{{ food.name }}</div>
        <div class="food-card-meta">
          <div class="food-card-rating">⭐ {{ food.rating }}</div>
          <div class="food-card-price">R$ {{ food.price }},00</div>
        </div>
        <button class="food-card-add" (click)="addToCart($event)">+</button>
      </div>
    </div>
  `,
  styles: [`
    .food-card { background: var(--white); border-radius: 1.1rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.12s; }
    .food-card:active { transform: scale(0.96); }
    .food-card-img { width: 100%; height: 7.5rem; background-size: cover; background-position: center; }
    .food-card-body { padding: 0.65rem 0.65rem 0.5rem; }
    .food-card-name { font-size: 0.78rem; font-weight: 600; color: var(--gray-800); line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .food-card-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 0.35rem; }
    .food-card-rating { display: flex; align-items: center; gap: 3px; font-size: 0.7rem; color: var(--gray-500); }
    .food-card-price { font-size: 0.7rem; font-weight: 600; color: var(--gray-700); }
    .food-card-add { margin: 0.4rem 0 0 auto; display: flex; width: 1.9rem; height: 1.9rem; border-radius: 50%; background: var(--orange); border: none; align-items: center; justify-content: center; cursor: pointer; color: #fff; font-size: 1.1rem; font-weight: 700; transition: transform 0.1s; }
    .food-card-add:active { transform: scale(0.88); }
  `],
})
export class FoodCardComponent {
  @Input() food!: Food;
  constructor(public state: AppStateService) {}

  addToCart(event: Event): void {
    event.stopPropagation();
    const added = this.state.addToCart(this.food);
    if (!added) alert('Faça login para adicionar itens ao carrinho.');
  }
}
