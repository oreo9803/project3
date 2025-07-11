    import React, { useEffect, useRef, useState } from "react";

    const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";
    const CHEONAN_STATION_LAT = 36.81023;
    const CHEONAN_STATION_LON = 127.14644;

    function CheonanEvMapTmapOnly() {
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [poiList, setPoiList] = useState([]);
    const [selectedPoi, setSelectedPoi] = useState(null);

    // 데이터 로딩
    useEffect(() => {
        async function fetchData() {
        setLoading(true);
        setErrorMsg("");
        setPoiList([]);
        setSelectedPoi(null);

        try {
            const tmapUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent("전기차 충전소")}&centerLat=${CHEONAN_STATION_LAT}&centerLon=${CHEONAN_STATION_LON}&radius=5&count=20&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&appKey=${TMAP_APPKEY}`;
            const res = await fetch(tmapUrl);
            if (!res.ok) throw new Error("Tmap API 오류: " + res.status);
            const data = await res.json();
            const pois = data?.searchPoiInfo?.pois?.poi ?? [];
            setPoiList(pois);
        } catch (e) {
            setErrorMsg("Tmap API 오류: " + e.message);
        }
        setLoading(false);
        }
        fetchData();
    }, []);

    // 지도 표시 및 마커
    useEffect(() => {
        if (!window.Tmapv2 || loading) return;
        if (mapDivRef.current) mapDivRef.current.innerHTML = "";
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) infoWindowRef.current.setMap(null);

        const map = new window.Tmapv2.Map(mapDivRef.current, {
        center: new window.Tmapv2.LatLng(CHEONAN_STATION_LAT, CHEONAN_STATION_LON),
        width: "100%",
        height: "500px",
        zoom: 14
        });
        mapRef.current = map;

        poiList.forEach((poi, idx) => {
        const lat = parseFloat(poi.frontLat);
        const lon = parseFloat(poi.frontLon);
        if (!lat || !lon) return;

        // 대표 충전기 상태 (여러 개면 첫번째, 없으면 null)
        const repStatus =
            Array.isArray(poi.evChargers?.evCharger) ? poi.evChargers.evCharger[0]?.status :
            poi.evChargers?.evCharger?.status;
        const iconUrl = markerIconByStatus(repStatus);

        const marker = new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(lat, lon),
            map,
            icon: iconUrl,
            label: poi.name
        });
        markersRef.current.push(marker);

        marker.addListener("click", function () {
            setSelectedPoi(poi);
            if (infoWindowRef.current) infoWindowRef.current.setMap(null);
            infoWindowRef.current = new window.Tmapv2.InfoWindow({
            position: marker.getPosition(),
            content: `
                <div style="padding:6px 10px;min-width:160px;">
                <b>${poi.name}</b><br/>
                <span style="font-size:13px;color:gray">${poi.upperAddrName ?? ""} ${poi.middleAddrName ?? ""} ${poi.lowerAddrName ?? ""}</span>
                </div>
            `,
            type: 2,
            map
            });
        });
        });

        // fit bounds
        let bounds = new window.Tmapv2.LatLngBounds();
        poiList.forEach(poi => {
        if (poi.frontLat && poi.frontLon) bounds.extend(new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon));
        });
        if (!bounds.isEmpty()) map.fitBounds(bounds);

        return () => {
        if (mapDivRef.current) mapDivRef.current.innerHTML = "";
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) infoWindowRef.current.setMap(null);
        };
    }, [poiList, loading]);

    return (
        <div>
        <h3>천안역 기준 전기차 충전소 20곳 (Tmap 데이터)</h3>
        <div
            ref={mapDivRef}
            style={{
            width: "100%",
            height: "500px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.13)"
            }}
        />
        {loading && <div style={{ marginTop: 12 }}>데이터 불러오는 중...</div>}
        {errorMsg && (
            <div style={{ color: "red", marginTop: 16 }}>
            <b>API 오류:</b> {errorMsg}
            </div>
        )}

        <div style={{ margin: "24px 0 0 0" }}>
            <ol style={{ paddingLeft: 24 }}>
            {poiList.map((poi, i) => (
                <li
                key={poi.id + poi.name}
                style={{
                    marginBottom: 10,
                    cursor: "pointer",
                    color: selectedPoi === poi ? "#0076ff" : "#222"
                }}
                onClick={() => setSelectedPoi(poi)}
                >
                <b>{poi.name}</b>
                <span style={{ color: "#666", fontSize: 14, marginLeft: 7 }}>
                    {poi.newAddressList?.newAddress?.[0]?.fullAddress ||
                    `${poi.upperAddrName ?? ""} ${poi.middleAddrName ?? ""} ${poi.lowerAddrName ?? ""} ${poi.detailAddrName ?? ""}`}
                </span>
                </li>
            ))}
            </ol>
        </div>

        <div style={{
            margin: "30px 0 0 0",
            background: "#fafcff",
            border: "1px solid #e1e6ea",
            borderRadius: 12,
            padding: 22,
            minHeight: 100
        }}>
            {selectedPoi ? <PoiDetail poi={selectedPoi} /> : <span style={{ color: "#888" }}>충전소를 클릭하면 상세정보가 표시됩니다.</span>}
        </div>
        </div>
    );
    }

    // 마커 색상 함수(상태별)
    function markerIconByStatus(status) {
    switch (status) {
        case "1":
        case "4":
        case "5":
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png"; // 고장/운영중지/점검/통신이상
        case "3":
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"; // 충전중
        case "9":
        return "http://maps.google.com/mapfiles/ms/icons/grey-dot.png"; // 상태미확인
        case "2":
        case "6":
        case "0":
        default:
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; // 대기/예약/알수없음/기타
    }
    }

    // 상세 정보 패널
    function PoiDetail({ poi }) {
    // 충전기 리스트 (있으면)
    const evChargers = poi.evChargers?.evCharger;
    const fullAddress = poi.newAddressList?.newAddress?.[0]?.fullAddress
        || [poi.upperAddrName, poi.middleAddrName, poi.lowerAddrName, poi.detailAddrName].filter(Boolean).join(" ");

    return (
        <div>
        <h4 style={{ margin: 0, color: "#1a4668" }}>{poi.name}</h4>
        <div style={{ margin: "6px 0 12px 0", color: "#666" }}>
            <b>주소:</b> {fullAddress}
        </div>
        {poi.buildingName && <div><b>건물명:</b> {poi.buildingName}</div>}
        {poi.telNo && <div><b>전화번호:</b> {poi.telNo}</div>}
        <div>
            <b>업종:</b> {poi.upperBizName ?? ""} {poi.middleBizName ?? ""} {poi.lowerBizName ?? ""} {poi.detailBizName ?? ""}
        </div>
        {poi.desc && <div style={{ margin: "6px 0 10px 0", fontSize: 14, color: "#444" }}>
            <b>소개:</b> {poi.desc}
        </div>}

        <div style={{ margin: "8px 0" }}>
            <b>POI ID:</b> {poi.id}
            {poi.rpFlag && <span style={{ marginLeft: 12 }}><b>RP_FLAG:</b> {poi.rpFlag}</span>}
        </div>

        {/* evChargers 상세 */}
        {evChargers && (
            <div style={{ marginTop: 16 }}>
            <b>⚡ 충전기 상세 ({Array.isArray(evChargers) ? evChargers.length : 1}대)</b>
            <table style={{ borderCollapse: "collapse", marginTop: 5, width: "100%" }}>
                <thead>
                <tr style={{ background: "#eaf2f8", fontSize: 13 }}>
                    <th>업체명</th>
                    <th>충전기ID</th>
                    <th>타입</th>
                    <th>급속</th>
                    <th>상태</th>
                    <th>출력</th>
                    <th>마지막충전</th>
                </tr>
                </thead>
                <tbody>
                {(Array.isArray(evChargers) ? evChargers : [evChargers]).map((ch, i) => (
                    <tr key={ch.chargerId || i} style={{ fontSize: 13 }}>
                    <td>{ch.operatorName}</td>
                    <td>{ch.chargerId}</td>
                    <td>{chargerTypeToKor(ch.type)}</td>
                    <td>{ch.isFast === "Y" ? "O" : "-"}</td>
                    {/* 상태: 컬러적용 */}
                    <td style={{ color: chargerStatusColor(ch.status), fontWeight: 600 }}>
                        {chargerStatusToKor(ch.status)}
                    </td>
                    <td>{ch.powerType}</td>
                    <td>{formatDateTime(ch.chargingDateTime)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
    }

    // 상태 한글 변환
    function chargerStatusToKor(status) {
    const map = {
        "0": "알수없음",
        "1": "통신이상",
        "2": "충전대기",
        "3": "충전중",
        "4": "운영중지",
        "5": "점검중",
        "6": "예약중",
        "9": "상태미확인"
    };
    return map[status] || status;
    }

    // 상태별 컬러 반환
    function chargerStatusColor(status) {
    switch (status) {
        case "1":
        case "4":
        case "5":
        return "#e34040"; // 빨강
        case "3":
        return "#377ee6"; // 파랑
        case "9":
        return "#8e8e8e"; // 회색
        case "2":
        case "6":
        case "0":
        default:
        return "#1ba72d"; // 초록
    }
    }

    function chargerTypeToKor(type) {
    const map = {
        "01": "DC차데모",
        "02": "AC완속",
        "03": "DC차데모+AC3상",
        "04": "DC콤보",
        "05": "DC차데모+DC콤보",
        "06": "DC차데모+AC3상+DC콤보",
        "07": "AC급속3상"
    };
    return map[type] || type;
    }

    function formatDateTime(dt) {
    if (!dt) return "";
    return dt.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3 $4:$5:$6");
    }

    export default CheonanEvMapTmapOnly;
