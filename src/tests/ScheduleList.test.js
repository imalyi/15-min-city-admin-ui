import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../i18nTests';
import { I18nextProvider } from 'react-i18next';
import '@testing-library/jest-dom';
import ScheduleList from '../components/ScheduleList';

describe('ScheduleList', () => {
  const username = 'igor';
  const password = '343877';

  async function loginUser() {
    return fetch(`${process.env.REACT_APP_URL_ADMIN_API}users/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async response => {
        const data = await response.json();
        return data.access;
      })
      .catch(error => {
        setLoginError(error.message);
        throw error;
      });
  }

  it('ScheduleList render', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ScheduleList />
        </BrowserRouter>
      </I18nextProvider>
    );
  });

  it('should render the ship cards with fetched data', async () => {
    const token = await loginUser();

    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(),
        Authorization: `Bearer ${token}`,
      })
    );

    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ScheduleList />
        </BrowserRouter>
      </I18nextProvider>
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
