//import React from "react";
//import Map from "./component/Map";
//
//function App() {
//  return (
//    <div style={{ maxWidth: 1200, margin: "40px auto", padding: 24 }}>
//      <h2>전국 전기차 충전소 (천안지역)</h2>
//      <Map />
//    </div>
//  );
//}
//
//export default App;

// import React, { useState } from "react";
// import Map from "./components/Map";

// function App() {
//   const [mode, setMode] = useState("all");
//   return (
//     <div style={{ maxWidth: 1200, margin: "40px auto", padding: 24 }}>
//       <h2>🚗 서울 전기차 충전소 & 주차장 매칭 지도</h2>
//       <button onClick={() => setMode("all")}>모든 충전소</button>
//       <button onClick={() => setMode("parking")}>충전소 있는 주차장</button>
//       <Map mode={mode} />
//     </div>
//   );
// }
// export default App;

// import React from "react";
// import TmapMarkerDemo from "./components/TmapMarkerDemo";

// function App() {
//   return (
//     <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
//       <h2>🗺️ Tmap 마커 클릭 이벤트 예제</h2>
//       <TmapMarkerDemo />
//     </div>
//   );
// }

// export default App;

// import React from "react";
// import TmapSearchAndMarker from "./components/TmapSearchAndMarker";

// function App() {
//   return (
//     <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
//       <h2>🔍 Tmap 장소 검색 & 여러 마커 예제</h2>
//       <TmapSearchAndMarker />
//     </div>
//   );
// }

// export default App;

import CheonanEvCompareMap from "./components/CheonanEvCompareMap";
function App() {
  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:24}}>
      <CheonanEvCompareMap />
    </div>
  );
}

export default App;