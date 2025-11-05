// src/pages/Register.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Box, TextField, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      navigate('/');
    } catch (error) {
      alert('Ошибка регистрации: ' + error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="container"
    >
      <Typography
        variant="h4"
        sx={{ color: 'var(--text)', mb: 3, fontFamily: 'Montserrat', fontWeight: 700 }}
      >
        Регистрация
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} className="glass" sx={{ p: 3, borderRadius: 'var(--radius)', maxWidth: '400px', mx: 'auto' }}>
        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2, input: { color: 'var(--text)' }, label: { color: 'var(--muted)' } }}
          {...register('email', { required: 'Обязательное поле', pattern: { value: /\S+@\S+\.\S+/, message: 'Неверный email' } })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          sx={{ mb: 2, input: { color: 'var(--text)' }, label: { color: 'var(--muted)' } }}
          {...register('password', { required: 'Обязательное поле', minLength: { value: 6, message: 'Минимум 6 символов' } })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ background: 'var(--gradient)', color: 'var(--text)', fontWeight: 600 }}
          >
            Зарегистрироваться
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ mt: 2, color: 'var(--accent)', width: '100%' }}
          >
            Уже есть аккаунт? Войдите
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  );
}

export default Register;