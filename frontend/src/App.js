import React, { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Tmap from './components/station/Tmap';
import './App.css';
import './components/common/common.css';
import Sidebar from './components/common/Sidebar';
import MyLocationButton from './components/common/MyLocationButton';
import FilterPanel from './components/station/Filterpanel';
import RouteSearchPanel from './components/route/RouteSearchPanel';
import IntroCar from './components/intro/IntroCar';

const AppContent = () => {
  const [filters, setFilters] = useState({
    type: [],
    parking: [],
    brand: [],
  });

  const tmapObjRef = useRef(null);
  const myMarkerRef = useRef(null);

  const location = useLocation(); // 현재 경로 확인

  return (
    <div className="container">
      <Sidebar />
      <Tmap tmapObjRef={tmapObjRef} />

      {/* 📌 /info 페이지 아닐 때만 표시 */}
      {location.pathname !== '/info' && (
        <>
          <MyLocationButton tmapObjRef={tmapObjRef} myMarkerRef={myMarkerRef} />
          <FilterPanel filters={filters} onChange={setFilters} />
        </>
      )}

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/route" element={<RouteSearchPanel />} />
        <Route path="/hotel" element={<div>충전숙소 패널</div>} />
        <Route path="/rank" element={<div>랭킹 패널</div>} />
        <Route path="/info" element={<IntroCar />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
