import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

function Navbar() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Avito Clone
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/create-ad">
          Создать объявление
        </Button>
        {user ? (
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Войти
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Регистрация
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;