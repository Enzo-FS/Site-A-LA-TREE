import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService, FOODS, DAYS_MENU } from '../../../core/services/app-state.service';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { FoodCardComponent } from '../food-card/food-card.component';
import { Router } from '@angular/router';

const DAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

interface DayPill { label: string; num: number; isToday: boolean; index: number; hasSpecial: boolean; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, FoodCardComponent],
  template: `
    <div class="home-screen">
      <div class="home-header">
        <h2>{{ greeting }}, <span>{{ displayName }}</span></h2>
        <p>Escolha a refeição certa para você.</p>
      </div>

      <div class="guest-banner" *ngIf="state.isGuest()">
        <span>🔒</span>
        <div class="gb-text">
          <strong>Você está como visitante</strong> Faça login para adicionar itens e finalizar pedidos.
          <br><button class="gb-login" (click)="irPara('/login')">Entrar agora →</button>
        </div>
      </div>

      <div class="calendar-strip">
        <div class="strip-header">
          <span>Servindo este mês</span>
          <em>{{ calRange }}</em>
        </div>
        <div class="day-pills">
          <div
            *ngFor="let d of weekDays"
            class="day-pill"
            [class.today]="d.isToday"
            [class.has-special]="d.hasSpecial"
            (click)="state.openDayModal(d.index, days[d.index])"
          >
            <span class="dl">{{ d.label }}</span>
            <span class="dn">{{ d.num }}</span>
          </div>
        </div>
      </div>

      <div class="section-block">
        <h3>Refeição de hoje</h3>
        <div class="categories">
          <button class="cat-btn" (click)="nav('Pratos')"><div class="cat-icon">🍲</div><span>Pratos</span></button>
          <button class="cat-btn" (click)="nav('Lanches')"><div class="cat-icon highlight">🍔</div><span>Lanches</span></button>
          <button class="cat-btn" (click)="nav('Porções')"><div class="cat-icon">🍟</div><span>Porções</span></button>
          <button class="cat-btn" (click)="nav('Bebidas')"><div class="cat-icon">🥤</div><span>Bebidas</span></button>
          <button class="cat-btn" (click)="nav('Entrada')"><div class="cat-icon">🥗</div><span>Entrada</span></button>
        </div>
      </div>

      <div class="popular-section">
        <div class="sec-row">
          <h3>Popular</h3>
          <button (click)="navAll()">Ver tudo</button>
        </div>
        <div class="food-grid">
          <app-food-card *ngFor="let f of popularFoods" [food]="f"></app-food-card>
        </div>
        <div *ngIf="popularFoods.length === 0" class="empty-popular">
          <span>🍽️</span>
          <p>Cardápio em breve!</p>
        </div>
      </div>

      <app-bottom-nav active="home"></app-bottom-nav>
    </div>
  `,
  styles: [`
    .home-screen { background: var(--bg); min-height: 100svh; width: 100%; display: flex; flex-direction: column; padding-bottom: 90px; box-sizing: border-box; overflow-x: hidden; }
    .home-header { background: var(--white); padding: 3.5rem 1.25rem 1.25rem; width: 100%; box-sizing: border-box; }
    .home-header h2 { font-size: 1.4rem; font-weight: 800; color: var(--gray-800); }
    .home-header h2 span { color: var(--orange); }
    .home-header p { color: var(--gray-400); font-size: 0.8rem; margin-top: 0.25rem; }
    .guest-banner { background: linear-gradient(135deg,#FFF3E0,#FFE0B2); border: 1.5px solid #FFD08B; border-radius: var(--radius); padding: 0.75rem 1rem; margin: 0.75rem 1.25rem 0; display: flex; align-items: center; gap: 0.75rem; font-size: 0.78rem; color: #7B4A00; }
    .guest-banner > span { font-size: 1.3rem; flex-shrink: 0; }
    .gb-text strong { display: block; font-weight: 700; margin-bottom: 0.1rem; }
    .gb-login { background: none; border: none; font-weight: 700; color: var(--orange); cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 0.78rem; padding: 0; text-decoration: underline; margin-top: 0.2rem; }
    .calendar-strip { background: var(--white); padding: 1rem 1.25rem 1.25rem; margin-top: 2px; width: 100%; box-sizing: border-box; }
    .strip-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .strip-header span { font-size: 0.82rem; font-weight: 600; color: var(--gray-800); }
    .strip-header em { font-style: normal; font-size: 0.72rem; font-weight: 600; color: var(--orange); }
    .day-pills { display: flex; gap: 2px; }
    .day-pill { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 0.5rem 0.2rem; border-radius: 0.65rem; transition: background 0.15s; cursor: pointer; }
    .day-pill .dl { font-size: 0.6rem; font-weight: 500; }
    .day-pill .dn { font-size: 0.8rem; font-weight: 700; margin-top: 2px; }
    .day-pill.today { background: var(--orange); }
    .day-pill.today .dl, .day-pill.today .dn { color: #fff; }
    .day-pill:not(.today) .dl { color: var(--gray-400); }
    .day-pill:not(.today) .dn { color: var(--gray-800); }
    .day-pill:active { transform: scale(0.93); }
    .day-pill.has-special::after { content: '•'; display: block; font-size: 0.5rem; color: var(--orange); line-height: 1; margin-top: 2px; }
    .day-pill.today.has-special::after { color: rgba(255,255,255,0.8); }
    
    .section-block { background: var(--white); padding: 1rem 1.25rem; margin-top: 0.5rem; width: 100%; box-sizing: border-box; }
    .section-block h3 { font-size: 0.82rem; font-weight: 600; color: var(--gray-800); margin-bottom: 0.85rem; }
    
    /* 👇 Ajuste de Scroll Horizontal das Categorias 👇 */
    .categories { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
    .categories::-webkit-scrollbar { display: none; }
    .cat-btn { flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; }
    
    .cat-icon { width: 3.25rem; height: 3.25rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: var(--gray-100); border: 2px solid transparent; transition: all 0.15s; }
    .cat-icon.highlight { background: var(--orange-lite); border-color: var(--orange); }
    .cat-btn span { font-size: 0.68rem; font-weight: 500; color: var(--gray-700); }
    
    .popular-section { padding: 1rem 1.25rem; margin-top: 0.5rem; width: 100%; box-sizing: border-box; }
    .sec-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .sec-row h3 { font-size: 0.82rem; font-weight: 600; color: var(--gray-800); }
    .sec-row button { background: none; border: none; color: var(--orange); font-size: 0.75rem; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif; }
    .food-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .empty-popular { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 3rem 0; color: var(--gray-400); }
    .empty-popular span { font-size: 3rem; }
    .empty-popular p { font-size: 0.82rem; }
  `],
})
export class HomeComponent implements OnInit {
  days = DAYS;
  weekDays: DayPill[] = [];
  calRange = '';
  greeting = '';
  displayName = '';

  public state = inject(AppStateService);
  private router = inject(Router);

  get popularFoods() {
    return FOODS.slice(0, 4);
  }

  ngOnInit(): void {
    this.buildWeek();
    this.buildGreeting();
  }

  private buildGreeting(): void {
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
    const u = this.state.user();
    this.displayName = u ? u.name.split(' ')[0] + '!' : 'Visitante!';
  }

  private buildWeek(): void {
    const today = new Date();
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - today.getDay() + i);
      return {
        label: DAYS[i], num: d.getDate(),
        isToday: i === today.getDay(), index: i,
        hasSpecial: (DAYS_MENU[i] ?? []).length > 0,
      };
    });
    this.calRange = `${this.weekDays[0].num}-${this.weekDays[6].num} (7 Dias)`;
  }
  
  nav(filter: string): void { this.state.setFilter(filter); this.router.navigate(['/explorar']); }
  navAll(): void { this.state.setFilter('Todos'); this.router.navigate(['/explorar']); }

  irPara(rota: string) {
    this.router.navigate([rota]);
  }
}