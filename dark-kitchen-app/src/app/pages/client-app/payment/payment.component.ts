import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state.service';
import { PaymentType } from '../../../core/models/models';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-screen">
      <div class="top-bar">
        <button class="icon-btn" (click)="irPara('/home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span class="top-bar-title">Forma de Pagamento</span>
        <div style="width:2.2rem"></div>
      </div>
      <div class="payment-options">
        <div class="payment-option" [class.selected]="state.selectedPayment() === 'entrega'" (click)="select('entrega')">
          <div class="payment-icon">🛵</div>
          <div class="payment-text">
            <h4>Pagar na Entrega</h4>
            <p>Dinheiro, cartão de débito ou crédito.</p>
          </div>
          <div class="payment-radio"></div>
        </div>
        <div class="payment-option" [class.selected]="state.selectedPayment() === 'pix'" (click)="select('pix')">
          <div class="payment-icon">📱</div>
          <div class="payment-text">
            <h4>PIX</h4>
            <p>Aprovação rápida e segura.</p>
          </div>
          <div class="payment-radio"></div>
        </div>
      </div>
      <div class="pay-footer">
        <button class="btn btn-primary" (click)="irPara('/confirmacao')">Revisar Pedido →</button>
      </div>
    </div>
  `,
  styles: [`
    .payment-screen { background: var(--bg); min-height: 100vh; display: flex; flex-direction: column; width: 100%; overflow-x: hidden; box-sizing: border-box; }
    .payment-options { padding: 1.5rem 0 7rem; overflow-y: auto; width: 100%; box-sizing: border-box; }
    .payment-option { background: var(--white); border-radius: 1rem; padding: 1rem 1.25rem; margin: 0 1.25rem 0.65rem; display: flex; align-items: center; gap: 1rem; border: 2px solid transparent; cursor: pointer; transition: border-color 0.15s; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .payment-option.selected { border-color: var(--orange); background: var(--orange-lite); }
    .payment-icon { width: 3rem; height: 3rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: var(--gray-100); flex-shrink: 0; }
    .payment-option.selected .payment-icon { background: rgba(226,126,12,0.15); }
    .payment-text h4 { font-size: 0.88rem; font-weight: 700; color: var(--gray-800); }
    .payment-text p { font-size: 0.75rem; color: var(--gray-500); margin-top: 2px; }
    .payment-radio { margin-left: auto; width: 1.1rem; height: 1.1rem; border-radius: 50%; border: 2px solid var(--gray-200); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .payment-option.selected .payment-radio { border-color: var(--orange); background: var(--orange); }
    .payment-option.selected .payment-radio::after { content: ''; width: 0.45rem; height: 0.45rem; border-radius: 50%; background: #fff; }
    .pay-footer { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; padding: 1rem 1.25rem 2rem; background: var(--white); border-top: 1px solid #f0f0f0; box-sizing: border-box; }
  `],
})
export class PaymentComponent {
  constructor(public state: AppStateService) {}
  select(type: PaymentType): void { this.state.selectedPayment.set(type); }
  private router = inject(Router);
  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}
