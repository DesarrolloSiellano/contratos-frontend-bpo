import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-multi-marke-maps',
  template: `<div #mapContainer style="height: 100%; width: 100%; z-index: 0 !important"></div>`,
  standalone: true,
})
export class MultiMarkeMapsComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Input() markers: Array<{ lat: number; lng: number; nombre?: string }> = [];
  @Input() center: { lat: number; lng: number } = { lat: 4.5709, lng: -74.2973 };
  @Input() zoom = 6;

  private map!: L.Map;
  private markerGroup!: L.LayerGroup;

  ngAfterViewInit() {
    this.map = L.map(this.mapContainer.nativeElement).setView([this.center.lat, this.center.lng], this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerGroup = L.layerGroup().addTo(this.map);
    this.renderMarkers();

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.markerGroup && changes['markers']) {
      this.renderMarkers();
    }
  }

 private renderMarkers() {
  this.markerGroup.clearLayers();

  if (this.markers.length === 0) return;

  // Centrar y hacer zoom en el primer marcador encontrado
  const { lat, lng } = this.markers[0];
  this.map.setView([Number(lat), Number(lng)], 14);

  this.markers.forEach(({ lat, lng, nombre }) => {
    if (lat && lng) {
      const marker = L.marker([Number(lat), Number(lng)]);
      if (nombre) marker.bindPopup(nombre);
      this.markerGroup.addLayer(marker);
    }
  });
}

}
