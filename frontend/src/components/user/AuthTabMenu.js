import React from 'react';
import './AuthTabMenu.css';

function AuthTabMenu(props){
const handleLoginClick =() =>{
props.onTabClick("login");
};

const handleSignupClick =() =>{
props.onTabClick("signup");
};

const handleFindpwClick =()=>{
props.onTabClick("fondpw");
};

return(
<div className="auth-tab-menu">
<button className={props.activeTab ==="login" ? "active" :''} onClick ={handleLoginClick}>로그인</button>

<button className={props.activeTab === "signup" ? 'active' :''}onClick={handleSignupClick}>회원가입</button>

<button className={props.activeTab ==="findpw" ? 'active' :''}onClick={handleFindpwClick}>비밀번호찾기
</button>
</div>
);
}
export default AuthTabMenu;