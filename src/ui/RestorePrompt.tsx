type RestorePromptProps = {
  /** What the studio calls a creation, e.g. "bracelet". */
  creationName: string;
  onYes: () => void;
  onNo: () => void;
};

/** Gentle offer to bring back the last design after the save was emptied. */
export function RestorePrompt({
  creationName,
  onYes,
  onNo,
}: RestorePromptProps) {
  return (
    <div className="restore-prompt" role="dialog" aria-modal="true">
      <div className="restore-card">
        <p className="restore-question">
          Want to continue your last {creationName}?
        </p>
        <div className="restore-buttons">
          <button type="button" className="restore-yes" onClick={onYes}>
            Yes! 💖
          </button>
          <button type="button" className="restore-no" onClick={onNo}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
