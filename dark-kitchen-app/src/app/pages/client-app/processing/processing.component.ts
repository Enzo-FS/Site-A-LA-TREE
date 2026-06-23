import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state.service';
import { Router } from '@angular/router'; // Lá nos imports
import { inject } from '@angular/core';

@Component({
  selector: 'app-processing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="processing-screen">
      <div class="processing-inner">
        <div class="processing-lottie" [class.processing-done]="done">
          <div class="processing-ring" *ngIf="!done && !error"></div>
          <span>{{ emoji }}</span>
        </div>
        <h2 class="processing-title">{{ title }}</h2>
        <p class="processing-subtitle">{{ subtitle }}</p>

        <!-- Código PIX após confirmação -->
        <div class="processing-card" *ngIf="done && state.selectedPayment() === 'pix'">
          <span>📱</span>
          <div>
            <p><strong>Copia e Cola PIX:</strong></p>
            <p class="pix-code" [attr.data-code]="pixCode">{{ pixCode }}</p>
            <button class="btn btn-primary" style="padding:0.4rem 0.8rem;font-size:0.72rem;width:auto" (click)="copyPix()">Copiar Código</button>
          </div>
        </div>

        <!-- ID do pedido -->
        <div class="pedido-id-card" *ngIf="done && pedidoId">
          <span>🧾</span>
          <div>
            <p><strong>Número do Pedido:</strong></p>
            <p class="pedido-id">{{ pedidoId }}</p>
            <small>Guarde este número para acompanhar seu pedido.</small>
          </div>
        </div>

        <p class="error-msg" *ngIf="error" style="text-align:center;margin-top:1rem">{{ error }}</p>

        <button *ngIf="done || error" class="btn btn-outline mt-2" style="width:calc(100% - 2.5rem)" (click)="backToHome()">
          Voltar ao Menu Principal
        </button>
      </div>
    </div>
  `,
  styles: [`
    .processing-screen { background: #fff; min-height: 100vh; display: flex; flex-direction: column; }
    .processing-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; width: 100%; }
    .processing-lottie { width: 10rem; height: 10rem; border-radius: 50%; background: var(--orange-light); display: flex; align-items: center; justify-content: center; font-size: 5rem; margin-bottom: 2rem; position: relative; }
    .processing-ring { position: absolute; inset: -6px; border-radius: 50%; border: 4px solid transparent; border-top-color: var(--orange); animation: spin 1s linear infinite; }
    .processing-done { background: linear-gradient(135deg, #E8F5E9, #C8E6C9); }
    .processing-title { font-size: 1.4rem; font-weight: 800; color: var(--gray-800); text-align: center; margin-bottom: 0.75rem; }
    .processing-subtitle { font-size: 0.85rem; color: var(--gray-500); text-align: center; line-height: 1.65; max-width: 18rem; }
    .processing-card { background: var(--orange-light); border: 1.5px solid #FFD08B; border-radius: 1rem; padding: 1rem 1.25rem; margin: 2rem 1.25rem 0; width: calc(100% - 2.5rem); display: flex; gap: 0.75rem; align-items: flex-start; }
    .processing-card > span { font-size: 1.4rem; flex-shrink: 0; }
    .processing-card p { font-size: 0.8rem; color: #7B4A00; line-height: 1.5; }
    .pix-code { font-family: monospace; font-size: 0.7rem; background: #fff; padding: 0.4rem; border-radius: 4px; margin: 0.25rem 0; word-break: break-all; user-select: all; }
    .pedido-id-card { background: #E8F5E9; border: 1.5px solid #A5D6A7; border-radius: 1rem; padding: 1rem 1.25rem; margin: 1rem 1.25rem 0; width: calc(100% - 2.5rem); display: flex; gap: 0.75rem; align-items: flex-start; }
    .pedido-id-card > span { font-size: 1.4rem; flex-shrink: 0; }
    .pedido-id-card p { font-size: 0.8rem; color: #2E7D32; line-height: 1.5; }
    .pedido-id { font-family: monospace; font-size: 0.7rem; background: #fff; padding: 0.3rem 0.5rem; border-radius: 4px; word-break: break-all; margin: 0.15rem 0; }
    .pedido-id-card small { font-size: 0.68rem; color: #388E3C; }
  `],
})
export class ProcessingComponent implements OnInit {
  done = false;
  error = '';
  emoji = '⏳';
  title = 'Enviando seu pedido...';
  subtitle = 'Estamos conectando com a cozinha do Boteco da Árvore.';
  pixCode = '';
  pedidoId = '';

  constructor(public state: AppStateService) {}

  async ngOnInit(): Promise<void> {
    const total = this.state.cartTotal();
    this.pixCode = `00020101021126360014br.gov.bcb.pix0114123456789012345204000053039865405${total}.005802BR5917Boteco da Arvore6009Sao Paulo62070503***6304`;

    // Salva o pedido no Firestore
    const id = await this.state.finalizarPedido();

    if (id) {
      this.pedidoId = id;
      this.done = true;
      this.emoji = '✅';
      this.title = 'Pedido Confirmado!';
      if (this.state.selectedPayment() === 'pix') {
        this.subtitle = 'Seu pedido foi recebido. Efetue o pagamento PIX abaixo para agilizar o preparo.';
      } else {
        this.subtitle = 'Seu pedido já foi encaminhado para a nossa cozinha e em breve sairá com o entregador.';
      }
    } else {
      // Fallback: se o usuário não está logado ou houve erro
      setTimeout(() => {
        this.done = true;
        this.emoji = '✅';
        this.title = 'Pedido Recebido!';
        this.subtitle = this.state.selectedPayment() === 'pix'
          ? 'Efetue o pagamento PIX abaixo para confirmar seu pedido.'
          : 'Em breve seu pedido sairá com o entregador.';
        this.state.cart.set([]);
      }, 2500);
    }
  }

  copyPix(): void {
    navigator.clipboard.writeText(this.pixCode).then(() => alert('Chave Copiada!'));
  }
  private router = inject(Router);
  backToHome(): void {
    this.state.cart.set([]);
    this.router.navigate(['/home']);
  }
}
