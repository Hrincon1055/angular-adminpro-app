import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor() {}
  public async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string | undefined
  ): Promise<any> {
    try {
      const url = `${base_url}/upload/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token-adminpro') || '',
        },
        body: formData,
      });
      const result = await response.json();
      if (result.ok) {
        return result.nombreArchivo;
      } else {
        console.log(result.msg);
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
