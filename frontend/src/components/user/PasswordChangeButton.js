import React from 'react';

const PasswordChangeButton = ({ formData, onSubmit }) => {
  const handleSubmit = (e) => {
    if (!formData.password) {
      alert('현재 비밀번호를 입력하세요.');
      return;
    }

    if (!formData.newPassword) {
      alert('새 비밀번호를 입력하세요.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    onSubmit(formData);
  };
  return <button onClick={handleSubmit}>비밀번호 변경</button>;
};

export default PasswordChangeButton;
