import React, { useEffect, useRef, useState } from "react";

const TMAP_APPKEY = "YgInMIl2n421NwwwG3XOrf0oQSE1paEFRCFbejc0";
const CHEONAN_STATION_LAT = 36.81023;
const CHEONAN_STATION_LON = 127.14644;

const CATEGORY_LABELS = [
  { key: "EV충전소", label: "충전소" },
  { key: "음식점", label: "음식점" },
  { key: "카페", label: "카페" },
  { key: "편의점", label: "편의점" }
];

function CheonanEvMapWithCategories() {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const myLocMarkerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [poiList, setPoiList] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);

  // 중심좌표 상태 (초기: null → 현위치 → 실패시 천안역)
  const [center, setCenter] = useState({ lat: null, lon: null });

  // 카테고리 상태 (초기값 무조건 "EV충전소")
  const [categories, setCategories] = useState("EV충전소");

  // 최초 1회: 현위치 시도 (좌표는 항상 숫자 변환!)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos =>
        setCenter({
          lat: parseFloat(pos.coords.latitude),
          lon: parseFloat(pos.coords.longitude)
        }),
      () =>
        setCenter({
          lat: CHEONAN_STATION_LAT,
          lon: CHEONAN_STATION_LON
        }),
      { timeout: 6000 }
    );
  }, []);

  // 데이터 로딩 (중심좌표/카테고리 바뀔 때마다)
  useEffect(() => {
    if (
      typeof center.lat !== "number" ||
      typeof center.lon !== "number" ||
      isNaN(center.lat) ||
      isNaN(center.lon)
    ) {
      return;
    }

    // categories 기본값 보장
    const categorySafe =
      categories && categories.trim().length > 0 ? categories : "EV충전소";

    async function fetchData() {
      setLoading(true);
      setErrorMsg("");
      setPoiList([]);
      setSelectedPoi(null);

      const encCat = encodeURIComponent(categorySafe);

      // 🔥 여기!! → 엔드포인트 및 파라미터 수정
      let tmapUrl;
      if (categorySafe === "EV충전소") {
        // 충전소는 기존 방식(통합검색)도 동작합니다.
        tmapUrl = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encCat}&centerLat=${center.lat}&centerLon=${center.lon}&radius=5&categories=${encCat}&count=20&appKey=${TMAP_APPKEY}`;
      } else {
        // 음식점, 카페, 편의점 등은 주변검색 API 필수!
        tmapUrl = `https://apis.openapi.sk.com/tmap/pois/search/around?version=1&centerLat=${center.lat}&centerLon=${center.lon}&categories=${encCat}&count=20&radius=5&appKey=${TMAP_APPKEY}`;
      }

      try {
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
  }, [center.lat, center.lon, categories]);

  // 지도 표시 및 마커
  useEffect(() => {
    if (!window.Tmapv2 || loading) return;
    if (
      typeof center.lat !== "number" ||
      typeof center.lon !== "number" ||
      isNaN(center.lat) ||
      isNaN(center.lon)
    )
      return;

    if (mapDivRef.current) mapDivRef.current.innerHTML = "";
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (infoWindowRef.current) infoWindowRef.current.setMap(null);
    if (myLocMarkerRef.current) myLocMarkerRef.current.setMap(null);

    const map = new window.Tmapv2.Map(mapDivRef.current, {
      center: new window.Tmapv2.LatLng(center.lat, center.lon),
      width: "100%",
      height: "500px",
      zoom: 14
    });
    mapRef.current = map;

    // 내 위치 파랑 마커
    myLocMarkerRef.current = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(center.lat, center.lon),
      map,
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      label: "내 위치"
    });

    poiList.forEach((poi, idx) => {
      const lat = parseFloat(poi.frontLat);
      const lon = parseFloat(poi.frontLon);
      if (!lat || !lon) return;

      // 대표 충전기 상태 (충전소면 상태별, 나머진 카테고리별 색)
      let iconUrl;
      if (categories === "EV충전소") {
        const repStatus =
          Array.isArray(poi.evChargers?.evCharger)
            ? poi.evChargers.evCharger[0]?.status
            : poi.evChargers?.evCharger?.status;
        iconUrl = markerIconByStatus(repStatus);
      } else if (categories === "음식점") {
        iconUrl = "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
      } else if (categories === "카페") {
        iconUrl = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
      } else if (categories === "편의점") {
        iconUrl = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      } else {
        iconUrl = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      }

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

    // fit bounds (내위치 포함)
    let bounds = new window.Tmapv2.LatLngBounds();
    bounds.extend(new window.Tmapv2.LatLng(center.lat, center.lon));
    poiList.forEach(poi => {
      if (poi.frontLat && poi.frontLon)
        bounds.extend(new window.Tmapv2.LatLng(poi.frontLat, poi.frontLon));
    });
    if (!bounds.isEmpty()) map.fitBounds(bounds);

    return () => {
      if (mapDivRef.current) mapDivRef.current.innerHTML = "";
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) infoWindowRef.current.setMap(null);
      if (myLocMarkerRef.current) myLocMarkerRef.current.setMap(null);
    };
  }, [poiList, loading, center.lat, center.lon, categories]);

  // 내 위치로 이동 버튼
  function moveToMyLocation() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCenter({
          lat: parseFloat(pos.coords.latitude),
          lon: parseFloat(pos.coords.longitude)
        });
        if (mapRef.current) {
          mapRef.current.setCenter(
            new window.Tmapv2.LatLng(
              parseFloat(pos.coords.latitude),
              parseFloat(pos.coords.longitude)
            )
          );
        }
      },
      () => alert("위치 정보를 가져올 수 없습니다."),
      { timeout: 6000 }
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <h3>
        <span style={{ color: "#1ba72d", fontWeight: 400 }}>현위치 기준</span>{" "}
        {CATEGORY_LABELS.find(btn => btn.key === categories)?.label} 주변
      </h3>
      {/* 카테고리 버튼들 */}
      <div style={{ margin: "8px 0 16px 0" }}>
        {CATEGORY_LABELS.map(btn => (
          <button
            key={btn.key}
            onClick={() => setCategories(btn.key)}
            style={{
              marginRight: 12,
              padding: "7px 18px",
              borderRadius: 20,
              border: "1px solid #ddd",
              background: categories === btn.key ? "#2D95FF" : "#fff",
              color: categories === btn.key ? "#fff" : "#222",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div
        ref={mapDivRef}
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.13)"
        }}
      />
      {/* 내위치 버튼 */}
      <button
        onClick={moveToMyLocation}
        style={{
          position: "absolute",
          right: 28,
          top: 42,
          zIndex: 2,
          border: "none",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 6px rgba(0,0,0,.13)",
          width: 44,
          height: 44,
          cursor: "pointer"
        }}
        title="내 위치로 이동"
      >
        <svg width={24} height={24} fill="#318CFE" style={{ marginTop: 2 }}>
          <circle
            cx={12}
            cy={12}
            r={9}
            stroke="#318CFE"
            strokeWidth="2"
            fill="#fff"
          />
          <circle cx={12} cy={12} r={4} fill="#318CFE" />
        </svg>
      </button>
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

      <div
        style={{
          margin: "30px 0 0 0",
          background: "#fafcff",
          border: "1px solid #e1e6ea",
          borderRadius: 12,
          padding: 22,
          minHeight: 100
        }}
      >
        {selectedPoi ? (
          <PoiDetail poi={selectedPoi} category={categories} />
        ) : (
          <span style={{ color: "#888" }}>
            마커를 클릭하면 상세정보가 표시됩니다.
          </span>
        )}
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
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    case "3":
      return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    case "9":
      return "http://maps.google.com/mapfiles/ms/icons/grey-dot.png";
    case "2":
    case "6":
    case "0":
    default:
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
  }
}

