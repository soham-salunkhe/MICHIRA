import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Attraction } from '../services/api';

interface MapViewProps {
  attractions: Attraction[];
  center: [number, number];
  zoom?: number;
  selectedAttractionId?: string;
  onSelectAttraction?: (attraction: Attraction) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  attractions,
  center,
  zoom = 11,
  selectedAttractionId,
  onSelectAttraction
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        attributionControl: false
      });

      // OpenStreetMap Dark/Modern CartoDB Positron / Voyager or standard OSM tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add attraction markers
    attractions.forEach((attraction) => {
      if (!attraction.latitude || !attraction.longitude) return;

      const isEmerging = attraction.is_emerging;
      const isSelected = attraction.id === selectedAttractionId;

      // Custom HTML Marker icon
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-125 z-50' : ''}">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
            isEmerging
              ? 'bg-saffron-500 border-amber-300 text-white animate-pulse'
              : 'bg-yatra-600 border-indigo-300 text-white'
          }">
            <span style="font-size: 14px;">${isEmerging ? '🔥' : '📍'}</span>
          </div>
          <div class="absolute -bottom-6 whitespace-nowrap bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow border border-slate-700 pointer-events-none">
            ${attraction.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([attraction.latitude, attraction.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        if (onSelectAttraction) {
          onSelectAttraction(attraction);
        }
      });

      // Bind popup
      const popupHtml = `
        <div style="font-family: sans-serif; color: #0f172a; padding: 4px;">
          <h4 style="font-weight: bold; font-size: 14px; margin-bottom: 2px;">${attraction.name}</h4>
          <p style="font-size: 11px; color: #475569; margin-bottom: 6px;">${attraction.type.toUpperCase()} • ${attraction.avg_rating}★ (${attraction.total_reviews} reviews)</p>
          <p style="font-size: 12px; line-height: 1.4; color: #334155; margin-bottom: 8px;">${attraction.description.slice(0, 120)}...</p>
          <div style="display: flex; gap: 4px; font-size: 10px;">
            <span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${attraction.positive_pct}% Positive</span>
            ${isEmerging ? '<span style="background: #ffedd5; color: #9a3412; padding: 2px 6px; border-radius: 4px; font-weight: 600;">🔥 Emerging Gem</span>' : ''}
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);

      markersRef.current.push(marker);
    });

    return () => {
      // Map stays alive until unmount
    };
  }, [attractions, center, zoom, selectedAttractionId]);

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
      
      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-[1000] glass-panel px-3 py-2 rounded-xl text-xs space-y-1.5 shadow-xl">
        <p className="font-bold text-slate-200 text-[11px] mb-1">Map Layers</p>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-3 h-3 rounded-full bg-yatra-600 border border-indigo-300"></span> Standard Attraction
        </div>
        <div className="flex items-center gap-2 text-saffron-300">
          <span className="w-3 h-3 rounded-full bg-saffron-500 border border-amber-300"></span> Emerging Hidden Gem (🔥)
        </div>
      </div>
    </div>
  );
};
