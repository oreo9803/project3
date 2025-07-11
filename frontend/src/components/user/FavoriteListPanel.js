import React, { useState } from 'react';
import FavoriteItemCard from './FavoriteItemCard';
import FavoriteStarButton from './FavoriteStarButton';

const FavoriteListPanel = () => {
  const [favoriteItems, setFavoriteItems] = useState([
    {
      id: 1,
      title: '경로 이름',
      description: '어디부터 어디까지',
      category: '내 경로',
      isFavorite: true,
    },

    {
      id: 2,
      title: '충전소 이름',
      description: '충전소 주소',
      category: '내 충전소',
      isFavorite: true,
    },

    {
      id: 3,
      title: '장소 이름',
      description: '장소 주소',
      category: '내 장소',
      isFavorite: true,
    },

    {
      id: 4,
      title: '숙소 이름',
      description: '숙소 주소',
      category: '내 숙소',
      isFavorite: true,
    },
  ]);

  const handleToggleFavorite = (itemId) => {
    setFavoriteItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const groupedItems = favoriteItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="favorite-list-panel">
      <div className="panel-header">
        <h2>즐겨찾기</h2>
      </div>

      <div className="favorite-content">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="item-list">
              {items.map((item) => (
                <FavoriteItemCard
                  key={item.id}
                  item={item}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {favoriteItems.filter((item) => item.isFavorite).length === 0 && (
        <div className="empty-state">
          <p>즐겨찾기 항목이 없습니다.</p>
        </div>
      )}
    </div>
  );
};
export default FavoriteListPanel;
