# 🌳 A LA TREE

Ecossistema completo de delivery para dark kitchen, construído em **Angular 17** com **Firebase** (Authentication + Firestore + Storage). 

O projeto é dividido em três frentes integradas em uma única aplicação: **App do Cliente**, **Painel Operacional (Gerência)** e **Painel do Entregador (Motoboy)**. O sistema consome catálogo, autenticações e pedidos a partir de dois projetos Firebase distintos: um banco principal para usuários/pedidos/frota, e o banco do painel de gerência para o cardápio.

## ✨ Funcionalidades

### 📱 App do Cliente
* **Autenticação:** Login e cadastro via Firebase Authentication (e-mail/senha) e modo Visitante.
* **Catálogo em Tempo Real:** Cardápio carregado dinamicamente com categorias (Pratos, Lanches, Porções, Bebidas, Entrada).
* **Carrinho e Checkout:** Fluxo completo de pedido com cálculo de subtotal e seleção de pagamento (Entrega ou Pix).
* **Rastreamento Ao Vivo:** Stepper visual (Aguardando, Preparando, Pronto, Em Rota, Entregue) com mapa interativo.
* **Suporte Integrado:** Simulação de chat flutuante para contato com a Loja ou com o Entregador parceiro.
* **Perfil de Usuário:** Gerenciamento de dados de contato e endereço de entrega.

### ⚙️ Painel Operacional (Gerência)
* **Gestão de Filas (Kanban):** Separação de pedidos em abas (Novos, Cozinha, Prontos, Em Rota).
* **Atribuição Logística:** Seleção e despacho de entregadores diretamente pelo painel.
* **Gestão de Frota:** Cadastro de motoboys, modelos de veículos e placas.
* **Design Corporativo:** Interface minimalista utilizando conceitos de *Glassmorphism* (fundos translúcidos).

### 🏍️ Painel do Entregador
* **Sincronização de Rotas:** O entregador visualiza imediatamente o pedido atribuído a ele com os dados do cliente.
* **Controle de Status:** Botões de ação rápida para confirmar coleta ("Estou a Caminho") e finalização ("Entrega Realizada").

---

## 🏗️ Arquitetura

O projeto utiliza **Standalone Components** (sem NgModules) e injeção de dependências moderna, além de contar com a `NgZone` para otimização de detecção de mudanças (evitando falhas de clique).

```text
src/
├── environments/
│   ├── environment.ts            # Credenciais Firebase (dev)
│   └── environment.prod.ts       # Credenciais Firebase (prod)
│
├── app/
│   ├── core/
│   │   ├── models/                # Interfaces TypeScript (Food, CartItem, User, etc.)
│   │   └── services/
│   │       ├── auth.service.ts         # Firebase Authentication
│   │       ├── pedido.service.ts       # CRUD de pedidos (Firestore Principal)
│   │       ├── produto.service.ts      # Leitura do catálogo (Firestore Gerência)
│   │       ├── database.service.ts     # Gestão da frota (motoboys)
│   │       └── app-state.service.ts    # Estado global e regras de negócio
│   │
│   ├── pages/                     # Telas (Roteamento via Angular Router)
│   │   ├── customer/              # home, explore, cart, payment, customer-tracking, profile
│   │   ├── admin/                 # admin-dashboard, store-manager
│   │   └── driver/                # driver-panel
│   │
│   └── shared/                    # Componentes reutilizáveis (bottom-nav, food-card, etc.)
│
├── main.ts                        # Bootstrap da app + providers do Firebase + Router
└── styles.css                     # Variáveis globais, CSS Reset e regras 100svh mobile-first
