import Link from 'next/link';
import cl from './AppHeader.module.css';

export function AppHeader() {
  return (
    <header className={cl['app-header']}>
      <div className={cl['app-header__content']}>
        <Link href="/" className={cl['app-header__link']}>
          <h1 className={cl['app-header__title']}>Постовик</h1>
        </Link>

        <Link href="/posts/new" className={cl['app-header__create']}>
          Создать пост
        </Link>
      </div>
    </header>
  );
}
