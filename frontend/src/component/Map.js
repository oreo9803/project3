import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

// (1) 두 지점 간 거리(미터) 구하는 함수
function getDistance(lon1, lat1, lon2, lat2) {
  const earthRadiusMeters = 6371e3; // 지구 반지름(미터)
  const toRadians = degrees => degrees * Math.PI / 180;
  const latitude1Rad = toRadians(lat1);
  const latitude2Rad = toRadians(lat2);
  const deltaLatitude = toRadians(lat2 - lat1);
  const deltaLongitude = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitude1Rad) * Math.cos(latitude2Rad) *
    Math.sin(deltaLongitude / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusMeters * c;
  return distance; // 미터
}

function OnlyChargerParkingMap() {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [parkings, setParkings] = useState([]); // 주차장
  const [stations, setStations] = useState([]); // 충전소

  // (2) 주차장 데이터 (DB에서)
  useEffect(() => {
    axios.get("http://localhost:18090/api/charger")
      .then(res => setParkings(res.data))
      .catch(err => console.error("❌ 주차장 API 오류:", err));
  }, []);

  // (3) 충전소 데이터 (공공데이터 API에서, 천안만 필터)
  useEffect(() => {
    async function fetchStations() {
      try {
        const url = `https://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=YgV1BhJxbWJKaUUVPFk5Ix4ReH2UAlK0kBcxyX%2BqVLJUG0%2FXUnMoxWYg3zAMt6N4rJGdJAHMxjoxd10%2BWwhuow%3D%3D&zcode=44&pageNo=1&numOfRows=1000`;
        const res = await fetch(url);
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        const items = Array.from(xml.getElementsByTagName("item"));
        const parsed = items.map(item => ({
          name: item.getElementsByTagName("statNm")[0]?.textContent ?? "",
          lat: parseFloat(item.getElementsByTagName("lat")[0]?.textContent),
          lon: parseFloat(item.getElementsByTagName("lng")[0]?.textContent),
          addr: item.getElementsByTagName("addr")[0]?.textContent ?? "",
        }));
        // 천안시 데이터만 필터
        const valid = parsed.filter(s => !isNaN(s.lat) && !isNaN(s.lon) && s.addr.includes("천안"));
        setStations(valid);
      } catch (err) {
        console.error("❌ 충전소 API 오류:", err);
      }
    }
    fetchStations();
  }, []);

  // (4) 충전소가 오차범위(50m) 내에 있는 주차장만 필터링
  const chargerParkings = useMemo(() => {
    return parkings.filter(parking =>
      stations.some(station =>
        getDistance(parking.parkingLon, parking.parkingLat, station.lon, station.lat) < 50
      )
    );
  }, [parkings, stations]);

  // (5) 지도 & 마커 렌더링
  useEffect(() => {
    if (!window.Tmapv2 || chargerParkings.length === 0) return;

    if (clusterRef.current) {
      try { clusterRef.current.destroy?.(); } catch {}
      clusterRef.current = null;
    }
    if (mapRef.current) mapRef.current = null;
    if (mapDivRef.current) mapDivRef.current.innerHTML = "";
    if (infoWindowRef.current) {
      infoWindowRef.current.setMap(null);
      infoWindowRef.current = null;
    }

    const map = new window.Tmapv2.Map(mapDivRef.current, {
      center: new window.Tmapv2.LatLng(36.8151, 127.1139), // 천안시청 기준
      width: "100%",
      height: "500px",
      zoom: 12,
    });
    mapRef.current = map;

    const bounds = new window.Tmapv2.LatLngBounds();
    const markers = chargerParkings.map((parking) => {
      const pos = new window.Tmapv2.LatLng(parking.parkingLat, parking.parkingLon);
      const marker = new window.Tmapv2.Marker({
        position: pos,
        map,
        label: parking.parkingName,
      });
      bounds.extend(pos);

      // 클릭 시 InfoWindow로 상세정보(무료/유료 등) 표시
      marker.addListener("click", function () {
        if (infoWindowRef.current) {
          infoWindowRef.current.setMap(null);
        }
        const content = `
          <div style="padding:8px;min-width:170px;">
            <b>${parking.parkingName}</b><br/>
            주소: ${parking.parkingAddress ?? ""} <br/>
            <span style="color:${parking.parkingFee === "무료" ? "green" : "red"}">
              ${parking.parkingFee ?? ""}
            </span>
          </div>
        `;
        const infoWindow = new window.Tmapv2.InfoWindow({
          position: pos,
          content: content,
          type: 2,
          map: map,
        });
        infoWindowRef.current = infoWindow;
      });

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
      if (infoWindowRef.current) {
        infoWindowRef.current.setMap(null);
        infoWindowRef.current = null;
      }
    };
  }, [chargerParkings]);

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

export default OnlyChargerParkingMap;
