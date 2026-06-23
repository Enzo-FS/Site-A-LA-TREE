import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStateService } from '../../../core/services/app-state.service';
import { PedidoService } from '../../../core/services/pedido.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-screen">
      <div class="top-bar">
        <button class="icon-btn" (click)="irParaPagamento()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span class="top-bar-title">Confirmar Pedido</span>
        <div style="width:2.2rem"></div>
      </div>

      <div class="confirm-content">
        <div class="confirm-section">
          <div class="confirm-section-title">Itens do Pedido</div>
          <div class="confirm-item" *ngFor="let item of state.cart()">
            <div class="confirm-item-img" [style.background-image]="'url(' + item.food?.img + ')'"></div>
            <div class="confirm-item-name">{{ item.food?.name || 'Produto' }}</div>
            <div class="confirm-item-qty">x{{ item.qty }}</div>
            <div class="confirm-item-price">R$ {{ (item.food?.price || 0) * item.qty }},00</div>
          </div>
        </div>

        <div class="confirm-section">
          <div class="confirm-section-title">Entrega</div>
          <div class="confirm-row">
            <span>📍 Endereço</span>
            <span style="text-align:right;max-width:55%;font-size:0.75rem">{{ address }}</span>
          </div>
          <div class="confirm-row">
            <span>⏱️ Tempo estimado</span>
            <span>30–45 min</span>
          </div>
        </div>

        <div class="confirm-section">
          <div class="confirm-section-title">Pagamento</div>
          <div class="confirm-row">
            <span>💳 Forma</span>
            <span>{{ paymentLabel }}</span>
          </div>
          <div class="confirm-row total">
            <span style="font-weight:700;color:var(--gray-800)">Total</span>
            <span>R$ {{ state.cartTotal() }},00</span>
          </div>
        </div>
      </div>

      <div class="confirm-footer">
        <button class="btn btn-primary" (click)="finalizarPedido()" [disabled]="salvando">
          {{ salvando ? 'Enviando para a cozinha...' : 'Enviar Pedido ao Boteco 🚀' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-screen { background: var(--bg); min-height: 100dvh; display: flex; flex-direction: column; width: 100%; overflow-x: hidden; box-sizing: border-box; padding-bottom: 110px; }
    .confirm-content { padding: 1rem 0; overflow-y: auto; width: 100%; box-sizing: border-box; }
    .confirm-section { background: var(--white); border-radius: 1rem; margin: 0 1.25rem 0.65rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .confirm-section-title { font-size: 0.75rem; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.05em; padding: 0.85rem 1rem 0.4rem; }
    .confirm-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1rem; border-top: 1px solid #f3f3f3; }
    .confirm-item-img { width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; background-size: cover; background-position: center; background-color: #eee; flex-shrink: 0; }
    .confirm-item-name { font-size: 0.82rem; font-weight: 600; color: var(--gray-800); flex: 1; }
    .confirm-item-qty { font-size: 0.75rem; color: var(--gray-400); }
    .confirm-item-price { font-size: 0.82rem; font-weight: 600; color: var(--gray-800); }
    .confirm-row { display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 1rem; border-top: 1px solid #f3f3f3; }
    .confirm-row span:first-child { font-size: 0.82rem; color: var(--gray-500); }
    .confirm-row span:last-child { font-size: 0.82rem; font-weight: 600; color: var(--gray-800); }
    .confirm-row.total span:last-child { font-size: 0.95rem; color: var(--orange); }
    .confirm-footer { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; padding: 1rem 1.25rem 2rem; background: var(--white); border-top: 1px solid #f0f0f0; z-index: 45; box-sizing: border-box; }
  `]
})
export class ConfirmationComponent {
  public state = inject(AppStateService);
  private router = inject(Router);
  private pedidoService = inject(PedidoService);

  address = this.state.user()?.endereco || 'Retirar no local';
  paymentLabel = this.state.selectedPayment() === 'pix' ? 'PIX' : 'Pagar na Entrega';
  salvando = false;

  irParaPagamento() {
    this.router.navigate(['/pagamento']);
  }

  async finalizarPedido() {
    const user = this.state.user();
    
    if (!user || !user.id) {
      alert('Você precisa fazer login para finalizar o pedido!');
      this.router.navigate(['/login']);
      return;
    }

    this.salvando = true;

    try {
      // Forçamos o TypeScript a entender que isso é apenas 'entrega' ou 'pix'
      const formaPgto = this.state.selectedPayment() as 'entrega' | 'pix';

      // 👇 A CORREÇÃO: Enviamos os 5 parâmetros exatos na ordem que o seu serviço exige!
      await this.pedidoService.criarPedido(
        user.id,
        this.state.cart(),
        this.address,
        this.state.cartTotal(),
        formaPgto
      );

      // Limpa o carrinho e envia para o histórico
      this.state.cart.set([]);
      this.router.navigate(['/meus-pedidos']);

    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      alert('Ops! Tivemos um problema de conexão. Tente novamente.');
    } finally {
      this.salvando = false;
    }
  }
}