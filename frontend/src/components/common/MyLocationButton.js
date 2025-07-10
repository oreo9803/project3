import React from 'react';
import './common.css';

const MyLocationButton = ({ tmapObjRef, myMarkerRef }) => {
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
    <button className="my-location-button" onClick={handleMyLocation}>
      <i className="fa-solid fa-location-crosshairs"></i>
    </button>
  );
};

export default MyLocationButton;
