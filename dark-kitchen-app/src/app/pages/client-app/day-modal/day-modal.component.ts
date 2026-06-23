import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state.service';

@Component({
  selector: 'app-day-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="day-modal-overlay" (click)="state.closeDayModal()">
      <div class="day-modal" (click)="$event.stopPropagation()">
        <div class="day-modal-handle" (click)="state.closeDayModal()"></div>
        <h3>{{ state.dayModalTitle() }}</h3>
        <div *ngIf="state.dayModalFoods().length === 0" style="font-size:0.8rem;color:var(--gray-400);text-align:center;padding:1rem;">
          Nenhum item definido para este dia.
        </div>
        <div class="day-modal-item" *ngFor="let f of state.dayModalFoods()" (click)="openItem(f.id)">
          <div class="day-modal-img" [style.background-image]="'url(' + f.img + ')'"></div>
          <div class="day-modal-info">
            <h4>{{ f.name }}</h4>
            <p>{{ f.category }} • ⭐ {{ f.rating }}</p>
          </div>
          <div class="day-modal-price">R$ {{ f.price }},00</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .day-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: flex-end; }
    .day-modal { background: var(--white); border-radius: 1.5rem 1.5rem 0 0; width: 100%; max-width: 430px; margin: 0 auto; padding: 1.5rem 1.25rem 3rem; max-height: 75vh; overflow-y: auto; }
    .day-modal-handle { width: 2.5rem; height: 4px; background: var(--gray-200); border-radius: 99px; margin: 0 auto 1.25rem; cursor: pointer; }
    .day-modal h3 { font-size: 1rem; font-weight: 700; color: var(--gray-800); margin-bottom: 1rem; }
    .day-modal-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.65rem 0; border-bottom: 1px solid #f3f3f3; cursor: pointer; }
    .day-modal-item:last-child { border-bottom: none; }
    .day-modal-img { width: 3.25rem; height: 3.25rem; border-radius: 0.65rem; background-size: cover; background-position: center; flex-shrink: 0; }
    .day-modal-info { flex: 1; }
    .day-modal-info h4 { font-size: 0.82rem; font-weight: 600; color: var(--gray-800); line-height: 1.3; }
    .day-modal-info p { font-size: 0.72rem; color: var(--gray-500); margin-top: 2px; }
    .day-modal-price { font-size: 0.82rem; font-weight: 700; color: var(--orange); }
  `],
})
export class DayModalComponent {
  constructor(public state: AppStateService) {}

  openItem(id: number): void {
    this.state.closeDayModal();
    this.state.openDetail(id);
  }
}
