import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private pedidoSource = new BehaviorSubject<any>(this.getEstadoInicial());
  pedidoAtual$ = this.pedidoSource.asObservable();

  constructor(private zone: NgZone) {
    window.addEventListener('storage', (event) => {
      if (event.key === 'dk_pedido_1234' && event.newValue) {
        this.zone.run(() => {
          this.pedidoSource.next(JSON.parse(event.newValue as string));
        });
      }
    });
  }

  private getEstadoInicial() {
    const salvo = localStorage.getItem('dk_pedido_1234');
    if (salvo) return JSON.parse(salvo);
    
    return {
      id: '1234', cliente: 'João Silva', endereco: 'Rua Tiradentes, 67 - Bairro 1',
      status: 'recebidos', resumo: '1x Frango Tailandês, 2x Salada', total: '187,00', pagto: 'Via PIX',
      motoboyDados: null, // Guarda o objeto completo (Nome, Placa, Modelo)
      tempoEstimadoMinutos: 45
    };
  }

  atualizarStatus(novoStatus: string) {
    const pedido = this.pedidoSource.value;
    const atualizado = { ...pedido, status: novoStatus };
    this.pedidoSource.next(atualizado); 
    localStorage.setItem('dk_pedido_1234', JSON.stringify(atualizado)); 
  }

  atribuirMotoboy(motoboyCompleto: any) {
    const pedido = this.pedidoSource.value;
    const atualizado = { 
      ...pedido, 
      motoboyDados: motoboyCompleto, // Salva todos os dados na memória
      status: 'caminho',
      tempoEstimadoMinutos: 15
    };
    this.pedidoSource.next(atualizado); 
    localStorage.setItem('dk_pedido_1234', JSON.stringify(atualizado)); 
  }

  resetarPedidoTeste() {
    const estadoInicial = {
      id: '1234', cliente: 'João Silva', endereco: 'Rua Tiradentes, 67 - Bairro 1',
      status: 'recebidos', resumo: '1x Frango Tailandês, 2x Salada', total: '187,00', pagto: 'Via PIX',
      motoboyDados: null, 
      tempoEstimadoMinutos: 45
    };
    
    this.pedidoSource.next(estadoInicial); // Atualiza as telas na mesma hora
    localStorage.setItem('dk_pedido_1234', JSON.stringify(estadoInicial)); // Salva o reset no disco
  }
}