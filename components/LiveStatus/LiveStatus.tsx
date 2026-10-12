import cl from './LiveStatus.module.css';

type LiveStatusProps = {
  connected: boolean;
};

export function LiveStatus({ connected }: LiveStatusProps) {
  return (
    <p className={cl['live-status']} role="status">
      <span className={connected ? cl['live-status--on'] : cl['live-status--off']} aria-hidden="true" />

      {connected ? 'Подключен' : 'Подключение…'}
    </p>
  );
}
