import { Component, computed, input } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map{
  address = input('5150 Yonge St, North York, ON M2N 6L8');
  latitude = input(43.768588);
  longitude = input(-79.4159027);

  center = computed<google.maps.LatLngLiteral>(() => ({
    lat: this.latitude(),
    lng: this.longitude(),
  }));

  zoom = 15;

  markerOptions: google.maps.MarkerOptions = {
    title: 'Location',
  };

  openInGoogleMaps() {
    const url = `https://www.google.com/maps?q=${this.center().lat},${this.center().lng}`;
    window.open(url, '_blank');
  }

  getDirections() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${this.center().lat},${this.center().lng}`;
    window.open(url, '_blank');
  }
}
