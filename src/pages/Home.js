// src/pages/Home.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import AdCard from '../components/AdCard';
import CategoryCard from '../components/CategoryCard';
import Filters from '../components/Filters';
import SearchBar from '../components/SearchBar';
import { motion } from 'framer-motion';

function Home() {
  const categories = [
    { id: 'auto', name: 'Автомобили', image: '/images/auto.png' },
    { id: 'realty', name: 'Недвижимость', image: '/images/realty.png' },
    { id: 'clothes', name: 'Одежда', image: '/images/clothes.png' },
    { id: 'electronics', name: 'Электроника', image: '/images/electronics.png' },
    { id: 'services', name: 'Услуги', image: '/images/services.png' },
  ];

  const fetchAds = async () => {
    const querySnapshot = await getDocs(collection(db, 'ads'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ['ads'],
    queryFn: fetchAds,
  });

  const handleFilter = (filters) => {
    console.log('Фильтры:', filters);
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
        <Typography color="error">Ошибка загрузки объявлений: {error.message}</Typography>
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
      <SearchBar />
      <Typography
        variant="h5"
        sx={{ color: 'var(--text)', mb: 3, fontFamily: 'Montserrat', fontWeight: 600 }}
      >
        Категории
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {categories.map((category) => (
          <Grid item xs={6} sm={4} md={2} key={category.id}>
            <CategoryCard category={category} image={category.image} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Filters onFilter={handleFilter} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography
            variant="h5"
            sx={{ color: 'var(--text)', mb: 3, fontFamily: 'Montserrat', fontWeight: 600 }}
          >
            Объявления
          </Typography>
          <Grid container spacing={2}>
            {ads.length > 0 ? (
              ads.map((ad) => (
                <Grid item xs={12} sm={6} md={4} key={ad.id}>
                  <AdCard ad={ad} />
                </Grid>
              ))
            ) : (
              <Typography sx={{ color: 'var(--muted)' }}>Объявления не найдены</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </motion.div>
  );
}

export default Home;