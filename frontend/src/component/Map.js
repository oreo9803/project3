import React, { useEffect, useRef, useState } from "react";

function Map({ selectedZcode }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const [stations, setStations] = useState([]);

  // 🔹 Spring 서버로부터 충전소 데이터를 가져옴
  useEffect(() => {
    async function fetchChargers() {
      try {
        const res = await fetch(`/api/chargers?zcode=${selectedZcode}`);
        const data = await res.json();
        setStations(data);
      } catch (err) {
        console.error("충전소 API 호출 실패:", err);
      }
    }

    if (selectedZcode) {
      fetchChargers();
    }
  }, [selectedZcode]);

  // 🔹 지도 렌더링 (기존 코드 그대로)
  useEffect(() => {
    if (!window.Tmapv2 || stations.length === 0) return;

    if (clusterRef.current) clusterRef.current.destroy?.();
    clusterRef.current = null;
    mapRef.current = null;
    mapDivRef.current.innerHTML = "";

    const map = new window.Tmapv2.Map(mapDivRef.current, {
      center: new window.Tmapv2.LatLng(37.5665, 126.9780),
      width: "100%",
      height: "500px",
      zoom: 12,
    });

    mapRef.current = map;
    const bounds = new window.Tmapv2.LatLngBounds();

    const markers = stations.map((s) => {
      const pos = new window.Tmapv2.LatLng(s.lat, s.lng);
      const marker = new window.Tmapv2.Marker({
        position: pos,
        label: s.statNm,
        map,
      });
      bounds.extend(pos);
      return marker;
    });

    clusterRef.current = new window.Tmapv2.extension.MarkerCluster({
      markers,
      map,
    });

    map.fitBounds(bounds);

    return () => {
      clusterRef.current?.destroy?.();
      mapRef.current = null;
    };
  }, [stations]);

  return (
    <div
      ref={mapDivRef}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    />
  );
}

export default Map;
