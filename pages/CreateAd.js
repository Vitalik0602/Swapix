import React from 'react';
import AdForm from '../components/AdForm';
import { useNavigate } from 'react-router-dom';

function CreateAd() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Создать объявление</h2>
      <AdForm onSubmit={handleSubmit} />
    </div>
  );
}

export default CreateAd;