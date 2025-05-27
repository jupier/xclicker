import React from "react";

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
  return (
    <div className="resource-item">
      <span className="resource-icon">{icon}</span>
      <span className="resource-count">{count}</span>
      <span className="resource-label">{label}</span>
    </div>
  );
};
