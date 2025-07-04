import React, { useEffect, useRef, useState } from "react";

function Map({ selectedZcode }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const [stations, setStations] = useState([]);

  // 🔹 Spring 서버에서 충전소 데이터 가져오기
  useEffect(() => {
    async function fetchChargers() {
      try {
        console.log("▶️ zcode 요청:", selectedZcode);
        const res = await fetch(`/api/chargers?zcode=${selectedZcode}`);
        if (!res.ok) throw new Error("API 요청 실패");

        const data = await res.json();
        console.log("✅ 가져온 충전소 수:", data.length);
        setStations(data);
      } catch (err) {
        console.error("❌ 충전소 API 호출 실패:", err);
      }
    }

    if (selectedZcode) {
      fetchChargers();
    }
  }, [selectedZcode]);

  // 🔹 지도 및 클러스터 렌더링
  useEffect(() => {
    if (!window.Tmapv2 || stations.length === 0) return;

    // 초기화
    if (clusterRef.current) {
      try {
        clusterRef.current.destroy?.();
      } catch {}
      clusterRef.current = null;
    }

    if (mapRef.current) {
      mapRef.current = null;
    }

    if (mapDivRef.current) {
      mapDivRef.current.innerHTML = "";
    }

    const map = new window.Tmapv2.Map(mapDivRef.current, {
      center: new window.Tmapv2.LatLng(37.5665, 126.9780), // 서울시청
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
