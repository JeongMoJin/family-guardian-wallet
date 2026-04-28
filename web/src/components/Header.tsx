interface Props {
  title?: string;
  subtitle?: string;
  showHome?: boolean;
}

export const Header = ({ title = '가디언월렛', subtitle, showHome = true }: Props) => {
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-senior-line">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-senior-accentSoft to-senior-accent shadow-soft" />
          <div>
            <div className="text-lg font-extrabold text-senior-ink leading-none">{title}</div>
            {subtitle && (
              <div className="text-xs text-senior-muted mt-1">{subtitle}</div>
            )}
          </div>
        </a>
        {showHome && (
          <a
            href="/"
            className="text-sm text-senior-muted hover:text-senior-ink underline-offset-4 hover:underline"
          >
            ← 홈으로
          </a>
        )}
      </div>
    </header>
  );
};
