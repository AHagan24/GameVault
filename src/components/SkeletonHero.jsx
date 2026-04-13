function SkeletonHero() {
  return (
    <section className="hero-section skeleton-hero" aria-hidden="true">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="skeleton-block skeleton-eyebrow" />
        <div className="skeleton-block skeleton-line skeleton-hero-title" />
        <div className="skeleton-block skeleton-line skeleton-hero-title skeleton-hero-title-secondary" />
        <div className="skeleton-block skeleton-line skeleton-hero-copy" />
        <div className="skeleton-block skeleton-line skeleton-hero-copy skeleton-hero-copy-secondary" />
        <div className="hero-meta">
          <span className="skeleton-block skeleton-pill" />
          <span className="skeleton-block skeleton-pill" />
        </div>
        <div className="skeleton-block skeleton-hero-button" />
      </div>
    </section>
  );
}

export default SkeletonHero;
