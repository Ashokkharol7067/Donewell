import { NavLink, Outlet } from 'react-router-dom'
import { CalendarCheck, LayoutDashboard, ListTodo, LogOut, Plus, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
function getGreeting(hour) {
	if (hour < 12) return 'Good morning';
	if (hour < 17) return 'Good afternoon';
	return 'Good evening';
}

export default function Layout() {
	const { user, logout } = useAuth();
	const now = new Date();
	return <div className="shell"><aside><div className="brand"><span className="brand-mark"><CalendarCheck size={18}/></span><span>Donewell</span></div><div className="eyebrow">WORKSPACE</div><nav><NavLink to="/"><LayoutDashboard size={17}/>Overview</NavLink><NavLink to="/tasks"><ListTodo size={17}/>All tasks</NavLink><NavLink to="/tasks/new" className="new-link"><Plus size={17}/>New task</NavLink></nav><div className="sidebar-bottom"><NavLink to="/profile"><UserRound size={17}/>Profile</NavLink><button onClick={logout}><LogOut size={17}/>Sign out</button></div></aside><main><header><div><p className="kicker">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p><h1>{getGreeting(now.getHours())}, {user?.name?.split(' ')[0]}.</h1></div><div className="avatar">{user?.name?.slice(0, 1).toUpperCase()}</div></header><Outlet /></main></div>
}
