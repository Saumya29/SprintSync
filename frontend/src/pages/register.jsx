import {useState} from 'react';
import {AuthForm} from '../components/auth-form';
import {register} from '../services/auth';
import {useSnackbar} from '../hooks/use-snackbar';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {snackbar, showError, showSuccess, hideSnackbar} = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    try {
      await register(email, password);
      showSuccess('Registration successful!');
      window.location.href = '/dashboard';
    } catch (err) {
      showError(err.message);
    }
  };

  const fields = [
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      value: email,
      onChange: (e) => setEmail(e.target.value)
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      value: password,
      onChange: (e) => setPassword(e.target.value),
      helperText: 'Must be at least 8 characters with uppercase, lowercase, number, and special character (!@#$%^&*)'
    },
    {
      id: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      value: confirmPassword,
      onChange: (e) => setConfirmPassword(e.target.value)
    }
  ];

  return (
    <AuthForm
      title="Sign Up"
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Sign Up"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign in"
      snackbar={snackbar}
      hideSnackbar={hideSnackbar}
    />
  );
};

export default Register;