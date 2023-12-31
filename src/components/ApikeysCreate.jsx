import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './style/Categories.css';
import { useTranslation } from 'react-i18next';

function ApikeysCreate({ onApiCreated }) {
  const [newNameApi, setNewNameApi] = useState('');
  const [newTokenApi, setNewTokenApi] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Pobierz token z sessionStorage

    // Sprawdź, czy token istnieje

    // Przygotuj dane do wysłania na serwer
    const apiData = {
      token: newTokenApi,
      name: newNameApi,
    };

    if (newTokenApi.length !== 39 || !/^[A-Za-z0-9_-]+$/.test(newTokenApi)) {
      setError(
        'Token must be exactly 39 characters long and consist of letters, numbers, "_" and "-"',
      );
      return;
    } else {
      setError('');
    }

    try {
      const tokenRefreshString = localStorage.getItem('refreshToken');
      const userRefreshToken = JSON.parse(tokenRefreshString);

      const tokenString = localStorage.getItem('token');
      const userToken = JSON.parse(tokenString);

      const tokenRefresh = {
        refresh: userRefreshToken,
      };

      const responseToken = await fetch(
        `${process.env.REACT_APP_URL_ADMIN_API}users//token/refresh/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tokenRefresh),
        },
      );

      console.log(responseToken);
      if (responseToken.ok) {
        const data = await responseToken.json();
        localStorage.setItem('refreshToken', JSON.stringify(data.refresh));
        localStorage.setItem('token', JSON.stringify(data.access));
      } else {
        console.error('Błąd podczas refresh token');
      }

      const response = await fetch(
        `${process.env.REACT_APP_URL_ADMIN_API}gmaps/credential/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`, // Dodaj token do nagłówka Authorization
          },
          body: JSON.stringify(apiData), // Zamień dane na format JSON
        },
      );

      if (response.ok) {
        // Wysłano z powodzeniem
        console.log('Pomyślnie utworzono klucz API.');
        // Możesz również zaktualizować stan lub zresetować pola formularza
        onApiCreated();
        setNewNameApi('');
        setNewTokenApi('');
      } else {
        console.error('Błąd podczas tworzenia klucza API.');
      }
    } catch (error) {
      console.error('Błąd podczas komunikacji z serwerem', error);
    }
  };

  return (
    <div>
      <p className="borderer">
        <h3 className="auto-center">{t('New Api Key')}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleFormSubmit}>
          <TextField
            label={t('Api Name')}
            multiline
            rows={1}
            variant="outlined"
            value={newNameApi}
            onChange={(e) => setNewNameApi(e.target.value)}
            className="margin-right"
            style={{ marginRight: '20px' }}
          />
          <TextField
            label={t('Token')}
            multiline
            rows={1}
            variant="outlined"
            value={newTokenApi}
            onChange={(e) => setNewTokenApi(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{
              margin: '1% auto 0',
              backgroundColor: 'darkblue',
              marginLeft: '30px',
            }}
          >
            {t('Add Api Key')}
          </Button>
        </form>
      </p>
    </div>
  );
}

export default ApikeysCreate;
