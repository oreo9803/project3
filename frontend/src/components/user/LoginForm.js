import React from 'react';

function LoginForm() {
  return (
    <form className="login-form">



      <input type="text" placeholder="아이디" />
      <input type="password" placeholder="비밀번호" />
      <button type="submit" className="login-btn">로그인</button>
    </form>
  );
}

export default LoginForm;
