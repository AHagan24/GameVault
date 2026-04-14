function SkeletonDetails() {
  return (
    <div className="game-details-page skeleton-details-page" aria-hidden="true">
      <div className="skeleton-block skeleton-line skeleton-details-title" />
      <div className="skeleton-block skeleton-details-hero" />
      <div className="skeleton-block skeleton-details-button" />

      <div className="skeleton-details-meta">
        <div className="skeleton-block skeleton-line skeleton-line-medium" />
        <div className="skeleton-block skeleton-line skeleton-line-long" />
        <div className="skeleton-block skeleton-line skeleton-line-short" />
        <div className="skeleton-block skeleton-line skeleton-line-medium" />
        <div className="skeleton-block skeleton-line skeleton-line-long" />
        <div className="skeleton-block skeleton-line skeleton-line-medium" />
        <div className="skeleton-block skeleton-line skeleton-line-short" />
      </div>

      <div className="skeleton-details-copy">
        <div className="skeleton-block skeleton-line skeleton-line-long" />
        <div className="skeleton-block skeleton-line skeleton-line-long" />
        <div className="skeleton-block skeleton-line skeleton-line-medium" />
      </div>
    </div>
  );
}

export default SkeletonDetails;
