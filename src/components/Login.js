import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Form, FormControl, Button, Container } from 'react-bootstrap';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Connexion réussie, vous pouvez rediriger l'utilisateur ou mettre à jour l'état de connexion ici
      navigate('/')
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
    <div>
      <h2>Connexion</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <FormControl
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <FormControl
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={handlePasswordChange}
          />
        </Form.Group>
        <Button type="submit" variant="primary">Se connecter</Button>
        {error && <p className="text-danger">{error}</p>}
      </Form>
    </div>
    </Container>
  );
}

export default Login;
