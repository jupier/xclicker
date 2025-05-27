import React, { useEffect, useRef, useState } from "react";

interface ResourceItemProps {
  icon: string;
  count: number;
  label: string;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  icon,
  count,
  label,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupValue, setPopupValue] = useState(0);
  const prevCountRef = useRef(count);

  useEffect(() => {
    const diff = count - prevCountRef.current;
    if (diff !== 0) {
      setIsAnimating(true);
      if (diff > 0) {
        setShowPopup(true);
        setPopupValue(diff);
        setTimeout(() => setShowPopup(false), 800);
      }
      setTimeout(() => setIsAnimating(false), 300);
    }
    prevCountRef.current = count;
  }, [count]);

  return (
    <div className="resource-item">
      <span className="resource-icon">{icon}</span>
      <span className={`resource-count ${isAnimating ? "animate" : ""}`}>
        {count}
        {showPopup && <span className="resource-popup">+{popupValue}</span>}
      </span>
      <span className="resource-label">{label}</span>
    </div>
  );
};
