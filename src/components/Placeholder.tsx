import type { ReactNode } from 'react';

interface PlaceholderProps {
  label: string;
  /** the public/ path we expected, shown as a hint */
  path?: string;
  icon?: ReactNode;
}

export default function Placeholder({ label, path, icon }: PlaceholderProps) {
  return (
    <div className="placeholder">
      {icon}
      <span className="placeholder__label">{label}</span>
      {path ? <span className="placeholder__path">{path}</span> : null}
    </div>
  );
}
