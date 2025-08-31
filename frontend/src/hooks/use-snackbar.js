import {useState} from 'react';

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'error',
  });

  const hideSnackbar = () => {
    setSnackbar({isOpen: false, message: '', type: 'error'});
  };

  const showError = (message) => {
    setSnackbar({isOpen: true, message, type: 'error'});
  };

  const showSuccess = (message) => {
    setSnackbar({isOpen: true, message, type: 'success'});
  };

  return {
    snackbar,
    hideSnackbar,
    showError,
    showSuccess,
  };
}