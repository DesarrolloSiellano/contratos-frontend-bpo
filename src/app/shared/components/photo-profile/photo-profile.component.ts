import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  ImageCropperComponent,
  ImageCroppedEvent,
  LoadedImage,
} from 'ngx-image-cropper';
import { MessageAletService } from '../../services/message.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-photo-profile',
  standalone: true,
  imports: [ImageCropperComponent, DialogModule, ButtonModule],
  templateUrl: './photo-profile.component.html',
  styleUrls: ['./photo-profile.component.scss'],
})
export class PhotoProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  // Inputs para personalización
  @Input() showName: boolean = false;
  @Input() name: string = '';
  @Input() imageUrl: string =
    'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';
  @Input() showText: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  // Outputs para comunicación con padre
  @Output() fileSelected = new EventEmitter<any>();
  @Output() photoClicked = new EventEmitter<void>();

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  cropperVisible = false;

  constructor(
    private sanitizer: DomSanitizer,
    private message: MessageAletService
  ) {}

  ngOnInit() {
    // Verificar que el input esté disponible
  }

  onFileSelected(event: any): void {
    //const file = event.target.files[0]

    this.imageChangedEvent = event;
    this.cropperVisible = true;
    // Resetear input para permitir selección del mismo archivo
    //this.fileInput.nativeElement.value = '';
    //this.fileSelected.emit(file); // Enviar archivo al padre
  }

  setPhotoProfile(): void {
    //this.photoClicked.emit(); // Notificar click al padre

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedImage = event.base64;
    } else if (event.blob) {
      const reader = new FileReader();
      reader.onload = () => {
        this.croppedImage = reader.result as string;
      };
      reader.readAsDataURL(event.blob);
    } else if (event.objectUrl) {
      this.croppedImage = event.objectUrl;
    }
  }

  imageLoaded(image: LoadedImage) {
    console.info('imageLoaded', image);
  }

  cropperReady() {
    console.log('Cropper ok');
  }

  loadImageFailed() {
    this.message.error('Error al cargar la imagen');
  }

  saveImg() {
    if (this.croppedImage) {
      // Guardar en localStorage
      //localStorage.setItem('profilePhoto', this.croppedImage as string);
      //this.fileInput.nativeElement.value = '';
      this.fileSelected.emit(this.croppedImage); // Enviar archivo al padre
      this.imageUrl = this.croppedImage as string;
    }
    this.cropperVisible = false;
    this.resetInput();
  }

  closeModal() {
    this.cropperVisible = false;
    this.resetInput();
  }

  private resetInput() {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
