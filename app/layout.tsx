import type { Metadata } from 'next';
import { AppHeader } from '@/components/AppHeader/AppHeader';
import './globals.css';
import cl from './layout.module.css';

export const metadata: Metadata = {
  title: {
    default: 'Постовик',
    template: '%s — Постовик',
  },
  description: 'Блог с постами',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AppHeader />

        <main className={cl['layout__main']}>{children}</main>
      </body>
    </html>
  );
}
