import React, {useState} from 'react';


const FindPasswordForm = () => {
const [FormData, setFormData] = useState({
email:'',
verificationCode:''
});
const [errors, setErrors] = useState({});
const [isModalOpen, setIsModalOpen] = useState(false);
const [tempPassword, setTempPassword] = useState('');
const [isCodeSent, setIsCodeSent] = useState(false);

const handleInputChange = (e) => {
const {name, value} = e.target;
setFormData(prev => ({
...prev,
[name]:value
}));
};

const generateTempPassword= () => {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let result = '';
for(let i = 0; i<8; i++){
result += characters.charAt(Math.floor(Math.random() * characters.length));
}
return result;
};

const handleSendCode = () => {
const newErrors ={};
if(!formData.email){
newErrors.email = '이메일을 입력해주세요.';
}else if(!/\S+@\S+\.\S+/.test(formData.email)){
newErrors.email= '올바른 이메일 형식이 아닙니다.';
}

if(Object.keys(newErrors).length >0){
setErrors(newErrors);
return;
}
setIsCodeSent(true);
alert('인증코드가 발송되었습니다.');
};

const handleVerifyCode =() =>{
const newErrors = {};

if(!formData.verificationCode){
 newErrors.verificationCode = '인증코드를 입력해주세요.';
}

if(Object.keys(newErrors).length >0){
setErrors(newErrors);
return;
}

alert('인증이 완료되었습니다.');
};

const handlePasswordReset = () => {
const newErrors = {};

if(!formData.email){
newErrors.email ='이메일을 입력해주세요.';
}else if(!/\S+@\S+\.\S+/.test(formData.email)) {
newErrors.email = '올바른 이메일 형식이 아닙니다.';
}

if(!formData.verificationCode){
newErrors.verificationCode ='인증코드를 입력해주세요.';
}

if(Object.keys(newErrors).length >0){
setErrors(newErrors);
return;
}

const newTempPassword = generateTempPassword();
setTempPassword(newTempPassword);
setIsModalOpen(true);

console.log('비밀번호 초기화 요청:',{
email:formData.email,
verificationCode: formData.verificationCode,
tempPassword: newTempPassword
});
};

const closeModal = () => {
setIsModalOpen(false);
setTempPassword('');

setFormData({
email:'',
verificationCode:''
});
setIsCodeSent(false);
};

const copyToClipboard = () => {
navigator.clipboard.writeText(tempPassword).then(() => {
alert('임시 비밀번호가 클립보드에 복사되었습니다.');
});
};

return (

<div className="password-reset-container">
<div className="password-reset-form">
<div className="input-group">
<div className="input-with-button">
<input
type= "email"
name= "email"
value= {formData.email}
onChange= {handleInputChange}
placeholder="human@echospot.com"
className={`form-input ${errors.email ? 'error' : ''}`}
/>
<button
type= "button"
className= "send-button"
onClick= {handleSendCode}
>
발송
</button>
</div>
{errors.email && <span className="error-message"> {errors.email}</span>}
</div>

<div className="input-group">
<div className="input-with-button">
<input
type= "text"
name= "verificationCode"
value= {formData.verificationCode}
onChange= {handleInputChange}
placeholder= "1231412"
className= {`form-input ${errors.verificationCode ? 'error' : ''}`}
/>
<button
type="button"
name="verificationCode"
onClick={handleVerifyCode}
>
인증확인

</button>
</div>
{errors.verificationCode && <span className="error-message">{errors.verificationCode}</span>}
</div>

<button
type="button"
className="reset-button"
onClick={handlePasswordReset}
>
비밀번호 초기화
</button>
</div>

{isModalOpen && (
<div className="modal-overlay" onClick ={closeModal}>
<div className="modal-content" onClick = { (e) => e.stopPropagation()}>
<div className="modal-header">
<h3>임시 비밀번호 발급</h3>
<button className= "close-button" onClick= {closeModal}>x</button>
</div>
<div className="modal-body">
<p>임시 비밀번호가 발급되었습니다.</p>
<div className="temp-password-container">
<div className="temp-password">{tempPassword}</div>
<button className="copy-button" onClick={copyToClipboard}>
복사
</button>
</div>
<p className="notice">
보안을 위해 로그인 후 비밀번호를 변경해주세요.
</p>
</div>
<div className="modal-footer">
<button className="confirm-button" onClick={closeModal}>
확인
</button>
</div>
</div>
</div>
)}
</div>
);
};
export default FindPasswordForm;
