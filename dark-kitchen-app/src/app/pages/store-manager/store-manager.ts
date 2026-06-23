import { Component, OnInit, inject, NgZone } from '@angular/core'; // Adicionado NgZone
import { CommonModule } from '@angular/common'; 
import { DatabaseService } from '../../core/services/database'; 
import { PedidoService } from '../../core/services/pedido.service'; 
import { Observable } from 'rxjs';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore'; 

@Component({
  selector: 'app-store-manager',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './store-manager.html',
  styleUrl: './store-manager.css'
})
export class StoreManager implements OnInit {
  currentTab: string = 'recebidos';
  motoboys$: Observable<any[]>;
  pedidos: any[] = []; 
  listaMotoboys: any[] = [];

  private pedidoService = inject(PedidoService);
  private firestore = inject(Firestore);
  private zone = inject(NgZone); // Injeção da Zona

  constructor(private dbService: DatabaseService) {
    this.motoboys$ = this.dbService.getMotoboys();
    this.motoboys$.subscribe(motos => this.listaMotoboys = motos);
  }

  async ngOnInit() { await this.carregarPedidos(); }

  async carregarPedidos() {
    try { this.pedidos = await this.pedidoService.listarPedidos(); } 
    catch (error) { console.error("Erro:", error); }
  }

  setTab(tabName: string) { this.currentTab = tabName; }

  getPedidos(tabStatus: string) {
    let statusFirebase = tabStatus === 'recebidos' ? 'recebido' : tabStatus === 'preparacao' ? 'preparando' : tabStatus === 'caminho' ? 'saiu_para_entrega' : tabStatus;
    return this.pedidos.filter(p => p.status === statusFirebase);
  }

  // Corrigido: Uso de NgZone para evitar clique duplo
  async avancarPedido(pedido: any, novoStatusHtml: string) {
    this.zone.run(async () => {
      let statusFirebase = novoStatusHtml === 'preparacao' ? 'preparando' : novoStatusHtml === 'caminho' ? 'saiu_para_entrega' : novoStatusHtml;
      try {
        await this.pedidoService.atualizarStatusPedido(pedido.id, statusFirebase as any);
        await this.carregarPedidos(); 
        this.setTab(novoStatusHtml === 'entregue' ? 'caminho' : novoStatusHtml);
        if (novoStatusHtml === 'entregue') alert('✅ Pedido finalizado!');
      } catch (e) { console.error(e); }
    });
  }

  // Corrigido: Busca o motoboy completo para gravar modelo e placa
  async atribuirMotoboy(pedido: any, nomeMoto: string) {
    if (!nomeMoto) return alert('Selecione um motoboy.');
    const motoboyCompleto = this.listaMotoboys.find(m => m.nome === nomeMoto);
    try {
      const pedidoRef = doc(this.firestore, 'pedidos', pedido.id);
      await updateDoc(pedidoRef, {
        motoboy: nomeMoto,
        modeloMoto: motoboyCompleto?.modeloMoto || 'N/A',
        placaMoto: motoboyCompleto?.placa || 'N/A',
        status: 'saiu_para_entrega'
      });
      await this.carregarPedidos();
      this.setTab('caminho');
    } catch (e) { console.error(e); }
  }

  cadastrarMotoboy(nome: string, modelo: string, placa: string, telefone: string) {
    this.dbService.addMotoboy({ nome, modeloMoto: modelo, placa: placa.toUpperCase(), telefone, ativo: true });
  }

  resetarTeste() { alert('Conectado ao Banco Real.'); }
}