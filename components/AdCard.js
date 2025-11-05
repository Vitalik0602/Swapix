import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

function AdCard({ ad }) {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="150"
        image={ad.image || 'https://via.placeholder.com/150'}
        alt={ad.title}
      />
      <CardContent>
        <Typography variant="h6">{ad.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {ad.price} ₽
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ad.category}
        </Typography>
        <Link to={`/ad/${ad.id}`}>Подробнее</Link>
      </CardContent>
    </Card>
  );
}

export default AdCard;