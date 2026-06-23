import { Component, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../core/services/pedido.service';
import { Firestore, collection, query, onSnapshot, orderBy, limit } from '@angular/fire/firestore';

@Component({
  selector: 'app-driver-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-panel.html',
  styleUrl: './driver-panel.css'
})
export class DriverPanel implements OnInit {
  private pedidoService = inject(PedidoService);
  private firestore = inject(Firestore);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  pedido: any = null;

  ngOnInit() {
    // Conecta diretamente no Firebase e puxa o pedido mais recente da loja
    const pedidosRef = collection(this.firestore, 'pedidos');
    const q = query(pedidosRef, orderBy('createdAt', 'desc'), limit(1));

    onSnapshot(q, (snapshot) => {
      this.zone.run(() => {
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          this.pedido = { id: docSnap.id, ...docSnap.data() };
        } else {
          this.pedido = null;
        }
        this.cdr.detectChanges();
      });
    });
  }

  async iniciarEntrega() {
    if(!this.pedido) return;
    // O motoboy clica e avisa o Firebase que saiu para entregar!
    await this.pedidoService.atualizarStatusPedido(this.pedido.id, 'saiu_para_entrega' as any);
  }

  async concluirEntrega() {
    if(!this.pedido) return;
    // O motoboy finaliza a entrega no banco de dados
    await this.pedidoService.atualizarStatusPedido(this.pedido.id, 'entregue' as any);
  }
}