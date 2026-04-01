'use client';

import { useEffect, useRef } from 'react';

export default function VadodaraMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Dynamic import to avoid SSR issues
    const initMap = async () => {
      const L = await import('leaflet');
      
      if (!isMounted || !mapRef.current || mapInstance.current) return;

      // Fix default marker icon paths broken by bundlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Vadodara coordinates
      const VADODARA: [number, number] = [22.3072, 73.1812];

      // Double check initialization and mount status before calling L.map
      if (!isMounted || mapInstance.current) return;


      const map = L.map(mapRef.current!, {
        center: VADODARA,
        zoom: 13,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      // Dark tile layer from CartoDB
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom glowing pulse marker via DivIcon
      const pulseIcon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:24px;height:24px;">
            <div style="
              position:absolute;inset:0;
              border-radius:50%;
              background:rgba(59,130,246,0.25);
              animation:vadodara-ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;
              transform:translate(-50%,-50%);
              width:12px;height:12px;
              border-radius:50%;
              background:linear-gradient(135deg,#60a5fa,#3b82f6);
              box-shadow:0 0 0 2px rgba(59,130,246,0.5),0 0 12px rgba(59,130,246,0.8);
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(VADODARA, { icon: pulseIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'Inter',sans-serif;font-size:12px;color:#e2e8f0;background:#0f172a;border:1px solid rgba(59,130,246,0.3);border-radius:8px;padding:8px 12px;line-height:1.6;">
            <strong style="color:#60a5fa;">📍 Vadodara</strong><br/>
            <span style="color:#94a3b8;">Gujarat, India</span>
          </div>`,
          { className: 'leaflet-vadodara-popup' }
        )
        .openPopup();

      // Zoom controls (custom position)
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      mapInstance.current = map;
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);


  return (
    <>
      {/* Inject keyframe for pulse animation */}
      <style>{`
        @keyframes vadodara-ping {
          0%   { transform: scale(0.8); opacity: 0.9; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .leaflet-vadodara-popup .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          border: 1px solid rgba(59,130,246,0.3) !important;
          border-radius: 10px !important;
          box-shadow: 0 0 24px rgba(59,130,246,0.2) !important;
          padding: 0 !important;
        }
        .leaflet-vadodara-popup .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .leaflet-vadodara-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.5) !important;
          color: rgba(255,255,255,0.3) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: rgba(96,165,250,0.6) !important;
        }
        .leaflet-control-zoom a {
          background: rgba(15,23,42,0.8) !important;
          border-color: rgba(59,130,246,0.2) !important;
          color: rgba(255,255,255,0.6) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(59,130,246,0.2) !important;
          color: #fff !important;
        }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
}
