import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthForm} from '../components/auth-form';
import {login} from '../services/auth';
import {useSnackbar} from '../hooks/use-snackbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {snackbar, showError, hideSnackbar} = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
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
      onChange: (e) => setPassword(e.target.value)
    }
  ];

  return (
    <AuthForm
      title="Sign In"
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Sign In"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Sign up"
      snackbar={snackbar}
      hideSnackbar={hideSnackbar}
    />
  );
};

export default Login;