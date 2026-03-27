export default function ProductStickyBar({
  leftLabel,
  leftDisabled,
  onLeft,
  rightLabel,
  rightDisabled,
  onRight,
  ariaLabel,
}) {
  return (
    <div
      className="eco-bottom-actions eco-product-sticky"
      role="region"
      aria-label={ariaLabel ?? "Product actions"}
    >
      <div className="eco-bottom-actions-inner">
        <div className="eco-bottom-actions-buttons">
          <button
            type="button"
            className="eco-secondary-btn"
            onClick={onLeft}
            disabled={leftDisabled ?? false}
          >
            {leftLabel}
          </button>
          <button
            type="button"
            className="eco-primary-btn eco-bottom-next-btn"
            onClick={onRight}
            disabled={rightDisabled ?? false}
          >
            {rightLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

