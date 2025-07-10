import React from 'react';
import logo from '../logo.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
     <a href="#"><img src={logo} alt="로고" width="100" height="100" /></a>
      <a href="#"><i className="fa-solid fa-location-dot"></i> <br />주변충전소</a>
      <a href="#"><i class="fa-solid fa-diamond-turn-right"></i> <br />길찾기</a>
      <a href="#"><i class="fa-solid fa-hotel"></i><br />충전숙소</a>
      <a href="#"><i class="fa-solid fa-ranking-star"></i> <br />랭킹</a>
      <a href="#"><i class="fa-solid fa-car-side"></i> <br />전기차 소개</a>
    </div>
  );
};

export default Sidebar;