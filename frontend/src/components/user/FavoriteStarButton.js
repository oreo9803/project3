import React from "react";

const FavoriteStarButton = ({ isFavorite, onToggle, itemId }) => {
    const handleClick = (e) => {
        e.stopPropagation(); // 클릭 이벤트가 상위 요소로 전파되지 않도록 함
        onToggle(itemId);
    };

    return(
        <button
        onClick={handleClick}
        className={`star-button ${isFavorite ? 'active' : 'inactive'}`}
        aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >

      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isFavorite ? '#FFD700' : 'none'}
        stroke={isFavorite ? '#FFD700' : '#D1D5DB'}
        strokeWidth="2"
        className="transition-all duration-200"
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </button>
    );
};

export default FavoriteStarButton;
