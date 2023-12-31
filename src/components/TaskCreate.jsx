import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import './style/Categories.css';
import { useTranslation } from 'react-i18next';

function TaskCreate({ onTaskCreated }) {
  const [places, setPlace] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [apikey, setApiKey] = useState([]);
  const [coordinates, setCoordinates] = useState([]);

  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedApikey, setSelectedApiKey] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState('');

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [error, setError] = useState('');

  const { t } = useTranslation();

  const handleParentChange = (categoryName) => {
    const category = places.find((cat) => cat.category_name === categoryName);

    if (!category) {
      console.error(`Nie znaleziono kategorii o nazwie: ${categoryName}`);
      return;
    }

    const isCategorySelected = selectedCategories.includes(categoryName);
    const newSelectedCategories = isCategorySelected
      ? selectedCategories.filter((cat) => cat !== categoryName)
      : [...selectedCategories, categoryName];

    setSelectedCategories(newSelectedCategories);

    const newSelectedPlaces = isCategorySelected
      ? selectedPlaces.filter(
          (place) => !category.places.some((p) => p.id === place),
        )
      : [...new Set([...selectedPlaces, ...category.places.map((p) => p.id)])];

    setSelectedPlaces(newSelectedPlaces);
  };

  const handlePlaceChange = (placeId) => {
    const newSelectedPlaces = [...selectedPlaces];

    const index = newSelectedPlaces.indexOf(placeId);

    if (index !== -1) {
      newSelectedPlaces.splice(index, 1);
    } else {
      newSelectedPlaces.push(placeId);
    }

    setSelectedPlaces(newSelectedPlaces);
  };

  useEffect(() => {
    // Pobierz token z sessionStorage
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    // Sprawdź, czy token istnieje
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_ADMIN_API}gmaps/place/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`, // Dodaj token do nagłówka Authorization
            },
          },
        );
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setPlace(data);
          console.log(data);
        } else {
          console.error('Błąd pobierania danych z serwera');
        }
      } catch (error) {
        console.error('Błąd pobierania danych z serwera', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    // Pobierz token z sessionStorage
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    // Sprawdź, czy token istnieje

    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_ADMIN_API}gmaps/schedule/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`, // Dodaj token do nagłówka Authorization
            },
          },
        );
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setSchedule(data);
          console.log(data);
        } else {
          console.error('Błąd pobierania danych z serwera');
        }
      } catch (error) {
        console.error('Błąd pobierania danych z serwera', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    // Pobierz token z sessionStorage
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_ADMIN_API}gmaps/credential/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`, // Dodaj token do nagłówka Authorization
            },
          },
        );
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setApiKey(data);
        } else {
          console.error('Błąd pobierania danych z serwera');
        }
      } catch (error) {
        console.error('Błąd pobierania danych z serwera', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    // Pobierz token z sessionStorage
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);

    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_ADMIN_API}gmaps/coordinates/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`, // Dodaj token do nagłówka Authorization
            },
          },
        );
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setCoordinates(data);
          console.log(data);
        } else {
          console.error('Błąd pobierania danych z serwera');
        }
      } catch (error) {
        console.error('Błąd pobierania danych z serwera', error);
      }
    };

    fetchTasks();
  }, []);

  // ...

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      credentials: selectedApikey.id,
      coordinates: selectedCoordinates.id,
      schedule: selectedSchedule.id,
    };

    if (
      selectedPlaces.length === 0 ||
      !selectedApikey ||
      !selectedCoordinates ||
      !selectedSchedule
    ) {
      setError('Please fill in all required fields.');
    }

    try {
      const tokenRefreshString = localStorage.getItem('refreshToken');
      const userRefreshToken = JSON.parse(tokenRefreshString);

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

      if (responseToken.ok) {
        const data = await responseToken.json();
        localStorage.setItem('refreshToken', JSON.stringify(data.refresh));
        localStorage.setItem('token', JSON.stringify(data.access));
      } else {
        console.error('Błąd podczas refresh token');
      }

      if (
        selectedPlaces.length === 0 ||
        !selectedApikey ||
        !selectedCoordinates ||
        !selectedSchedule
      ) {
        setError('Please fill in all required fields.');
        return;
      }

      for (let i = 0; i < selectedPlaces.length; i++) {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        taskData.place = selectedPlaces[i];
        const taskResponse = await fetch(
          `${process.env.REACT_APP_URL_ADMIN_API}gmaps/task/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(taskData),
          },
        );

        if (taskResponse.ok) {
          setError('');
          console.log(
            `Pomyślnie utworzono zadanie dla place ${selectedPlaces[i]}`,
          );
        } else {
          console.error(
            `Błąd podczas tworzenia zadania dla place ${selectedPlaces[i]}`,
          );
          setError('Task already exists');
        }
      }
    } catch (error) {
      console.error('Błąd podczas komunikacji z serwerem', error);
    }
    onTaskCreated();
    setSelectedPlaces([]);
    setSelectedCoordinates('');
    setSelectedApiKey('');
    setSelectedSchedule('');
    setSelectedCategories([]);
  };

  return (
    <div style={{ width: '100%' }}>
      <p className="borderer">
        <h3 className="auto-center">{t('Create New Task')}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleFormSubmit}>
          <div className="column">
            <div className="checkbox-categories">
              {places.map((category) => (
                <div key={category.category_name}>
                  <FormControlLabel
                    label={category.category_name}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(
                          category.category_name,
                        )}
                        onChange={() =>
                          handleParentChange(category.category_name)
                        }
                      />
                    }
                  />
                  <div
                    className="checkbox-places"
                    style={{ marginLeft: '20px' }}
                  >
                    {category.places.map((place) => (
                      <FormControlLabel
                        key={place.id}
                        label={place.value}
                        control={
                          <Checkbox
                            checked={selectedPlaces.includes(place.id)}
                            onChange={() => handlePlaceChange(place.id)}
                          />
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Select
                label="Apikey"
                value={selectedApikey}
                onChange={(e) => setSelectedApiKey(e.target.value)}
                variant="outlined"
                style={{ width: '40%', marginRight: '20px' }}
                displayEmpty
                data-testid="select"
              >
                <MenuItem data-testid="select-option" value="" disabled>
                  {t('Choose an API key')}
                </MenuItem>
                {apikey.map((apikey) => (
                  <MenuItem
                    data-testid="select-option"
                    key={apikey.id}
                    value={apikey}
                  >
                    {apikey.name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                label="Coordinates"
                value={selectedCoordinates}
                onChange={(e) => setSelectedCoordinates(e.target.value)}
                variant="outlined"
                style={{ width: '40%', marginRight: '20px' }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  {t('Choose Coordinates')}
                </MenuItem>
                {coordinates.map((coordinates) => (
                  <MenuItem key={coordinates.id} value={coordinates}>
                    {coordinates.name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                label="Schedule"
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                variant="outlined"
                style={{ width: '40%', marginRight: '20px' }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  {t('Choose Schedule')}
                </MenuItem>
                {schedule.map((schedule) => (
                  <MenuItem key={schedule.id} value={schedule}>
                    {schedule.human_readable}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ backgroundColor: 'darkblue' }}
              >
                {t('Add Task')}
              </Button>
            </div>
          </div>
        </form>
      </p>
    </div>
  );
}

export default TaskCreate;
