import React, { useState } from 'react';

const JoinForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [emailCheckStatus, setEmailCheckStatus] = useState(''); // 'checking', 'available', 'unavailable'
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null); // null, true, false

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // 이메일 입력 시 중복 확인 상태 초기화
    if (name === 'email') {
      setIsEmailChecked(false);
      setEmailCheckStatus('');
    }

    // 비밀번호 확인 로직
    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword =
        name === 'confirmPassword' ? value : formData.confirmPassword;

      if (confirmPassword) {
        setPasswordMatch(password === confirmPassword);
      } else {
        setPasswordMatch(null);
      }
    }
  };

  const handleEmailCheck = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요.' }));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: '올바른 이메일 형식이 아닙니다.',
      }));
      return;
    }

    setEmailCheckStatus('checking');

    try {
      // 실제 API 호출 대신 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 간단한 시뮬레이션: test@test.com은 중복, 나머지는 사용 가능
      const isDuplicate = formData.email.toLowerCase() === 'test@test.com';

      if (isDuplicate) {
        setEmailCheckStatus('unavailable');
        setIsEmailChecked(false);
        setErrors((prev) => ({ ...prev, email: '' })); // 기본 에러 메시지 제거
      } else {
        setEmailCheckStatus('available');
        setIsEmailChecked(true);
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    } catch (error) {
      setEmailCheckStatus('');
      setErrors((prev) => ({
        ...prev,
        email: '중복 확인 중 오류가 발생했습니다.',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    } else if (!isEmailChecked) {
      newErrors.email = '이메일 중복 확인을 해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호가 8자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 다시 한 번 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('회원가입 데이터:', formData);
    }
  };

  return (
    <div className="join-form-container">
      <form onSubmit={handleSubmit} className="join-form">
        <div className="input-group">
          <div className="email-input-container">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              className={`form-input ${errors.email ? 'error' : ''} ${
                emailCheckStatus === 'available' ? 'success' : ''
              }`}
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              disabled={emailCheckStatus === 'checking'}
              className="email-check-button"
            >
              {emailCheckStatus === 'checking' ? '확인 중...' : '중복 확인'}
            </button>
          </div>
          {emailCheckStatus === 'available' && (
            <span className="success-message">사용 가능한 이메일입니다.</span>
          )}
          {emailCheckStatus === 'unavailable' && (
            <span className="error-message">다른 이메일을 사용해주세요.</span>
          )}
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력하세요"
            className={`form-input ${errors.password ? 'error' : ''}`}
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="비밀번호 재확인"
            className={`form-input ${errors.confirmPassword ? 'error' : ''} ${
              passwordMatch === true ? 'success' : ''
            }`}
          />
          {passwordMatch === true && (
            <span className="success-message">비밀번호가 일치합니다.</span>
          )}
          {passwordMatch === false && (
            <span className="error-message">비밀번호가 일치하지 않습니다.</span>
          )}
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="terms-section">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="checkbox-input"
            />
            <label htmlFor="agreeTerms" className="checkbox-label">
              개인정보 수집 및 이용에 동의합니다.(필수)
            </label>
          </div>
          {errors.agreeTerms && (
            <span className="error-message">{errors.agreeTerms}</span>
          )}

          <div className="terms-context">
            <p className="terms-text">
              "echo spot"은 회원가입 및 서비스 제공을 위해 아래와 같이
              개인정보를 수집·이용합니다. 수집항목:이름,이메일,주소 등
              이용목적:회원가입. 서비스 제공, 고객상담, 마케팅 활동
              보유기간:회원탈퇴 시까지(관련 법령에 따라 일정기간 보관) 개인정보
              수집·이용에 동의하지 않으실 경우 회원가입이 제한될 수 있습니다.
            </p>
          </div>
        </div>

        <button type="submit" className="submit-button">
          회원 가입
        </button>
      </form>
    </div>
  );
};

export default JoinForm;
