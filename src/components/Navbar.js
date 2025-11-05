// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Search, Favorite, Person, Add, Message } from '@mui/icons-material';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';

function Navbar() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{ background: 'var(--gradient)', boxShadow: 'var(--neon)', borderRadius: '0 0 var(--radius) var(--radius)' }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={motion(Link)}
          to="/"
          sx={{ flexGrow: 1, fontFamily: 'Montserrat', fontWeight: 700, color: 'var(--text)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Swapix
        </Typography>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton component={Link} to="/search" sx={{ color: 'var(--text)' }}>
              <Search />
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton component={Link} to="/profile/favorites" sx={{ color: 'var(--text)' }}>
              <Favorite />
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton component={Link} to="/profile/messages" sx={{ color: 'var(--text)' }}>
              <Message />
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton component={Link} to="/create" sx={{ color: 'var(--text)' }}>
              <Add />
            </IconButton>
          </motion.div>
          {user ? (
            <>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton component={Link} to="/profile" sx={{ color: 'var(--text)' }}>
                  <Person />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSignOut}
                  sx={{ color: 'var(--text)', fontFamily: 'Inter', fontWeight: 500 }}
                >
                  Выйти
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button component={Link} to="/login" sx={{ color: 'var(--text)', fontFamily: 'Inter' }}>
                  Войти
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button component={Link} to="/register" sx={{ color: 'var(--text)', fontFamily: 'Inter' }}>
                  Регистрация
                </Button>
              </motion.div>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;