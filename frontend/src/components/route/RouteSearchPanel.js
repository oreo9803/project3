import React from 'react';
import './route.css'; // 필요하면 스타일 분리

const RouteSearchPanel = () => {
  return (
    <div className="route-panel">


      <div className="route-input-start">

        <input type="text" placeholder="출발지를 입력해 주세요" />
      </div>

      <div className="route-input-end">

        <input type="text" placeholder="도착지를 입력해 주세요" />
      </div>

      <button className="search-button">길찾기</button>

      {/* 결과가 있을 경우 아래에 노출 */}
      <div className="route-result-box">

      </div>
    </div>
  );
};

export default RouteSearchPanel;