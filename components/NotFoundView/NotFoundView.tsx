import Link from 'next/link';
import cl from './NotFoundView.module.css';

interface NotFoundViewProps {
  title?: string;
  description?: string;
}

export function NotFoundView({
  title = 'Пост не найден',
  description = 'Возможно, запись удалили или ссылка неверная.',
}: NotFoundViewProps) {
  return (
    <section>
      <span className={cl['not-found-view__number']}>404</span>

      <h1 className={cl['not-found-view__title']}>{title}</h1>

      <p className={cl['not-found-view__description']}>{description}</p>

      <Link href="/" className={cl['not-found-view__link']}>
        К списку записей
      </Link>
    </section>
  );
}
