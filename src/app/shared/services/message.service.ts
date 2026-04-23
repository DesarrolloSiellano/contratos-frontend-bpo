import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessageAletService {
  constructor() { }

   success(message: string, title: string = '¡Éxito!') {
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      showConfirmButton: false,
      timer: 1500,
      customClass: { title: 'color-custom-title-alert' },
    });
  }

  error(message: string, title: string = '¡Error!') {
    return Swal.fire({
      icon: 'error',
      title,
      text: message,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { title: 'color-custom-title-alert' },
    });
  }

  confirm(message: string, title: string = '¿Estás seguro?', confirmBtn = 'Sí', cancelBtn = 'Cancelar') {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmBtn,
      cancelButtonText: cancelBtn,
      customClass: { title: 'color-custom-title-alert' },
    });
  }
}
