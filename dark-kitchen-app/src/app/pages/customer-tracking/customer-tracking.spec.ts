import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-customer-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-tracking.html',
  styleUrl: './customer-tracking.css'
})
export class CustomerTracking implements OnInit {
  // Inicializamos com um valor seguro para o HTML não quebrar no primeiro milissegundo
  pedido: any = { status: 'recebidos' }; 
  etaText: string = 'Calculando...';

  constructor(public orderService: OrderService) {}

  ngOnInit(): void {
    // Fica escutando as mudanças da Loja em tempo real
    this.orderService.pedidoAtual$.subscribe(dadosAtualizados => {
      this.pedido = dadosAtualizados;
      this.atualizarCronometro(this.pedido.tempoEstimadoMinutos);
    });
  }

  // Converte a string de status em um número de 0 a 4 para a barra de progresso
  getNivelStatus(status: string): number {
    const niveis = ['recebidos', 'preparacao', 'prontos', 'caminho', 'entregues'];
    return niveis.indexOf(status);
  }

  atualizarCronometro(minutos: number) {
    this.etaText = `${minutos} a ${minutos + 10} min`;
  }

  toggleAddressEdit() { /* vazio por enquanto */ }
  saveAddress() { /* vazio por enquanto */ }
  confirmDelivery(btnElement: HTMLElement) { /* vazio por enquanto */ }
}