import React from 'react';
import FavoriteStarButton from './FavoriteStarButton';

const FavoriteItemCard = ({ item, onToggleFavorite }) => {
  const { id, title, description, isFavorite } = item;

  return (
    <div className="favorite-item-card">
      <div className="item-content">
        <div className="item-info">
          <h3 className="item-title">{title}</h3>
          <p className="item-description">{description}</p>
        </div>
      </div>
      
      <div className="item-actions">
        <FavoriteStarButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          itemId={id}
        />
      </div>
    </div>
  );
};
export default FavoriteItemCard;
