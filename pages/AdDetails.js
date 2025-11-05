import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';

function AdDetails() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const docRef = doc(db, 'ads', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAd({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('Объявление не найдено');
        }
      } catch (error) {
        console.error('Ошибка при загрузке объявления:', error);
      }
    };
    fetchAd();
  }, [id]);

  if (!ad) return <div>Загрузка...</div>;

  return (
    <div className="container">
      <Card className="card">
        <CardMedia
          component="img"
          height="300"
          image={ad.image || 'https://via.placeholder.com/300'}
          alt={ad.title}
        />
        <CardContent>
          <Typography variant="h5">{ad.title}</Typography>
          <Typography variant="h6">{ad.price} ₽</Typography>
          <Typography variant="body1">{ad.description}</Typography>
          <Typography variant="body2" color="text.secondary">
            Категория: {ad.category}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdDetails;