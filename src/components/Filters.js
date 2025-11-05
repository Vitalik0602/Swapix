// src/components/Filters.js
import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function Filters({ onFilter }) {
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ category, priceMin, priceMax });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass"
      sx={{ p: 3, borderRadius: 'var(--radius)' }}
    >
      <Typography variant="h6" sx={{ color: 'var(--text)', mb: 2, fontFamily: 'Montserrat' }}>
        Фильтры
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: 'var(--muted)' }}>Категория</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ color: 'var(--text)', background: 'var(--bg-2)' }}
          >
            <MenuItem value="">Все категории</MenuItem>
            <MenuItem value="auto">Автомобили</MenuItem>
            <MenuItem value="realty">Недвижимость</MenuItem>
            <MenuItem value="clothes">Одежда</MenuItem>
            <MenuItem value="electronics">Электроника</MenuItem>
            <MenuItem value="services">Услуги</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Минимальная цена"
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          fullWidth
          sx={{ mb: 2, input: { color: 'var(--text)' }, label: { color: 'var(--muted)' } }}
        />
        <TextField
          label="Максимальная цена"
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          fullWidth
          sx={{ mb: 2, input: { color: 'var(--text)' }, label: { color: 'var(--muted)' } }}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ background: 'var(--gradient)', color: 'var(--text)', fontWeight: 600 }}
          >
            Применить
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

export default Filters;