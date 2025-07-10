import React from 'react';
import './station.css'

const FilterPanel = ({ filters, onChange }) => {
  const handleCheckbox = (category, value) => {
    const updated = {
      ...filters,
      [category]: filters[category].includes(value)
        ? filters[category].filter((v) => v !== value)
        : [...filters[category], value]
    };
    onChange(updated);
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <div className="filter-title">🔌 충전방법</div>
        <label><input type="checkbox" onChange={() => handleCheckbox("type", "급속")} checked={filters.type.includes("급속")} /> 급속 충전</label>
        <label><input type="checkbox" onChange={() => handleCheckbox("type", "완속")} checked={filters.type.includes("완속")} /> 완속 충전</label>
      </div>

      <div className="filter-group">
        <div className="filter-title">🅿️ 주차장</div>
        <label><input type="checkbox" onChange={() => handleCheckbox("parking", "무료")} checked={filters.parking.includes("무료")} /> 무료</label>
        <label><input type="checkbox" onChange={() => handleCheckbox("parking", "유료")} checked={filters.parking.includes("유료")} /> 유료</label>
      </div>

      <div className="filter-group">
        <div className="filter-title">🏷 브랜드</div>
        <label><input type="checkbox" onChange={() => handleCheckbox("brand", "소프트베리")} checked={filters.brand.includes("소프트베리")} /> 소프트 베리</label>
        <label><input type="checkbox" onChange={() => handleCheckbox("brand", "E-PIT")} checked={filters.brand.includes("E-PIT")} /> E-PIT</label>
      </div>
    </div>
  );
};

export default FilterPanel;