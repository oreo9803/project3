    import React, { useEffect, useRef } from "react";

    function TmapMarkerDemo() {
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const infoWindowRef = useRef(null);

    useEffect(() => {
        if (!window.Tmapv2) return;

        // 1. 지도 생성
        const map = new window.Tmapv2.Map(mapDivRef.current, {
        center: new window.Tmapv2.LatLng(36.8151, 127.1139), // 천안시청
        width: "100%",
        height: "400px",
        zoom: 14
        });
        mapRef.current = map;

        // 2. 마커 생성
        const marker = new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(36.8151, 127.1139),
        map,
        label: "클릭해보세요!"
        });
        markerRef.current = marker;

        // 3. 마커 클릭 이벤트
        marker.addListener("click", function () {
        // 이미 열린 InfoWindow 닫기
        if (infoWindowRef.current) {
            infoWindowRef.current.setMap(null);
        }
        // InfoWindow(팝업) 생성
        const infoWindow = new window.Tmapv2.InfoWindow({
            position: marker.getPosition(),
            content: "<div style='padding:10px;min-width:140px;'>마커를 클릭했습니다!</div>",
            type: 2, // 클릭 시만 표시
            map: map
        });
        infoWindowRef.current = infoWindow;

        // 또는 alert("마커 클릭!")으로도 가능
        });

        // 정리(cleanup)
        return () => {
        marker.setMap(null);
        if (infoWindowRef.current) {
            infoWindowRef.current.setMap(null);
        }
        mapRef.current = null;
        };
    }, []);

    return (
        <div
        ref={mapDivRef}
        style={{
            width: "100%",
            height: "400px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
        />
    );
    }

    export default TmapMarkerDemo;
