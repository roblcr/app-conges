import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Form, FormControl, Button, Container, InputGroup } from 'react-bootstrap';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { EnvelopeAtFill, LockFill } from 'react-bootstrap-icons';

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
    <Container className='w-25 d-flex justify-content-center align-items-center vh-100'>
      <div>
        <h2>Connexion</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text id="email-addon">
                <EnvelopeAtFill />
              </InputGroup.Text>
              <FormControl
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={handleEmailChange}
                aria-label="E-mail"
                aria-describedby="email-addon"
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text id="password-addon">
                <LockFill />
              </InputGroup.Text>
              <FormControl
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={handlePasswordChange}
                aria-label="Mot de passe"
                aria-describedby="password-addon"
              />
            </InputGroup>
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Se connecter
          </Button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </Form>
      </div>
    </Container>
  );
}

export default Login;
