import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  
  // Coordenadas fixas da sua Dark Kitchen (Ex: Av Paulista. Formato: Longitude, Latitude)
  // IMPORTANTE: O OSRM usa a ordem [Longitude, Latitude]
  private lojaLon = '-46.6510';
  private lojaLat = '-23.5650';

  constructor() { }

  async calcularTempoEstimado(enderecoCliente: string): Promise<string> {
    try {
      // PASSO 1: Converter o endereço em coordenadas (Nominatim)
      // Adicionamos "São Paulo" para garantir que a busca não caia em outra cidade
      const busca = encodeURIComponent(`${enderecoCliente}, São Paulo, Brasil`);
      const urlGeocode = `https://nominatim.openstreetmap.org/search?format=json&q=${busca}&limit=1`;
      
      const resGeocode = await fetch(urlGeocode);
      const dadosGeocode = await resGeocode.json();

      if (!dadosGeocode || dadosGeocode.length === 0) {
        return 'Tempo não calculado (Endereço não encontrado)';
      }

      const clienteLon = dadosGeocode[0].lon;
      const clienteLat = dadosGeocode[0].lat;

      // PASSO 2: Calcular a rota e o tempo (OSRM)
      // URL no formato: /driving/{lon_origem},{lat_origem};{lon_destino},{lat_destino}
      const urlRota = `https://router.project-osrm.org/route/v1/driving/${this.lojaLon},${this.lojaLat};${clienteLon},${clienteLat}?overview=false`;
      
      const resRota = await fetch(urlRota);
      const dadosRota = await resRota.json();

      if (dadosRota.code !== 'Ok') {
        return 'Erro ao traçar rota';
      }

      // OSRM retorna a duração em segundos. Vamos converter para minutos.
      const duracaoSegundos = dadosRota.routes[0].duration;
      const duracaoMinutos = Math.ceil(duracaoSegundos / 60);

      return `${duracaoMinutos} min`;

    } catch (erro) {
      console.error('Falha na API de Roteamento Gratuita:', erro);
      return 'Indisponível';
    }
  }
}