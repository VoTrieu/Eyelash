import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map{
  center: google.maps.LatLngLiteral = {
    lat: 43.768588,
    lng: -79.4159027,
  };

  zoom = 15;

  markerOptions: google.maps.MarkerOptions = {
    position: this.center,
    title: 'Location',
  };

  address = '5150 Yonge St, North York, ON M2N 6L8'; // Example address

  openInGoogleMaps() {
    const url = `https://www.google.com/maps?q=${this.center.lat},${this.center.lng}`;
    window.open(url, '_blank');
  }

  getDirections() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${this.center.lat},${this.center.lng}`;
    window.open(url, '_blank');
  }
}
