import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../logo.png';

const Sidebar = () => {
  return (
    <div className="sidebar">


    <Link to="/">
            <img src={logo} alt="로고" width="100" height="100" />
    </Link>


      <NavLink to="/" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
        <i className="fa-solid fa-location-dot"></i><br />주변충전소
      </NavLink>
      <NavLink to="/route" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
        <i className="fa-solid fa-diamond-turn-right"></i><br />길찾기
      </NavLink>
      <NavLink to="/hotel" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
        <i className="fa-solid fa-hotel"></i><br />충전숙소
      </NavLink>
      <NavLink to="/rank" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
        <i className="fa-solid fa-ranking-star"></i><br />랭킹
      </NavLink>
      <NavLink to="/info" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
        <i className="fa-solid fa-car-side"></i><br />전기차 소개
      </NavLink>
    </div>
  );
};

export default Sidebar;
