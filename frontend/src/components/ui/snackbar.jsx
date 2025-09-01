import {useEffect} from 'react';
import {clsx} from 'clsx';

export function Snackbar({ 
  message, 
  type = 'error', 
  isOpen, 
  onClose, 
  duration = 4000 
}) {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const variants = {
    error: 'bg-red-500',
    success: 'bg-green-500',
  };

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 animate-in slide-in-from-top">
      <div className={clsx(
        'flex items-center justify-between w-full sm:min-w-[300px] sm:max-w-md px-4 py-3 rounded-lg text-white shadow-lg',
        variants[type]
      )}>
        <span className="text-sm font-medium flex-1 mr-2">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 focus:outline-none flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}