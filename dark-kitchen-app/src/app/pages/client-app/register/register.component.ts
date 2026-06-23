import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="register-screen">
      <div class="register-hero">
        <div class="register-hero-emoji">📝🏽</div>
      </div>
      <div class="register-form-wrap">
        <h2>Criar Conta</h2>
        <div class="field">
          <label>Nome Completo</label>
          <input type="text" [(ngModel)]="name" placeholder="Como quer ser chamado?" />
        </div>
        <div class="field">
          <label>E-mail</label>
          <input type="email" [(ngModel)]="email" placeholder="seuemail@exemplo.com" />
        </div>
        <div class="field">
          <label>Senha</label>
          <input type="password" [(ngModel)]="password" placeholder="Mínimo 6 caracteres" />
        </div>
        <div class="field">
          <label>Telefone <span class="optional">(opcional)</span></label>
          <input type="tel" [(ngModel)]="telefone" placeholder="Ex: (11) 99999-9999" />
        </div>
        <div class="field">
          <label>Endereço de Entrega</label>
          <input type="text" [(ngModel)]="address" placeholder="Ex: Rua das Flores, 123 – São Paulo" />
        </div>
        <p class="error-msg" *ngIf="error">{{ error }}</p>
        <button class="btn btn-primary mt-1" (click)="doRegister()" [disabled]="state.loading()">
          {{ state.loading() ? 'Cadastrando...' : 'Inscrever-se' }}
        </button>
        <div class="link-row">
          Já tem uma conta? <button (click)="irPara('/login')">Iniciar sessão</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-screen { background: #fff; min-height: 100vh; display: flex; flex-direction: column; }
    .register-hero {
      height: 30vh; background: linear-gradient(135deg, #FFD8A8 0%, #FFAA60 100%);
      position: relative; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; flex-shrink: 0;
    }
    .register-hero-emoji { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 8rem; opacity: 0.18; user-select: none; }
    .register-form-wrap { flex: 1; padding: 1.5rem 1.5rem 1rem; display: flex; flex-direction: column; overflow-y: auto; }
    .register-form-wrap h2 { font-size: 1.65rem; font-weight: 700; color: var(--gray-800); margin-bottom: 1.25rem; }
    .optional { font-size: 0.72rem; font-weight: 400; color: var(--gray-400); }
  `],
})
export class RegisterComponent {
  name = ''; email = ''; password = ''; address = ''; telefone = ''; error = '';

  constructor(public state: AppStateService) {}

  async doRegister(): Promise<void> {
    if (this.state.loading()) return;
    const err = await this.state.doRegister(this.name, this.email, this.password, this.address, this.telefone);
    this.error = err ?? '';
  }
  private router = inject(Router);
  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}
