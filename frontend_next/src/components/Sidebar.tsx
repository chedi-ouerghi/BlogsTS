import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li>
          <Link href="/dashboard">📊 Tableau de Bord</Link>
        </li>
        <li>
          <Link href="/dashboard/admin">🔧 Admin</Link>  
        </li>
        <li>
          <Link href="/dashboard/projects">📂 Projets</Link>  
        </li>
        <li>
          <Link href="/dashboard/tasks">✅ Tâches</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
