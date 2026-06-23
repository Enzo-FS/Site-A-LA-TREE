import { Injectable, inject } from '@angular/core';
// Você pode até remover o FirebaseStorage daqui se quiser, pois usaremos o Storage
import { ref, uploadBytes, getDownloadURL, Storage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  // A MUDANÇA FOI SÓ NESTA LINHA ABAIXO:
  private storage: Storage = inject(Storage);

  async uploadImagem(file: File, pasta = 'produtos'): Promise<string> {
    const caminho = `${pasta}/${Date.now()}-${file.name}`;
    const arquivoRef = ref(this.storage, caminho);
    await uploadBytes(arquivoRef, file);
    return getDownloadURL(arquivoRef);
  }
}