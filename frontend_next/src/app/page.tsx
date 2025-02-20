import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home-container">
      <h1>Bienvenue sur notre plateforme</h1>
      <p>Gérez vos projets et tâches efficacement.</p>
      <div className="buttons">
        <Link href="/auth/login">
          <button className="btn-primary">Connexion</button>
        </Link>
        <Link href="/auth/register">
          <button className="btn-secondary">Inscription</button>
        </Link>
      </div>
    </div>
  );
}
