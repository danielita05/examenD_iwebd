import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';

interface Props {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3500 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
      </div>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Cerrar">
        <FiX size={16} />
      </button>
    </div>
  );
}
