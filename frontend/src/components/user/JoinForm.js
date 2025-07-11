import React, {useState} from 'react';

const JoinForm =() => {
const [formData, setFormData] =useState({
email:'',
password:'',
confirmPassword:'',
agreeTerms:false
});

const [errors, setErrors] = useState({});

const handleInputChange  = (e) => {
const {name,value ,type, checked} =e.target;
setFormData(prev =>({
...prev,
[name]: type === 'checkbox' ?checked :value
}));
};

const validateForm =()=>{
const newErrors ={};

if(!formData.email){
newErrors.email='이메일을 입력해주세요.';}
else if(!/\S+@\S+\.\S+/ .test(formData.email)){
newErrors.email='올바른 이메일 형식이 아닙니다.';}

if(!formData.password){
newErrors.password ='비밀번호를 입력해주세요.';}
else if(formData.password.length<8){
newErrors.password='비밀번호가 8자 이상이어야 합니다.';}

if(!formData.confirmPassword){
newErrors.confirmPassword ='비밀번호를 다시 한 번 입력해주세요.';}
else if(formData.password !==formData.confirmPassword){
newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';}

if(!formData.agreeTrems){
newErrors.agreeTerms ='이용약관에 동의해주세요.';}

setErrors(newErrors);
return Object.keys(newErrors).length ===0;
};

const handleSubmit = (e) => {
e.preventDefault();
if(validateForm()){
console.log('회원가입 데이터:',formData);
}
};

return(
<div className="join-form-container">
<form onSubmit = {handleInputChange} className="join-form">
<div className="input-group">
<input
type="email"
name="email"
value={formData.email}
onChange={handleInputChange}
placeholder="이메일을 입력하세요"
className={`form-input ${errors.email ? 'errors' : ''}`}
/>
{errors.email && <span className="error-message">{errors.email}</span>}
</div>

<div className="input-group">
<input
type="password"
name="password"
value={formData.password}
onChange={handleInputChange}
placeholder="비밀번호 재확인"
className={`form-input ${errors. confirmPassword ? 'error' : ''}`}
/>
{errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
</div>

<div className="terms-section">
<div className="checkbox-group">
<input
type="checkbox"
id="agreeTerms"
name="agreeTerms"
checked={"formData.agreeTerms"}
onChange={handleInputChange}
className="checkbox-input"
/>
<label htmlFor="agreeTerms" className="checkbox-label">
개인정보 수집 및 이용에 동의합니다.(필수)
</label>
</div>
{errors.agreeTerms &&<span className="error-message">{errors.agreeTerms}</span>}

<div className="terms-context">
<p className="terms-text">
"echo spot"은 회원가입 및 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다. 수집항목:이름,이메일,주소 등 이용목적:회원가입. 서비스 제공, 고객상담, 마케팅 활동 보유기간:회원탈퇴 시까지(관련 법령에 따라 일정기간 보관) 개인정보 수집·이용에 동의하지 않으실 경우 회원가입이 제한될 수 있습니다.
</p>
</div>
</div>

<button type= "submit" className="submit-button">
회원 가입
</button>
</form>
</div>
);
};

export default JoinForm;