// 상세 정보 패널
function PoiDetail({ poi, category }) {
  const evChargers = poi.evChargers?.evCharger;
  const fullAddress =
    poi.newAddressList?.newAddress?.[0]?.fullAddress ||
    [poi.upperAddrName, poi.middleAddrName, poi.lowerAddrName, poi.detailAddrName]
      .filter(Boolean)
      .join(" ");

  return (
    <div>
      <h4 style={{ margin: 0, color: "#1a4668" }}>{poi.name}</h4>
      <div style={{ margin: "6px 0 12px 0", color: "#666" }}>
        <b>주소:</b> {fullAddress}
      </div>
      {poi.buildingName && (
        <div>
          <b>건물명:</b> {poi.buildingName}
        </div>
      )}
      {poi.telNo && (
        <div>
          <b>전화번호:</b> {poi.telNo}
        </div>
      )}
      <div>
        <b>업종:</b> {poi.upperBizName ?? ""} {poi.middleBizName ?? ""}{" "}
        {poi.lowerBizName ?? ""} {poi.detailBizName ?? ""}
      </div>
      {poi.desc && (
        <div style={{ margin: "6px 0 10px 0", fontSize: 14, color: "#444" }}>
          <b>소개:</b> {poi.desc}
        </div>
      )}

      <div style={{ margin: "8px 0" }}>
        <b>POI ID:</b> {poi.id}
        {poi.rpFlag && (
          <span style={{ marginLeft: 12 }}>
            <b>RP_FLAG:</b> {poi.rpFlag}
          </span>
        )}
      </div>

      {/* EV충전소일 때만 상세 충전기 정보 표 */}
      {category === "EV충전소" && evChargers && (
        <div style={{ marginTop: 16 }}>
          <b>
            ⚡ 충전기 상세 (
            {Array.isArray(evChargers) ? evChargers.length : 1}대)
          </b>
          <table
            style={{
              borderCollapse: "collapse",
              marginTop: 5,
              width: "100%"
            }}
          >
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
              {(Array.isArray(evChargers) ? evChargers : [evChargers]).map(
                (ch, i) => (
                  <tr key={ch.chargerId || i} style={{ fontSize: 13 }}>
                    <td>{ch.operatorName}</td>
                    <td>{ch.chargerId}</td>
                    <td>{chargerTypeToKor(ch.type)}</td>
                    <td>{ch.isFast === "Y" ? "O" : "-"}</td>
                    <td
                      style={{
                        color: chargerStatusColor(ch.status),
                        fontWeight: 600
                      }}
                    >
                      {chargerStatusToKor(ch.status)}
                    </td>
                    <td>{ch.powerType}</td>
                    <td>{formatDateTime(ch.chargingDateTime)}</td>
                  </tr>
                )
              )}
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
  return dt.replace(
    /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
    "$1-$2-$3 $4:$5:$6"
  );
}

export default CheonanEvMapWithCategories;
