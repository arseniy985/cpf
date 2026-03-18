import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Добро пожаловать в ЦПФ</h1>
      <p style={{ margin: '1rem 0' }}>Это временная стартовая страница.</p>
      <Link href="/app" style={{ color: 'blue', textDecoration: 'underline' }}>
        Перейти в личный кабинет
      </Link>
    </div>
  );
}
