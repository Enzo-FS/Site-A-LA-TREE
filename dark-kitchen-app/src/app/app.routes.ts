import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/store-manager/admin-dashboard.component';

// ─── originais ───
import { CustomerTracking } from './pages/customer-tracking/customer-tracking';
import { StoreManager } from './pages/store-manager/store-manager';
import { DriverPanel } from './pages/driver-panel/driver-panel';

// ─── rafa e theo ───
import { HomeComponent } from './pages/client-app/home/home.component';
import { ExploreComponent } from './pages/client-app/explore/explore.component';
import { PaymentComponent } from './pages/client-app/payment/payment.component';
import { LoginComponent } from './pages/client-app/login/login.component';
import { OrdersComponent } from './pages/client-app/orders/orders.component';

import { ProfileComponent } from './pages/client-app/profile/profile.component';
import { CartComponent } from './pages/client-app/cart/cart.component';
import { ConfirmationComponent } from './pages/client-app/confirmation/confirmation.component';
import { RegisterComponent } from './pages/client-app/register/register.component';
import { DetailComponent } from './pages/client-app/detail/detail.component';


export const routes: Routes = [
  
  // ─── ÁREA DO CLIENTE FINAL ───
  { path: 'home', component: HomeComponent },
  { path: 'explorar', component: ExploreComponent },
  { path: 'pagamento', component: PaymentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'meus-pedidos', component: OrdersComponent },
  { path: 'carrinho', component: CartComponent },
  
  // 👇 AS ROTAS QUE ESTAVAM FALTANDO PARA OS BOTÕES FUNCIONAREM
  { path: 'perfil', component: ProfileComponent },
  { path: 'confirmacao', component: ConfirmationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'detalhes', component: DetailComponent },

  // ─── ÁREA OPERACIONAL (Seu ecossistema) ───
  { path: 'pedido', component: CustomerTracking },
  {path: 'pedido/:id', component: CustomerTracking },
  { path: 'painel', component: StoreManager },
  { path: 'motoboy', component: DriverPanel },
  
  // ─── ROTA PADRÃO (O que abre ao acessar o site "limpo") ───
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ─── ROTA CORINGA (Segurança) ───
  { path: '**', redirectTo: 'home' },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'catalogo', component: AdminDashboardComponent }, // ⚠️ Substitua depois
  { path: 'estoque', component: AdminDashboardComponent },  // ⚠️ Substitua depois
  { path: 'informacoes', component: AdminDashboardComponent },
];