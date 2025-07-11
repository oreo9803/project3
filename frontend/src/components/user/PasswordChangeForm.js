import React, { useState } from 'react';
import PasswordChangeButton from './PasswordChangeButton';

const PasswordChangeForm = ({ onSubmit }) => {
  const { formData, setFormData } = useState({
    email: '1234@naver.com',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div>
        <h2>비밀번호 변경</h2>
      </div>
      <div>
        <div>
          <label>E=mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="현재 비밀번호를 입력하세요"
          />
        </div>

        <div>
          <label>새 비밀번호</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>

        <div>
          <label>확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>
        <PasswordChangeButton formData={formData} onsubmit={onsubmit} />
      </div>
    </div>
  );
};

export default PasswordChangeForm;
