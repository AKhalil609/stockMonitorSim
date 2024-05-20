import { useEffect, useState } from 'react';
import './style.scss';

interface NotificationCardProps {
  message: string;
  type: 'error' | 'info';
}

/**
 * Component for displaying notification card to the user (Used to display connection status).
 * Set to not disappear when there is an error
 * @component
 * @param {string} message - The notification message to display.
 * @param {'error' | 'info'} type - The type of notification, determines the styling.
 */
const NotificationCard = ({ message, type }: NotificationCardProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);

      if (type === 'info') {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [message, type]);

  return (
    <section
      className={`notification-card ${type} ${visible ? 'slide-in' : 'slide-out'}`}
      role="alert"
      aria-live="assertive"
    >
      <p>{message}</p>
    </section>
  );
};

export default NotificationCard;
