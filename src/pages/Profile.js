// src/pages/Profile.js
import React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Typography, CircularProgress, Box, Button, Tabs, Tab } from '@mui/material';
import AdCard from '../components/AdCard';
import { motion } from 'framer-motion';

function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const tabValue = location.pathname.includes('/favorites') ? 'favorites' : location.pathname.includes('/messages') ? 'messages' : 'ads';

  // Запрос для получения объявлений пользователя
  const { data: ads = [], isLoading: adsLoading, error: adsError } = useQuery({
    queryKey: ['userAds', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const adsQuery = query(collection(db, 'ads'), where('userId', '==', user.uid));
      const adsSnapshot = await getDocs(adsQuery);
      return adsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!user,
  });

  // Мутация для удаления объявления
  const deleteAdMutation = useMutation({
    mutationFn: async (adId) => {
      await deleteDoc(doc(db, 'ads', adId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userAds', user?.uid]);
    },
    onError: (error) => {
      console.error('Ошибка при удалении объявления:', error);
      alert('Ошибка при удалении объявления');
    },
  });

  const handleDeleteAd = (adId) => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      deleteAdMutation.mutate(adId);
    }
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container"
      >
        <Typography variant="h6" sx={{ color: 'var(--text)', fontFamily: 'Montserrat', mb: 2 }}>
          Войдите в аккаунт, чтобы просматривать профиль
        </Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ background: 'var(--gradient)', color: 'var(--text)' }}
          >
            Войти
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (adsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: 'var(--accent)' }} />
      </Box>
    );
  }

  if (adsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Ошибка загрузки профиля: {adsError.message}</Typography>
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
      <Typography
        variant="h4"
        sx={{ color: 'var(--text)', mb: 3, fontFamily: 'Montserrat', fontWeight: 700 }}
      >
        Профиль
      </Typography>
      <Typography variant="h6" sx={{ color: 'var(--muted)', mb: 2 }}>
        {user.email}
      </Typography>
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => navigate(`/profile/${newValue}`)}
        sx={{
          mb: 3,
          '.MuiTab-root': { color: 'var(--muted)', fontFamily: 'Inter' },
          '.Mui-selected': { color: 'var(--accent)' },
          '.MuiTabs-indicator': { backgroundColor: 'var(--accent)' },
        }}
      >
        <Tab label="Мои объявления" value="ads" />
        <Tab label="Избранное" value="favorites" />
        <Tab label="Сообщения" value="messages" />
      </Tabs>
      {tabValue === 'ads' && (
        <Box>
          <Typography
            variant="h5"
            sx={{ color: 'var(--text)', mb: 3, fontFamily: 'Montserrat', fontWeight: 600 }}
          >
            Мои объявления
          </Typography>
          {ads.length > 0 ? (
            <Grid container spacing={2}>
              {ads.map((ad) => (
                <Grid item xs={12} sm={6} md={4} key={ad.id}>
                  <Box sx={{ position: 'relative' }}>
                    <AdCard ad={ad} />
                    <Box sx={{ position: 'absolute', top: 8, right: 48 }}>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(`/edit/${ad.id}`)}
                          sx={{ mr: 1, color: 'var(--accent)', borderColor: 'var(--accent)' }}
                        >
                          Редактировать
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleDeleteAd(ad.id)}
                          sx={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
                        >
                          Удалить
                        </Button>
                      </motion.div>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography sx={{ color: 'var(--muted)' }}>У вас нет объявлений</Typography>
          )}
        </Box>
      )}
    </motion.div>
  );
}

export default Profile;