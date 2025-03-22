import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { ref, onValue, Query } from 'firebase/database';
import { database } from './config/firebase';
import { Pin, MapPosition } from './types/map';
import Controls from './components/Controls';
import PinForm from './components/PinForm';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 20,
  lng: 0,
};

const markerIcons = {
  landmark: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  food: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  hidden: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
  activity: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  user: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [userLocation, setUserLocation] = useState<MapPosition | null>(null);
  const [showPinForm, setShowPinForm] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<MapPosition | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const pinsRef = ref(database, 'pins');
    const unsubscribe = onValue(pinsRef, (snapshot) => {
      const data = snapshot.val();
      const pinsArray: Pin[] = data ? Object.entries(data).map(([id, pin]) => ({
        id,
        ...(pin as Omit<Pin, 'id'>),
      })) : [];
      setPins(pinsArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
        },
        () => {
          alert('Error: The Geolocation service failed.');
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    setClickedPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
    setShowPinForm(true);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  const filteredPins = filter === 'all' 
    ? pins 
    : pins.filter(pin => pin.category === filter);

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={3}
        center={userLocation || center}
        onClick={handleMapClick}
        options={{ mapTypeId: 'hybrid' }}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={markerIcons.user}
            title="Your Location"
          />
        )}

        {filteredPins.map((pin) => (
          <Marker
            key={pin.id}
            position={{ lat: pin.lat, lng: pin.lng }}
            icon={markerIcons[pin.category]}
            onClick={() => setSelectedPin(pin)}
          />
        ))}

        {selectedPin && (
          <InfoWindow
            position={{ lat: selectedPin.lat, lng: selectedPin.lng }}
            onCloseClick={() => setSelectedPin(null)}
          >
            <div className="p-2">
              <h3 className="text-lg font-bold">{selectedPin.title}</h3>
              <p className="mt-2">{selectedPin.description}</p>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Category:</strong> {selectedPin.category}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Added by:</strong> {selectedPin.userName}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <Controls
        onLocateMe={handleLocateMe}
        onAddPin={() => setShowPinForm(true)}
        onFilterChange={setFilter}
      />

      <PinForm
        isVisible={showPinForm}
        position={clickedPosition}
        onClose={() => {
          setShowPinForm(false);
          setClickedPosition(null);
        }}
      />
    </div>
  );
}

export default App;