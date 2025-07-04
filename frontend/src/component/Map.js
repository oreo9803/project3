    import React, { useEffect, useRef, useState } from "react";

    const SERVICE_KEY = "여기에_발급받은_서비스키_입력"; // ⚠️ 서비스키 입력 필요

    function Map() {
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const clusterRef = useRef(null);
    const [stations, setStations] = useState([]);

    // 📍 1. 충전소 데이터 불러오기 (서울지역 1000개 제한)
    useEffect(() => {
        async function fetchStations() {
        try {
            const url = `https://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=${"YgV1BhJxbWJKaUUVPFk5Ix4ReH2UAlK0kBcxyX%2BqVLJUG0%2FXUnMoxWYg3zAMt6N4rJGdJAHMxjoxd10%2BWwhuow%3D%3D"}&zcode=11&pageNo=1&numOfRows=1000`;
            const res = await fetch(url);
            const text = await res.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, "application/xml");

            const items = Array.from(xml.getElementsByTagName("item"));
            const parsed = items.map((item) => ({
            name: item.getElementsByTagName("statNm")[0]?.textContent ?? "",
            lat: parseFloat(item.getElementsByTagName("lat")[0]?.textContent),
            lon: parseFloat(item.getElementsByTagName("lng")[0]?.textContent),
            addr: item.getElementsByTagName("addr")[0]?.textContent ?? "",
            }));

            const valid = parsed.filter((s) => !isNaN(s.lat) && !isNaN(s.lon));
            setStations(valid);
        } catch (err) {
            console.error("충전소 데이터를 가져오는 중 오류:", err);
        }
        }

        fetchStations();
    }, []);

    // 📍 2. 지도와 마커 클러스터 렌더링
    useEffect(() => {
        if (!window.Tmapv2 || stations.length === 0) return;

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
        const pos = new window.Tmapv2.LatLng(s.lat, s.lon);
        const marker = new window.Tmapv2.Marker({
            position: pos,
            label: s.name,
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