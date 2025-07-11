import React, { useState } from 'react';

// 💡 FindPasswordForm 컴포넌트
const FindPasswordForm = () => {
  // 1) 이메일/인증코드 입력값 관리 state
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: ''
  });

  // 2) 에러 메시지 관리 state
  const [errors, setErrors] = useState({});

  // 3) 모달창 열림/닫힘
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 4) 임시 비밀번호(모달에 표시)
  const [tempPassword, setTempPassword] = useState('');

  // 5) 인증코드 발송 여부
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 🔵 입력창 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔵 8자리 임시 비밀번호 랜덤 생성 함수
  const generateTempPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // 🔵 "인증코드 발송" 버튼 클릭 시
  const handleSendCode = () => {
    const newErrors = {};
    // 이메일 입력 체크
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 에러 있으면 메시지 표시 후 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsCodeSent(true); // 인증코드 보냈다고 상태 변경
    alert('인증코드가 발송되었습니다.');
  };

  // 🔵 "인증확인" 버튼 클릭 시
  const handleVerifyCode = () => {
    const newErrors = {};

    if (!formData.verificationCode) {
      newErrors.verificationCode = '인증코드를 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('인증이 완료되었습니다.');
  };

  // 🔵 "비밀번호 초기화" 버튼 클릭 시
  const handlePasswordReset = () => {
    const newErrors = {};

    // 이메일 체크
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 인증코드 체크
    if (!formData.verificationCode) {
      newErrors.verificationCode = '인증코드를 입력해주세요.';
    }

    // 에러 있으면 메시지 표시 후 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 임시 비밀번호 생성 → 모달 열기
    const newTempPassword = generateTempPassword();
    setTempPassword(newTempPassword);
    setIsModalOpen(true);

    // 콘솔로 실제로 보낼 데이터 로그 찍기(실제 개발시 API 연동)
    console.log('비밀번호 초기화 요청:', {
      email: formData.email,
      verificationCode: formData.verificationCode,
      tempPassword: newTempPassword
    });
  };

  // 🔵 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setTempPassword('');
    setFormData({
      email: '',
      verificationCode: ''
    });
    setIsCodeSent(false);
  };

  // 🔵 임시 비밀번호 복사 버튼
  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword).then(() => {
      alert('임시 비밀번호가 클립보드에 복사되었습니다.');
    });
  };

  // ----------------- 렌더링 부분 -----------------
  return (
    <div className="password-reset-container">
      <div className="password-reset-form">

        {/* 이메일 입력 + 인증코드 발송 */}
        <div className="input-group">
          <div className="input-with-button">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="human@echospot.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            <button
              type="button"
              className="send-button"
              onClick={handleSendCode}
            >
              발송
            </button>
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* 인증코드 입력 + 인증확인 */}
        <div className="input-group">
          <div className="input-with-button">
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              placeholder="1231412"
              className={`form-input ${errors.verificationCode ? 'error' : ''}`}
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

        {/* 비밀번호 초기화 버튼 */}
        <button
          type="button"
          className="reset-button"
          onClick={handlePasswordReset}
        >
          비밀번호 초기화
        </button>
      </div>

      {/* 임시 비밀번호 발급 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>임시 비밀번호 발급</h3>
              <button className="close-button" onClick={closeModal}>x</button>
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
