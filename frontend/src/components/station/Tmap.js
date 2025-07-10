import React, { useEffect, useRef } from 'react';

const Tmap = ({ tmapObjRef }) => {
  const mapRef = useRef(null);

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
  }, [tmapObjRef]);

  return (
    <div className="mapContainer">
      <div ref={mapRef} className="mapDiv" />
    </div>
  );
};

export default Tmap;
