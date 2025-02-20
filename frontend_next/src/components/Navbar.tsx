import Link from 'next/link';

const Navbar = () => {

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link href="/">📌 ProjetManager</Link>
      </div>
      <div className="nav-links">
            <span className="username"></span>
            <button className="btn-logout">Déconnexion</button>
            <Link href="/auth/login" className="btn-primary">Connexion</Link>
            <Link href="/auth/register" className="btn-secondary">Inscription</Link>
      </div>
    </nav>
  );
};

export default Navbar;
