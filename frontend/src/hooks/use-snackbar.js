import {useState, useCallback} from 'react';

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'error',
  });

  const hideSnackbar = useCallback(() => {
    setSnackbar({isOpen: false, message: '', type: 'error'});
  }, []);

  const showError = useCallback((message) => {
    setSnackbar({isOpen: true, message, type: 'error'});
  }, []);

  const showSuccess = useCallback((message) => {
    setSnackbar({isOpen: true, message, type: 'success'});
  }, []);

  return {
    snackbar,
    hideSnackbar,
    showError,
    showSuccess,
  };
}