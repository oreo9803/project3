import React from "react";
import Map from "./component/Map";

function App() {
  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: 24 }}>
      <h2>전국 전기차 충전소 (서울 지역 1000개)</h2>
      <Map />
    </div>
  );
}

export default App;