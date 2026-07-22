import React from 'react';
import '../index.css';

const Skeleton = ({ type, className = '' }) => {
  const classes = `skeleton ${type} ${className}`;
  return <div className={classes}></div>;
};

export const SkeletonCard = () => (
  <div className="card h-100 shadow-sm border-0 bg-transparent">
    <div className="card-body d-flex flex-column gap-3">
      <Skeleton type="skeleton-title" />
      <Skeleton type="skeleton-text" />
      <Skeleton type="skeleton-text" />
      <div className="d-flex gap-2">
        <Skeleton type="skeleton-badge" />
        <Skeleton type="skeleton-badge" />
      </div>
      <Skeleton type="skeleton-button" className="mt-auto" />
    </div>
  </div>
);

export const SkeletonArticle = () => (
  <div className="card h-100 shadow-sm border-0 bg-transparent">
    <div className="card-body d-flex flex-column gap-3">
      <Skeleton type="skeleton-title" />
      <Skeleton type="skeleton-text" />
      <Skeleton type="skeleton-text" />
      <Skeleton type="skeleton-button" className="mt-auto" />
    </div>
  </div>
);

export default Skeleton;
