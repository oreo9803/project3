import react from 'react';
import './LoginForm.css';

function LoginForm(){

return (
<div className='login-container'>
<h2>로그인</h2>
<form>
<input type="email" placeholder="이메일을 입력하세요" />
<input type="password" placeholder="비밀번호를 입력하세요" />
<button type ="submit">로그인</button>
</form>
</div>
);
}

export default LoginForm;