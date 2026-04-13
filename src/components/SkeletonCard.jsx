function SkeletonCard() {
  return (
    <article
      className="game-card skeleton-card"
      aria-hidden="true"
    >
      <div className="game-card-image skeleton-block skeleton-card-image" />

      <div className="game-card-content">
        <div className="skeleton-block skeleton-line skeleton-line-title" />
        <div className="skeleton-block skeleton-line skeleton-line-medium" />
        <div className="skeleton-block skeleton-line skeleton-line-short" />
        <div className="skeleton-block skeleton-button" />
      </div>
    </article>
  );
}

export default SkeletonCard;
