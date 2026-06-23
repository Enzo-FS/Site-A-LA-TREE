import { Component } from '@angular/core';
import { AppStateService } from '../../../core/services/app-state.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <div class="welcome-screen">
      <div class="welcome-hero">
        <span class="welcome-deco d1">🍺</span>
        <span class="welcome-deco d2">🍟</span>
        <span class="welcome-deco d3">🍗</span>
        <span class="welcome-deco d4">🍔</span>
        <div class="welcome-chef">👨‍🍳</div>
      </div>
      <div class="welcome-card">
        <h1>Bem-vindo ao<br><span>Boteco da Árvore</span></h1>
        <p>O melhor sabor da região diretamente na sua mesa. Petiscos artesanais, pratos caseiros e bebidas estupidamente geladas.</p>
        <button class="btn btn-primary" (click)="irPara('/login')">Entrar na Conta</button>
        <button class="btn btn-guest mt-1" (click)="state.enterAsGuest()">Entrar como Visitante</button>
      </div>
    </div>
  `,
  styles: [`
    .welcome-screen { background: #fff; min-height: 100vh; display: flex; flex-direction: column; }
    .welcome-hero {
      background: linear-gradient(160deg, #FFC87A 0%, #F08B19 60%, #E07010 100%);
      flex: 1; min-height: 58vh; position: relative;
      display: flex; align-items: flex-end; justify-content: center; overflow: hidden;
    }
    .welcome-deco { position: absolute; pointer-events: none; font-size: 2.5rem; opacity: 0.25; }
    .welcome-deco.d1 { top: 2rem; right: 1.5rem; transform: rotate(12deg); font-size: 3rem; }
    .welcome-deco.d2 { top: 5rem; left: 1rem; transform: rotate(-12deg); font-size: 2rem; }
    .welcome-deco.d3 { top: 1rem; left: 33%; font-size: 1.5rem; }
    .welcome-deco.d4 { bottom: 8rem; right: 2rem; transform: rotate(6deg); font-size: 2rem; }
    .welcome-chef { font-size: 8rem; line-height: 1; position: relative; z-index: 2; padding-bottom: 2.5rem; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.2)); }
    .welcome-card {
      background: #fff; border-radius: 1.5rem 1.5rem 0 0;
      padding: 2.25rem 1.75rem 3.5rem; margin-top: -1.5rem;
      position: relative; z-index: 5; box-shadow: 0 -8px 40px rgba(0,0,0,0.08);
    }
    .welcome-card h1 { font-size: 1.65rem; font-weight: 800; color: var(--gray-800); line-height: 1.25; margin-bottom: 0.75rem; }
    .welcome-card h1 span { color: var(--orange); }
    .welcome-card p { color: var(--gray-500); font-size: 0.85rem; line-height: 1.65; margin-bottom: 1.5rem; }
  `],
})
export class WelcomeComponent {
  private router = inject(Router);
  constructor(public state: AppStateService) {}
  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}
