import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, LayoutDashboard, LogOut, Moon, Sun, Target, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AppShell() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const links = [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }, { to: '/profile', label: 'Profile', icon: UserRound }];
  return <div className="min-h-screen lg:flex">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-white/75 px-5 py-7 backdrop-blur-xl dark:bg-[#101426]/90 lg:flex">
      <div className="mb-10 flex items-center gap-3 px-2"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 text-white shadow-lg shadow-primary-500/25"><Target size={23} /></div><div><p className="font-extrabold tracking-tight">Focus<span className="text-primary-500">90</span></p><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">Exam Sprint</p></div></div>
      <nav className="space-y-2">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:bg-primary-50 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-white/5'}`}><Icon size={19} />{label}</NavLink>)}</nav>
      <div className="mt-auto"><div className="mb-4 rounded-2xl bg-gradient-to-br from-primary-50 to-violet-50 p-4 dark:from-primary-500/10 dark:to-violet-500/10"><BarChart3 className="mb-2 text-primary-500" size={21}/><p className="text-xs font-bold">One day at a time.</p><p className="mt-1 text-[11px] leading-relaxed text-slate-500">Every focused session moves you closer to your goal.</p></div><button onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:text-red-500"><LogOut size={18}/> Log out</button></div>
    </aside>
    <main className="min-w-0 flex-1 pb-24 lg:ml-64 lg:pb-0">
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b bg-[#f7f9ff]/80 px-5 backdrop-blur-xl dark:bg-[#0d1020]/80 md:px-8 lg:px-10"><div><p className="text-xs font-medium text-slate-400">90-Day Bank Exam Streak</p><p className="text-sm font-bold">Keep your momentum going</p></div><div className="flex items-center gap-2"><button onClick={toggleTheme} aria-label="Toggle theme" className="grid h-10 w-10 place-items-center rounded-xl border bg-white text-slate-500 transition hover:text-primary-500 dark:bg-white/5">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><NavLink to="/profile" className="ml-1 flex items-center gap-2 rounded-xl p-1.5 pr-3 transition hover:bg-white dark:hover:bg-white/5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-300 to-pink-400 text-sm font-bold text-white">{user?.name?.[0]?.toUpperCase()}</div><span className="hidden text-sm font-semibold sm:block">{user?.name?.split(' ')[0]}</span></NavLink></div></header>
      <Outlet />
    </main>
    <nav className="fixed bottom-3 left-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-2xl border bg-white/90 p-2 shadow-xl backdrop-blur-xl dark:bg-[#181c30]/90 lg:hidden">{links.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => `flex min-w-[78px] flex-col items-center gap-1 rounded-xl px-4 py-2 text-[10px] font-semibold ${isActive ? 'bg-primary-500 text-white' : 'text-slate-500'}`}><Icon size={18}/>{label}</NavLink>)}</nav>
  </div>;
}
