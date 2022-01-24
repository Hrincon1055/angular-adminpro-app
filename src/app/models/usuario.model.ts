import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public google?: boolean,
    public img?: string,
    public role?: string,
    public uid?: string,
    public password?: string
  ) {}
  // http://localhost:3005/api/upload/usuarios/f8e07160-bd3e-4d86-a393-5148f103b64b.jpg
  get imagenUrl(): string {
    if (this.img?.includes('https')) {
      return this.img;
    }
    if (this.img) {
      return `${base_url}/upload/usuarios/${this.img}`;
    } else {
      return `${base_url}/upload/usuarios/no-image`;
    }
  }
}
