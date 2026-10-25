import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDistance } from '../../utils/distance';
import { ShieldCheck, Calendar, MapPin } from 'lucide-react';

// Fix Leaflet's default marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom User marker icon
const userIcon = new L.DivIcon({
  className: 'custom-user-marker',
  html: `<div style="
    width: 22px;
    height: 22px;
    background: #0F172A;
    border: 3px solid #FFFFFF;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

// Helper marker icon generator
const createHelperIcon = (skillName, wage) => {
  return new L.DivIcon({
    className: 'custom-helper-marker',
    html: `<div style="
      background: #F97316;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 9999px;
      border: 2px solid #FFFFFF;
      box-shadow: 0 4px 12px rgba(249,115,22,0.4);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 4px;
    ">
      <span>₹${wage}</span>
    </div>`,
    iconSize: [60, 24],
    iconAnchor: [30, 12]
  });
};

export default function HelperMapView() {
  const { searchResults, searchParams, setSelectedHelper, setBookingTargetHelper } = useApp();

  const userCenter = [searchParams.userLat, searchParams.userLng];

  return (
    <div className="field-card overflow-hidden h-[600px] relative border border-slate-200">
      <MapContainer
        center={userCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Search Radius Circle */}
        <Circle
          center={userCenter}
          radius={searchParams.radiusKm * 1000}
          pathOptions={{
            color: '#F97316',
            fillColor: '#F97316',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '6, 6'
          }}
        />

        {/* User Pin */}
        <Marker position={userCenter} icon={userIcon}>
          <Popup>
            <div className="p-1 text-center font-sans">
              <span className="text-xs font-bold text-slate-900 block">Your Current Search Pin</span>
              <span className="text-[11px] text-slate-500">{searchParams.searchLocation}</span>
            </div>
          </Popup>
        </Marker>

        {/* Helper Markers */}
        {searchResults.map((helper) => (
          <Marker
            key={helper.id}
            position={[helper.latitude, helper.longitude]}
            icon={createHelperIcon(helper.skillCategory.name, helper.dailyWage)}
          >
            <Popup>
              <div className="p-2 min-w-[200px] font-sans">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={helper.avatar}
                    alt={helper.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm leading-tight">
                      {helper.name}
                    </h5>
                    <span className="text-xs text-orange-600 font-semibold">
                      {helper.skillCategory.name}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 mb-2.5">
                  <div className="flex justify-between">
                    <span>Quoted Wage:</span>
                    <strong className="text-slate-900">{formatCurrency(helper.dailyWage)}/day</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span>{formatDistance(helper.distanceKm)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <strong className="text-amber-500">★ {helper.averageRating} ({helper.ratingCount})</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedHelper(helper)}
                    className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setBookingTargetHelper(helper)}
                    className="px-2 py-1 rounded bg-orange-500 text-white text-xs font-bold hover:bg-orange-600"
                  >
                    Book
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-lg text-xs font-medium text-slate-700 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white" />
          <span>Your Pin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-white" />
          <span>Helper (₹ Wage/day)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Radius: {searchParams.radiusKm} km</span>
        </div>
      </div>
    </div>
  );
}
