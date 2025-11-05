import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { db, storage } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase/firebase';

function AdForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const categories = ['Электроника', 'Одежда', 'Автомобили', 'Недвижимость', 'Другое'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('Пожалуйста, войдите в систему');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const adData = {
        title,
        description,
        price: parseFloat(price),
        category,
        image: imageUrl,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'ads'), adData);
      onSubmit({ id: docRef.id, ...adData });
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage(null);
    } catch (error) {
      console.error('Ошибка при создании объявления:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <TextField
        label="Заголовок"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Описание"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <TextField
        label="Цена (₽)"
        fullWidth
        margin="normal"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Категория</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ margin: '16px 0' }}
      />
      <Button type="submit" variant="contained" color="primary">
        Создать объявление
      </Button>
    </form>
  );
}

export default AdForm;