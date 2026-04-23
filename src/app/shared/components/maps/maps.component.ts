import {
  Component,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-maps',
  template: `<div #mapContainer style="height: 400px; width: 100%; z-index: 0 !important"></div>`, // elimina id
  standalone: true,
})
export class MapsComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  @Input() initialLat = 4.5709;
  @Input() initialLng = -74.2973;
  @Input() initialZoom = 6;
  @Output() markerChanged = new EventEmitter<{ lat: number; lng: number }>();

  private map!: L.Map;
  private marker!: L.Marker;

  constructor() {
    const DefaultIcon = L.icon({
      iconUrl: 'media/marker-icon.png',
      shadowUrl: 'media/marker-shadow.png',
      iconRetinaUrl: 'media/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.initialLat, this.initialLng],
      this.initialZoom
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const coords = e.latlng;
      if (this.marker) this.map.removeLayer(this.marker);
      this.marker = L.marker([coords.lat, coords.lng]).addTo(this.map);
      this.markerChanged.emit({ lat: coords.lat, lng: coords.lng });
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  resizeMap() {
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  setMarkerPosition(lat: number, lng: number, zoom?: number) {
    if (!this.map) return;
    this.map.setView([lat, lng], zoom ?? this.initialZoom); // usa parámetro zoom si existe
    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.markerChanged.emit({ lat, lng });
  }
}
