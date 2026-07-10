import type { ReactNode } from "react";

type StudioShellProps = {
  title: string;
  toolbar: ReactNode;
  stage: ReactNode;
  tray: ReactNode;
};

export function StudioShell({ title, toolbar, stage, tray }: StudioShellProps) {
  return (
    <div className="shell">
      <header className="shell-header">
        <h1>{title}</h1>
        <div className="shell-toolbar">{toolbar}</div>
      </header>
      <main className="shell-stage">{stage}</main>
      <footer className="shell-tray">{tray}</footer>
    </div>
  );
}
