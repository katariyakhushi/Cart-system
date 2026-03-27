export default function BottomActionBar({
  backLabel,
  onBack,
  backButtonProps,
  nextLabel,
  nextDisabled,
  onNext,
  nextButtonProps,
}) {
  return (
    <div className="eco-bottom-actions" role="region" aria-label="Checkout actions">
      <div className="eco-bottom-actions-inner">
        <div className="eco-bottom-actions-buttons">
          <button
            type={backButtonProps?.type ?? "button"}
            className="eco-secondary-btn"
            onClick={onBack}
            disabled={backButtonProps?.disabled ?? false}
            {...backButtonProps}
          >
            {backLabel}
          </button>
          <button
            type={nextButtonProps?.type ?? "button"}
            className="eco-primary-btn eco-bottom-next-btn"
            onClick={onNext}
            disabled={nextDisabled ?? false}
            {...nextButtonProps}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

