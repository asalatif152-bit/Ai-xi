import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, MapPin, ShieldAlert, Navigation } from 'lucide-react';
import L from 'leaflet';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  location: {
    lat: number;
    lng: number;
    placeName: string;
    confidence?: string;
  } | null;
}

export const RedCircleMapModal: React.FC<Props> = ({ isOpen, onClose, location }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!isOpen || !location || !mapContainerRef.current) return;

    // Fix default marker icon assets
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const lat = location.lat;
    const lng = location.lng;

    // Small delay to ensure modal DOM is mounted
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 11,
        zoomControl: true,
      });
      mapInstanceRef.current = map;

      // Dark style OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Draw the prominent RED CIRCLE around the suspected city / district boundary
      const redCircle = L.circle([lat, lng], {
        color: '#ef4444',
        weight: 3,
        opacity: 0.9,
        fillColor: '#ef4444',
        fillOpacity: 0.22,
        radius: 7500, // 7.5km covering the city/district zone
      }).addTo(map);

      const customPin = L.divIcon({
        className: 'custom-red-pin',
        html: `<div style="background:#ef4444; width:16px; height:16px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 10px #ef4444;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([lat, lng], { icon: customPin }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:sans-serif; text-align:right; direction:rtl; padding:4px;">
          <strong style="color:#ef4444; font-size:13px;">🔴 بازنەی گومانی شارەکە</strong><br/>
          <span style="font-size:12px; color:#111;">${location.placeName}</span><br/>
          <span style="font-size:11px; color:#666;">پۆتان: ${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
        </div>
      `).openPopup();

      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, location]);

  if (!isOpen || !location) return null;

  const cleanName = location.placeName.replace(/(پێشبینی|گومان|شیکاری).*?[:：]/g, '').trim();
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}+(${encodeURIComponent(cleanName || location.placeName)})`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'vx-fade 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#131317',
          border: '1px solid #332f27',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '620px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #252422',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(239, 68, 68, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 10px #ef4444',
              display: 'inline-block',
            }} />
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, margin: 0 }}>
                بازنەی سووری گومانی شارەکە (Visual OSINT)
              </h3>
              <p style={{ color: '#fca5a5', fontSize: '12px', margin: 0, marginTop: '2px' }}>
                شاری گومانلێکراو: <strong>{location.placeName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9e978c',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Map View */}
        <div style={{ position: 'relative', width: '100%', height: '360px', background: '#0a0a0c' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Floating badge inside map */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 500,
              background: 'rgba(19, 19, 23, 0.92)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11.5px',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            <span>بازنەی سوور = چوارچێوەی شاری پێشبینیکراو</span>
          </div>
        </div>

        {/* Footer actions & explanation */}
        <div style={{ padding: '16px 20px', background: '#17171c', borderTop: '1px solid #232220' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#9e978c' }}>
                پۆتان: <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>{location.lat.toFixed(5)}°, {location.lng.toFixed(5)}°</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#656056', marginTop: '2px' }}>
                بڕی دڵنیایی: <span style={{ color: '#e2a545' }}>{location.confidence || 'پێشبینیی وردبینی بینراو'}</span>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#e2a545',
                color: '#111110',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'opacity 0.15s',
              }}
            >
              <ExternalLink size={14} />
              <span>لە Google Maps بیکەرەوە</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
