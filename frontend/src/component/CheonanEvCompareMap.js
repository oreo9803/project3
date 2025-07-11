    import React, { useEffect, useRef, useState } from "react";

    // 네가 실제 사용하는 키값 그대로!
    const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";

    const PUBLIC_API_KEY = "YgV1BhJxbWJKaUUVPFk5Ix4ReH2UAlK0kBcxyX%2BqVLJUG0%2FXUnMoxWYg3zAMt6N4rJGdJAHMxjoxd10%2BWwhuow%3D%3D";

    // 천안역 좌표 기준
    const CHEONAN_STATION_LAT = 36.81023;
    const CHEONAN_STATION_LON = 127.14644;

    // 오차 20m 이내면 동일 장소로 간주
    function isSameLocation(a, b) {
    return (
        Math.abs(a.lat - b.lat) < 0.0002 &&
        Math.abs(a.lon - b.lon) < 0.0002
    );
    }

    function CheonanEvCompareMap() {
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const [loading, setLoading] = useState(false);

    // 전체 데이터 보관
    const [publicList, setPublicList] = useState([]); // 환경부 충전소
    const [tmapList, setTmapList] = useState([]);     // Tmap POI

    // 1. 두 API 데이터 모두 받아오기
    useEffect(() => {
        async function fetchData() {
        setLoading(true);

        // (1) 공공데이터포털(환경부) EV 충전소 - 천안역 인근(5km)
        // 공공 API는 XML 반환, JS에서 파싱 필요
        const pubUrl = `https://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=${PUBLIC_API_KEY}&pageNo=1&numOfRows=1000&zcode=34110`;
        const res1 = await fetch(pubUrl);
        const text1 = await res1.text();
        const xml = new window.DOMParser().parseFromString(text1, "application/xml");
        const items = Array.from(xml.getElementsByTagName("item"));
        // 파싱 후 좌표 5km 이내만 필터링
        const pubArr = items.map(item => {
            const lat = parseFloat(item.getElementsByTagName("lat")[0]?.textContent);
            const lon = parseFloat(item.getElementsByTagName("lng")[0]?.textContent);
            const dist = getDistanceKm(CHEONAN_STATION_LAT, CHEONAN_STATION_LON, lat, lon);
            return {
            name: item.getElementsByTagName("statNm")[0]?.textContent ?? "",
            address: item.getElementsByTagName("addr")[0]?.textContent ?? "",
            lat, lon,
            dist
            };
        }).filter(x => x.lat && x.lon && x.dist < 5); // 천안역 반경 5km

        setPublicList(pubArr);

        // (2) Tmap POI 검색 "전기차 충전소" - 천안역 인근
        const tmapUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(
            "전기차 충전소"
        )}&centerLat=${CHEONAN_STATION_LAT}&centerLon=${CHEONAN_STATION_LON}&radius=5000&count=30&resCoordType=WGS84GEO&reqCoordType=WGS84GEO`;

        const res2 = await fetch(tmapUrl, {
        headers: {
            "appKey": "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0"


        }
        });
        const data2 = await res2.json();
        const poiList = data2?.searchPoiInfo?.pois?.poi ?? [];
        const tmapArr = poiList.map(poi => ({
            name: poi.name,
            address:
            poi.newAddressList?.newAddress?.[0]?.fullAddress ||
            `${poi.upperAddrName} ${poi.middleAddrName} ${poi.lowerAddrName}`,
            lat: parseFloat(poi.frontLat),
            lon: parseFloat(poi.frontLon)
        })).filter(x => x.lat && x.lon);

        setTmapList(tmapArr);
        setLoading(false);

        }

        fetchData();
    }, []);

    // 2. 지도 초기화 + 마커
    useEffect(() => {
        if (!window.Tmapv2 || loading) return;
        if (mapDivRef.current) mapDivRef.current.innerHTML = "";
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) infoWindowRef.current.setMap(null);

        // 지도 생성
        const map = new window.Tmapv2.Map(mapDivRef.current, {
        center: new window.Tmapv2.LatLng(CHEONAN_STATION_LAT, CHEONAN_STATION_LON),
        width: "100%",
        height: "500px",
        zoom: 13
        });
        mapRef.current = map;

        // (1) 매칭/분류
        const matched = [];
        const onlyPublic = [];
        const onlyTmap = [];

        publicList.forEach(pub => {
        const twin = tmapList.find(tm => isSameLocation(pub, tm));
        if (twin) {
            matched.push({ ...pub, ...twin });
        } else {
            onlyPublic.push(pub);
        }
        });
        tmapList.forEach(tm => {
        if (!publicList.find(pub => isSameLocation(pub, tm))) {
            onlyTmap.push(tm);
        }
        });

        // (2) 지도 마커 생성 (색상/아이콘 구분)
        matched.forEach((item, idx) => {
        makeMarker(item, "green", "공공+Tmap", map, markersRef, infoWindowRef);
        });
        onlyPublic.forEach(item => {
        makeMarker(item, "blue", "공공데이터 전용", map, markersRef, infoWindowRef);
        });
        onlyTmap.forEach(item => {
        makeMarker(item, "orange", "Tmap 전용", map, markersRef, infoWindowRef);
        });

        // 모든 마커 포함하게 지도 bounds
        let bounds = new window.Tmapv2.LatLngBounds();
        [...matched, ...onlyPublic, ...onlyTmap].forEach(item => {
        if (item.lat && item.lon) {
            bounds.extend(new window.Tmapv2.LatLng(item.lat, item.lon));
        }
        });
        if (!bounds.isEmpty()) map.fitBounds(bounds);

        // cleanup
        return () => {
        if (mapDivRef.current) mapDivRef.current.innerHTML = "";
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) infoWindowRef.current.setMap(null);
        };
        // eslint-disable-next-line
    }, [publicList, tmapList, loading]);

    return (
        <div>
        <h3>천안역 기준 전기차 충전소 비교 (공공데이터 vs Tmap)</h3>
        <div
            ref={mapDivRef}
            style={{
            width: "100%",
            height: "500px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.13)"
            }}
        />
        {loading && <div style={{marginTop:12}}>데이터 불러오는 중...</div>}
        <Legend />
        </div>
    );
    }

    // 마커 만들기(색상, InfoWindow 구분)
    function makeMarker(item, color, label, map, markersRef, infoWindowRef) {
    // 마커 아이콘 색상 바꾸기
    let icon = "";
    if (color === "green") {
        icon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    } else if (color === "blue") {
        icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    } else if (color === "orange") {
        icon = "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
    }
    const marker = new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(item.lat, item.lon),
        map,
        icon,
        label: item.name
    });
    markersRef.current.push(marker);

    marker.addListener("click", function () {
        if (infoWindowRef.current) infoWindowRef.current.setMap(null);
        const infoWindow = new window.Tmapv2.InfoWindow({
        position: marker.getPosition(),
        content: `
            <div style="padding:8px;min-width:180px;">
            <b>${item.name}</b><br/>
            <span style="font-size:13px;color:gray">${item.address}</span><br/>
            <span style="font-weight:bold;color:${color}">${label}</span>
            </div>
        `,
        type: 2,
        map
        });
        infoWindowRef.current = infoWindow;
    });
    }

    // 하버사인(거리계산, km)
    function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
    }

    // 범례(마커 색상 안내)
    function Legend() {
    return (
        <div style={{ marginTop: 18, marginBottom: 14, fontSize: 15 }}>
        <span style={{display:'inline-block',marginRight:24}}>
            <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" alt="" /> <b>공공+Tmap 모두</b>
        </span>
        <span style={{display:'inline-block',marginRight:24}}>
            <img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="" /> <b>공공데이터 전용</b>
        </span>
        <span style={{display:'inline-block',marginRight:24}}>
            <img src="http://maps.google.com/mapfiles/ms/icons/orange-dot.png" alt="" /> <b>Tmap 전용</b>
        </span>
        </div>
    );
    }

    export default CheonanEvCompareMap;
