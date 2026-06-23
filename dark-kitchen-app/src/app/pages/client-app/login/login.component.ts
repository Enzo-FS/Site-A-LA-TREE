import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-screen">
    <div class="top-bar">
        <button class="icon-btn" (click)="irPara('/home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span class="top-bar-title">Cardápio Completo</span>
        <div style="width:2.2rem"></div>
      </div>
      <div class="login-hero">
        <div class="login-hero-emoji">🍽️🍻</div>
        <div class="login-icon-box">🔐</div>
      </div>
      <div class="login-form-wrap">
        <h2>Iniciar Sessão</h2>
        <div class="field">
          <label>E-mail</label>
          <input type="email" [(ngModel)]="email" placeholder="seuemail@exemplo.com" />
        </div>
        <div class="field">
          <label>Senha</label>
          <input type="password" [(ngModel)]="password" placeholder="Digite sua senha" />
        </div>
        <p class="error-msg" *ngIf="error">{{ error }}</p>
        <button class="btn btn-primary mt-1" (click)="doLogin()" [disabled]="state.loading()">
          {{ state.loading() ? 'Entrando...' : 'Entrar' }}
        </button>
        <div class="divider"><span>ou</span></div>
        <button class="btn btn-ghost" (click)="state.enterAsGuest()">Acessar como Visitante</button>
        <div class="link-row">
          Não tem conta? <button (click)="irPara('/register')">Cadastre-se</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-screen { background: #fff; min-height: 100vh; display: flex; flex-direction: column; }
    .login-hero {
      height: 38vh;
      background: linear-gradient(135deg, #FFD8A8 0%, #FFAA60 100%);
      position: relative; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; flex-shrink: 0;
    }
    .login-hero-emoji { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 9rem; opacity: 0.18; user-select: none; }
    .login-icon-box { position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); width: 4rem; height: 4rem; background: #fff; border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    .login-form-wrap { flex: 1; padding: 2rem 1.5rem 1.5rem; display: flex; flex-direction: column; overflow-y: auto; }
    .login-form-wrap h2 { font-size: 1.65rem; font-weight: 700; color: var(--gray-800); margin-bottom: 1.5rem; }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(public state: AppStateService) {}

  async doLogin(): Promise<void> {
    if (this.state.loading()) return;
    const err = await this.state.doLogin(this.email, this.password);
    this.error = err ?? '';
  }

  private router = inject(Router);
  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}
