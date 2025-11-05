// src/pages/AdDetails.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth, realtimeDb } from '../firebase/firebase';
import { ref, push } from 'firebase/database';
import { Typography, Box, Button, CircularProgress, Grid } from '@mui/material';
import MapView from '../components/MapView';
import { motion } from 'framer-motion';

function AdDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const { data: ad, isLoading, error } = useQuery({
    queryKey: ['ad', id],
    queryFn: async () => {
      const adRef = doc(db, 'ads', id);
      const adSnap = await getDoc(adRef);
      if (!adSnap.exists()) {
        throw new Error('Объявление не найдено');
      }
      return { id: adSnap.id, ...adSnap.data() };
    },
  });

  const handleContactSeller = async () => {
    if (!user) {
      alert('Войдите в аккаунт, чтобы начать чат');
      navigate('/login');
      return;
    }
    const chatId = `${user.uid}_${ad.userId}_${id}`;
    const chatRef = ref(realtimeDb, `chats/${chatId}`);
    await push(chatRef, {
      senderId: user.uid,
      message: 'Здравствуйте, заинтересовало ваше объявление!',
      timestamp: Date.now(),
    });
    navigate('/profile/messages');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: 'var(--accent)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Ошибка: {error.message}</Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2, background: 'var(--gradient)', color: 'var(--text)' }}
          >
            Вернуться на главную
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="container"
    >
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          sx={{ color: 'var(--text)', fontFamily: 'Montserrat', mb: 2, fontWeight: 700 }}
        >
          {ad.title}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.img
              src={ad.imageUrl || '/images/no-image.png'}
              alt={ad.title}
              style={{ width: '100%', borderRadius: 'var(--radius)', objectFit: 'cover' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ color: 'var(--accent)', mb: 2, fontWeight: 700 }}>
              {ad.price.toLocaleString()} ₽
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--text)', mb: 2 }}>
              {ad.description}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted)', mb: 2 }}>
              Категория: {ad.category}
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={handleContactSeller}
                sx={{ background: 'var(--gradient)', color: 'var(--text)', fontWeight: 600, width: '100%' }}
              >
                Написать продавцу
              </Button>
            </motion.div>
          </Grid>
        </Grid>
        {ad.location && Array.isArray(ad.location) && ad.location.length === 2 && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              sx={{ color: 'var(--text)', mb: 2, fontFamily: 'Montserrat', fontWeight: 600 }}
            >
              Местоположение
            </Typography>
            <MapView ads={[ad]} center={ad.location} />
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

export default AdDetails;