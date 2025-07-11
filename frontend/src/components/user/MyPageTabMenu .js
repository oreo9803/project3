import React from 'react';

const MyPageTabMenu = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'info', label: '내 정보' },
    { id: 'favorites', label: '즐겨찾기' },
    { id: 'reviews', label: '내 평점/댓글' },
  ];

  return (
    <div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={activeTab === tab.id ? 'tab-active' : 'tab-inactive'}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default MyPageTabMenu;
