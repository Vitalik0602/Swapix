// src/pages/CreateAd.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, auth, storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function CreateAd() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const onSubmit = async (data) => {
    if (!user) {
      alert('Войдите в аккаунт');
      navigate('/login');
      return;
    }
    try {
      let imageUrl = '';
      if (data.image[0]) {
        const imageRef = ref(storage, `images/${user.uid}/${data.image[0].name}`);
        await uploadBytes(imageRef, data.image[0]);
        imageUrl = await getDownloadURL(imageRef);
      }
      const adId = doc(collection(db, 'ads')).id;
      await setDoc(doc(db, 'ads', adId), {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        imageUrl,
        location: data.lat && data.lng ? [Number(data.lat), Number(data.lng)] : [55.7558, 37.6173],
        userId: user.uid,
        createdAt: new Date(),
      });
      navigate(`/ad/${adId}`);
    } catch (error) {
      console.error('Ошибка при создании объявления:', error);
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
        Создать объявление
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} className="glass" sx={{ p: 3, borderRadius: 'var(--radius)' }}>
        <TextField
          label="Заголовок"
          fullWidth
          sx={{ mb: 2, input: { color: 'var(--text)' }, label: { color: 'var(--muted)' } }}
          {...register('title', { required: 'Обязательное поле' })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          label="Описание"
          multiline
          rows={4}
          fullWidth
          sx={{ mb: 2, input: { color: 'var(--text)' }, label: { color: 'var(--muted)' } }}
          {...register('description', { required: 'Обязательное поле' })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          label="Цена (₽)"
          type="number"
          fullWidth
          sx={{ mb: 2, input: { color: 'var(--text)' }, label: { color: 'var(--muted)' } }}
          {...register('price', { required: 'Обязательное поле', min: 0 })}
          error={!!errors.price}
          helperText={errors.price?.message}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: 'var(--muted)' }}>Категория</InputLabel>
          <Select
            {...register('category', { required: 'Обязательное поле' })}
            sx={{ color: 'var(--text)', background: 'var(--bg-2)' }}
          >
            <MenuItem value="auto">Автомобили</MenuItem>
            <MenuItem value="realty">Недвижимость</MenuItem>
            <MenuItem value="clothes">Одежда</MenuItem>
            <MenuItem value="electronics">Электроника</MenuItem>
            <MenuItem value="services">Услуги</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Широта"
          type="number"
          fullWidth
          sx={{ mb: 2, input: { color: 'var(--text)' }, label: { color: 'var(--muted)' } }}
          {...register('lat')}
        />
        <TextField
          label="Долгота"
          type="number"
          fullWidth
          sx={{ mb: 2, input: { color: 'var(--text)' }, label: { color: 'var(--muted)' } }}
          {...register('lng')}
        />
        <TextField
          type="file"
          fullWidth
          sx={{ mb: 2 }}
          {...register('image')}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ background: 'var(--gradient)', color: 'var(--text)', fontWeight: 600 }}
          >
            Опубликовать
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  );
}

export default CreateAd;