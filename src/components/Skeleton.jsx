const Skeleton = ({ type, className = '' }) => <div className={`skeleton ${type} ${className}`} />

export const SkeletonCard = () => (
  <div className="rounded-xl border border-border p-6">
    <div className="flex flex-col gap-3">
      <Skeleton type="skeleton-title" />
      <Skeleton type="skeleton-text" />
      <Skeleton type="skeleton-text" />
      <div className="flex gap-2">
        <Skeleton type="skeleton-badge" />
        <Skeleton type="skeleton-badge" />
      </div>
      <Skeleton type="skeleton-button" className="mt-2" />
    </div>
  </div>
)

export const SkeletonArticle = () => (
  <div className="rounded-xl border border-border p-6">
    <div className="flex flex-col gap-3">
      <Skeleton type="skeleton-title" />
      <Skeleton type="skeleton-text" />
      <Skeleton type="skeleton-text" />
      <Skeleton type="skeleton-button" className="mt-2" />
    </div>
  </div>
)

export default Skeleton
