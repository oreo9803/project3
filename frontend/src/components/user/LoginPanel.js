import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import JoinForm from './JoinForm';
import FindPasswordForm from './FindPasswordForm';
import './user.css';

function LoginPanel() {
  const tabs = [
    { label: '로그인', path: '/login' },
    { label: '회원가입', path: '/login/register' },
    { label: '비밀번호 찾기', path: '/login/findpw' },
  ];

  return (
    <div className='login-container'>
      <h1 className="h2">회원</h1>
      <div className='login-tab'>
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end    // 이게 있어야 /login 에서 '로그인'만 active
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      {/* ▼▼▼ 네모 박스(폼 영역) ▼▼▼ */}
      <div className="login-form-box">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="register" element={<JoinForm />} />
          <Route path="findpw" element={<FindPasswordForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default LoginPanel;
