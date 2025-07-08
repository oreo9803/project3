import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function Map() {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const [chargerList, setChargerList] = useState([]);

  // 1. API에서 주차장/충전소 데이터 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:18090/api/charger")
      .then((res) => setChargerList(res.data))
      .catch((err) => console.error("❌ API 호출 실패:", err));
  }, []);

  // 2. 지도, 마커, 클러스터러 렌더링
  useEffect(() => {
    if (!window.Tmapv2 || chargerList.length === 0) return;

    // 1) 이전 클러스터/지도 초기화
    if (clusterRef.current) {
      try { clusterRef.current.destroy?.(); } catch {}
      clusterRef.current = null;
    }
    if (mapDivRef.current) mapDivRef.current.innerHTML = "";

    // 2) 지도 생성 (초기 중심: 천안시청 등)
    const map = new window.Tmapv2.Map(mapDivRef.current, {
      center: new window.Tmapv2.LatLng(36.8189, 127.1555),
      width: "100%",
      height: "500px",
      zoom: 13,
    });
    mapRef.current = map;

    // 3) 마커 + 경계 조정
    const bounds = new window.Tmapv2.LatLngBounds();
    const markers = chargerList.map((item) => {
      const pos = new window.Tmapv2.LatLng(item.parkingLat, item.parkingLon);
      const marker = new window.Tmapv2.Marker({
        position: pos,
        map,
        title: item.parkingName,
      });
      bounds.extend(pos);
      return marker;
    });

    // 4) 클러스터러 적용
    if (window.Tmapv2.extension && window.Tmapv2.extension.MarkerCluster) {
      clusterRef.current = new window.Tmapv2.extension.MarkerCluster({
        markers,
        map,
      });
    }

    // 5) 모든 마커 포함되게 지도 맞춤
    if (!bounds.isEmpty()) map.fitBounds(bounds);

    // cleanup
    return () => {
      clusterRef.current?.destroy?.();
      mapRef.current = null;
    };
  }, [chargerList]);

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
