import React from 'react';
import './common.css'; // 위치는 자유롭게

const MyLocationButton = ({ onClick }) => {
  return (
    <button className="my-location-button" onClick={onClick}>
      <i class="fa-solid fa-location-crosshairs"></i>
    </button>
  );
};

export default MyLocationButton;