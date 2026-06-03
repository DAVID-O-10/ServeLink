import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [6.5244, 3.3792];

export default function MapView({ businesses = [], height = '400px', onSelect }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, { scrollWheelZoom: false }).setView(
      DEFAULT_CENTER,
      11
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    const bounds = [];

    businesses.forEach((b, i) => {
      const lat = DEFAULT_CENTER[0] + ((i % 5) - 2) * 0.015;
      const lng = DEFAULT_CENTER[1] + (Math.floor(i / 5) - 2) * 0.015;
      const marker = L.marker([lat, lng])
        .addTo(mapRef.current)
        .bindPopup(`<strong>${b.businessName}</strong><br/>${b.address || ''}`);
      marker.on('click', () => onSelect?.(b));
      markersRef.current.push(marker);
      bounds.push([lat, lng]);
    });

    if (bounds.length > 1) mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    else if (bounds.length === 1) mapRef.current.setView(bounds[0], 13);
  }, [businesses, onSelect]);

  return (
    <div
      className="w-full rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
      style={{ height }}
    >
      <div ref={containerRef} className="w-full h-full z-0" />
    </div>
  );
}
