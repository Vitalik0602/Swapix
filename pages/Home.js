import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import AdCard from '../components/AdCard';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function Home() {
  const [ads, setAds] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const categories = ['Все', 'Электроника', 'Одежда', 'Автомобили', 'Недвижимость', 'Другое'];

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ads'));
        const adsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAds(adsData);
      } catch (error) {
        console.error('Ошибка при загрузке объявлений:', error);
      }
    };
    fetchAds();
  }, []);

  const filteredAds = ads.filter((ad) =>
    ad.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'Все' || category === '' || ad.category === category)
  );

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Поиск"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: '20px' }}
        />
        <FormControl style={{ minWidth: '200px' }}>
          <InputLabel>Категория</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="ad-grid">
        {filteredAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}

export default Home;