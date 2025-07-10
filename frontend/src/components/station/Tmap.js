import React, { useEffect, useRef, useState } from 'react';
import '../common/common.css';
import Sidebar from '../common/Sidebar';
import MyLocationButton from '../common/MyLocationButton';
import FilterPanel from './Filterpanel'; // 대소문자 맞춰야 함

const Tmap = () => {
  const [filters, setFilters] = useState({
    type: [],
    parking: [],
    brand: [],
  });

  const mapRef = useRef(null);
  const tmapObjRef = useRef(null);
  const myMarkerRef = useRef(null);

  useEffect(() => {
    if (!window.Tmapv2 || !mapRef.current || tmapObjRef.current) return;

    const map = new window.Tmapv2.Map(mapRef.current, {
      center: new window.Tmapv2.LatLng(37.5665, 126.9780),
      width: '100%',
      height: '100%',
      zoom: 15,
      zoomControl: false,
    });

    tmapObjRef.current = map;
  }, []);

  const handleMyLocation = () => {
    if (!tmapObjRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const myLatLng = new window.Tmapv2.LatLng(lat, lng);

        const map = tmapObjRef.current;
        map.setCenter(myLatLng);
        map.setZoom(16);

        if (myMarkerRef.current) {
          myMarkerRef.current.setMap(null);
        }

        myMarkerRef.current = new window.Tmapv2.Marker({
          position: myLatLng,
          map: map,
          icon: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png"
        });
      },
      (error) => {
        console.error('위치 오류:', error);
        alert('내 위치를 가져올 수 없습니다.');
      }
    );
  };

  return (
    <div className="mapContainer">
      <Sidebar />
      <div ref={mapRef} className="mapDiv" />
      <MyLocationButton onClick={handleMyLocation} />
      <FilterPanel filters={filters} onChange={setFilters} />
    </div>
  );
};

export default Tmap;
