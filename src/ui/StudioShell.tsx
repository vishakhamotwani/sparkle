import type { ReactNode } from "react";
import { Footer } from "./Footer";

type StudioShellProps = {
  title: string;
  toolbar: ReactNode;
  stage: ReactNode;
  tray: ReactNode;
  onBack?: () => void;
};

export function StudioShell({
  title,
  toolbar,
  stage,
  tray,
  onBack,
}: StudioShellProps) {
  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-title">
          {onBack && (
            <button
              type="button"
              className="toolbar-button"
              aria-label="Back to home"
              onClick={onBack}
            >
              🏠
            </button>
          )}
          <h1>{title}</h1>
        </div>
        <div className="shell-toolbar">{toolbar}</div>
      </header>
      <main className="shell-stage">{stage}</main>
      <footer className="shell-tray">
        {tray}
        <Footer />
      </footer>
    </div>
  );
}
