import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AppStateService } from '../../core/services/app-state.service';
import { PedidoService } from '../../core/services/pedido.service';
import { BottomNavComponent } from '../../pages/client-app/bottom-nav/bottom-nav.component';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore'; 

@Component({
  selector: 'app-customer-tracking',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  templateUrl: './customer-tracking.html', // 👈 Apontando pro HTML correto
  styleUrl: './customer-tracking.css'
})
export class CustomerTracking implements OnInit, OnDestroy {
  pedidoReal: any = null; 
  etaText: string = 'Calculando...';
  addressEditMode: boolean = false;
  mapaInterativoUrl!: SafeResourceUrl;

  private pedidoService = inject(PedidoService);
  public state = inject(AppStateService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);
  private firestore = inject(Firestore); 
  private zone = inject(NgZone); 
  private route = inject(ActivatedRoute); 

  private escutaDoFirebase: any; 

  isChatOpen: boolean = false;
  chatType: 'driver' | 'store' = 'store';
  chatMessages: string[] = [];

  openChat(type: 'driver' | 'store') {
    if (type === 'driver' && !this.pedidoReal?.motoboy) {
      alert('O entregador ainda não foi atribuído a este pedido.');
      return;
    }
    this.chatType = type;
    this.chatMessages = []; // Limpa o histórico fictício anterior
    this.isChatOpen = true;
  }

  closeChat() {
    this.isChatOpen = false;
  }

  sendMessage(inputElement: HTMLInputElement) {
    const msg = inputElement.value;
    if (!msg.trim()) return;
  
    
    this.chatMessages.push(msg.trim());
    inputElement.value = ''; // Limpa o campo
    
   
    setTimeout(() => {
      const respostaAutomada = this.chatType === 'driver' 
        ? 'Entregador: Estou no trânsito, focando na rua. Chego em breve!' 
        : 'Loja: Recebemos sua mensagem. Nosso time de atendimento está verificando.';
      alert(respostaAutomada); // Você pode trocar o alert por uma mensagem real na tela do chat no futuro
    }, 1500);
  }





  async ngOnInit() {
    const pedidoId = this.route.snapshot.paramMap.get('id');
    if (pedidoId) {
      await this.carregarPedidoEspecifico(pedidoId);
    } else {
      await this.carregarMeuUltimoPedido();
    }
  }

  async carregarPedidoEspecifico(id: string) {
    try {
      const pedidoRef = doc(this.firestore, 'pedidos', id);
      this.escutaDoFirebase = onSnapshot(pedidoRef, (docSnap) => {
        if (docSnap.exists()) {
          this.zone.run(() => {
            this.pedidoReal = { id: docSnap.id, ...docSnap.data() };
            this.atualizarInterface();
            this.cdr.detectChanges(); 
          });
        }
      });
    } catch (error) {
      console.error("Erro ao buscar pedido específico:", error);
    }
  }

  async carregarMeuUltimoPedido() {
    const user = this.state.user();
    if (!user || !user.id) return;

    try {
      const pedidos = await this.pedidoService.buscarPedidosPorUsuario(user.id);
      if (pedidos && pedidos.length > 0) {
        const pedidosMaisNovos = pedidos.reverse(); 
        let pedidoAtivo = pedidosMaisNovos.find((p: any) => p.status !== 'entregue');
        let pedidoAlvo = pedidoAtivo || pedidosMaisNovos[0];
        
        if (pedidoAlvo && pedidoAlvo.id) {
          await this.carregarPedidoEspecifico(pedidoAlvo.id);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar último pedido:", error);
    }
  }

  atualizarInterface() {
    this.atualizarCronometro(this.pedidoReal?.status || '');
    this.atualizarMapa(this.pedidoReal?.enderecoEntrega || '');
  }

  atualizarMapa(endereco: string) {
    if (!endereco) return;
    const busca = encodeURIComponent(endereco + ', São Paulo');
    const urlNua = `https://maps.google.com/maps?q=${busca}&output=embed`;
    this.mapaInterativoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlNua);
  }

  getNivelStatus(status: string): number {
    if (!status) return -1;
    if (status === 'recebido') return 0;
    if (status === 'preparando') return 1;
    if (status === 'prontos') return 2; 
    if (status === 'saiu_para_entrega') return 3; 
    if (status === 'entregue') return 4;
    return 0;
  }

  atualizarCronometro(status: string) { 
    if (status === 'recebido') this.etaText = '40 a 50 min';
    else if (status === 'preparando') this.etaText = '20 a 30 min';
    else if (status === 'prontos') this.etaText = 'Aguardando Entregador';
    else if (status === 'saiu_para_entrega') this.etaText = '10 a 15 min';
    else this.etaText = 'Concluído';
  }
  
  toggleAddressEdit() { this.addressEditMode = !this.addressEditMode; }
  
  saveAddress(novoEndereco: string) { 
    if(this.pedidoReal) {
      this.pedidoReal.enderecoEntrega = novoEndereco;
      this.addressEditMode = false; 
    }
  }
  
  async confirmDelivery(btnElement: HTMLElement) { 
    if (!this.pedidoReal) return;
    btnElement.classList.add('confirmed');
    btnElement.innerHTML = '✔ Entrega Finalizada!';
    await this.pedidoService.atualizarStatusPedido(this.pedidoReal.id, 'entregue' as any);
  }

  ngOnDestroy() {
    if (this.escutaDoFirebase) {
      this.escutaDoFirebase();
    }
  }
}