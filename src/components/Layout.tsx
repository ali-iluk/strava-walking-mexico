import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
    isActive ? 'bg-sage/30 text-ink' : 'text-muted hover:bg-blush hover:text-ink'
  }`;

export function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-10 pt-6">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-sage">
            Walking Mexico
          </p>
          <h1 className="font-display text-2xl font-bold text-ink">6M Steps</h1>
        </div>
        <nav className="flex gap-1 rounded-xl bg-blush/60 p-1">
          <NavLink to="/" end className={navLinkClass}>
            Tracker
          </NavLink>
          <NavLink to="/data" className={navLinkClass}>
            Data
          </NavLink>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
