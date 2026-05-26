import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginPage from '../components/LoginPage';
import * as authModule from '../services/auth';

vi.mock('../services/auth');

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authModule.default.login = vi.fn();
  });

  const renderLoginPage = () => {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  };

  it('renders_formWithUsernamePasswordAndButton', () => {
    renderLoginPage();

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('showsError_whenLoginFails', async () => {
    const user = userEvent.setup();
    authModule.default.login.mockRejectedValue(new Error('Invalid username or password'));

    renderLoginPage();

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

  it('disablesButton_whileLoading', async () => {
    const user = userEvent.setup();
    authModule.default.login.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderLoginPage();

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
      expect(loginButton).toHaveTextContent('Logging in...');
    });
  });
});
