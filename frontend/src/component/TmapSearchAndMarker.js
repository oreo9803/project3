    import React, { useEffect, useRef, useState } from "react";

    const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";

    // 천안시청 위치 고정
    const CHEONAN_LAT = 36.81023;
    const CHEONAN_LON = 127.14644;

    function TmapSearchAndMarker() {
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const [keyword, setKeyword] = useState("");
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);

    useEffect(() => {
        if (!window.Tmapv2) return;
        // 기존 지도 삭제(겹침 방지)
        if (mapDivRef.current) mapDivRef.current.innerHTML = "";

        const map = new window.Tmapv2.Map(mapDivRef.current, {
        center: new window.Tmapv2.LatLng(CHEONAN_LAT, CHEONAN_LON),
        width: "100%",
        height: "400px",
        zoom: 13
        });
        mapRef.current = map;

        return () => {
        if (mapDivRef.current) mapDivRef.current.innerHTML = "";
        mapRef.current = null;
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) {
            infoWindowRef.current.setMap(null);
            infoWindowRef.current = null;
        }
        };
    }, []);

    async function handleSearch(e) {
        e.preventDefault();
        if (!keyword) return;
        // centerLat, centerLon 옵션으로 천안 인근만 검색
        const url = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(
        keyword
        )}&centerLat=${CHEONAN_LAT}&centerLon=${CHEONAN_LON}&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&count=20&appKey=${TMAP_APPKEY}`;
        const res = await fetch(url);
        const data = await res.json();
        const poiList = data?.searchPoiInfo?.pois?.poi ?? [];
        if (poiList.length === 0) {
        alert("검색 결과가 없습니다!");
        return;
        }

        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) {
        infoWindowRef.current.setMap(null);
        infoWindowRef.current = null;
        }

        let bounds = new window.Tmapv2.LatLngBounds();
        poiList.forEach(poi => {
        const lat = parseFloat(poi.frontLat);
        const lon = parseFloat(poi.frontLon);
        if (isNaN(lat) || isNaN(lon)) return;
        const marker = new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(lat, lon),
            map: mapRef.current,
            label: poi.name
        });
        markersRef.current.push(marker);
        bounds.extend(new window.Tmapv2.LatLng(lat, lon));

        marker.addListener("click", function () {
            if (infoWindowRef.current) infoWindowRef.current.setMap(null);
            const address =
            poi.newAddressList?.newAddress?.[0]?.fullAddress ||
            `${poi.upperAddrName} ${poi.middleAddrName} ${poi.lowerAddrName}`;
            const infoWindow = new window.Tmapv2.InfoWindow({
            position: marker.getPosition(),
            content: `<div style="padding:8px;min-width:160px;">
                <b>${poi.name}</b><br/>
                주소: ${address}
            </div>`,
            type: 2,
            map: mapRef.current
            });
            infoWindowRef.current = infoWindow;
        });
        });

        // 모든 마커 보이게 지도 bounds 맞추기
        if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
    }

    return (
        <div>
        <form onSubmit={handleSearch} style={{ marginBottom: 12 }}>
            <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="천안 전기차 충전소 등 검색 (예: 전기차 충전소)"
            style={{ width: 220, padding: 6, fontSize: 15 }}
            />
            <button type="submit" style={{ marginLeft: 8 }}>검색</button>
        </form>
        <div
            ref={mapDivRef}
            style={{
            width: "100%",
            height: "400px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
        />
        </div>
    );
    }

    export default TmapSearchAndMarker;
