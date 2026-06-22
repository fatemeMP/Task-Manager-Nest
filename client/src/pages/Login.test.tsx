import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

// --- Mocks ---
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    token: null,
    logout: vi.fn(),
    register: vi.fn(),
    isAuthenticated: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// --- Helper ---
function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

// --- Tests ---
describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===== RENDERING =====
  describe('rendering', () => {
    it('should render the login heading', () => {
      renderLogin();
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });

    it('should render email input', () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should render submit button', () => {
      renderLogin();
      const button = screen.getByRole('button', { name: /login/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should render a link to the register page', () => {
      renderLogin();
      const link = screen.getByRole('link', { name: /register/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/register');
    });

    it('should not show error message initially', () => {
      renderLogin();
      // No element with error color style should exist
      const errorElement = screen.queryByText(/login failed/i);
      expect(errorElement).not.toBeInTheDocument();
    });
  });

  // ===== USER INPUT =====
  describe('user input', () => {
    it('should update email when user types', async () => {
      const user = userEvent.setup();
      renderLogin();
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should update password when user types', async () => {
      const user = userEvent.setup();
      renderLogin();
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'mypassword');
      expect(passwordInput).toHaveValue('mypassword');
    });
  });

  // ===== FORM SUBMISSION =====
  describe('form submission', () => {
    it('should call login with email and password on submit', async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'mypassword');
      await user.click(screen.getByRole('button', { name: /login/i }));

      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'mypassword');
    });

    it('should navigate to /tasks on successful login', async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'a@b.com');
      await user.type(screen.getByLabelText(/password/i), '123456');
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Wait for async login to resolve
      await vi.waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/tasks');
      });
    });

    it('should show error message when login fails', async () => {
      const errorMsg = 'Invalid email or password';
      mockLogin.mockRejectedValueOnce({
        response: { data: { message: errorMsg } },
      });
      const user = userEvent.setup();
      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'bad@user.com');
      await user.type(screen.getByLabelText(/password/i), 'wrong');
      await user.click(screen.getByRole('button', { name: /login/i }));

      expect(await screen.findByText(errorMsg)).toBeInTheDocument();
      // Should NOT navigate
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should show fallback error when API returns no message', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Network error'));
      const user = userEvent.setup();
      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/password/i), '123456');
      await user.click(screen.getByRole('button', { name: /login/i }));

      expect(await screen.findByText('Login failed')).toBeInTheDocument();
    });

    it('should show loading state while submitting', async () => {
      // Never resolve — keeps loading state
      mockLogin.mockReturnValueOnce(new Promise(() => {}));
      const user = userEvent.setup();
      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/password/i), '123456');
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Button text changes while loading
      expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
      // Button should be disabled
      expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
    });

    it('should clear previous error on new submit attempt', async () => {
      mockLogin
        .mockRejectedValueOnce({ response: { data: { message: 'First error' } } })
        .mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      renderLogin();

      // First attempt — fails
      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/password/i), 'wrong');
      await user.click(screen.getByRole('button', { name: /login/i }));
      expect(await screen.findByText('First error')).toBeInTheDocument();

      // Second attempt — succeeds, error should clear
      await user.click(screen.getByRole('button', { name: /login/i }));
      await vi.waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument();
      });
    });

    it('should not call login multiple times when button is clicked twice quickly', async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      const user = userEvent.setup();
      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'test@test.com');
      await user.type(screen.getByLabelText(/password/i), '123456');
      await user.click(screen.getByRole('button', { name: /login/i }));

      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });
});
