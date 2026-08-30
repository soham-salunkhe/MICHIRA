import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Returns a guard function.
 * Call `guard(destination)` on any nav action.
 * - If logged in  → navigates directly to `destination`
 * - If logged out → navigates to /login?redirect=<destination>
 */
export const useAuthGuard = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const guard = (destination: string) => {
    if (isLoggedIn) {
      navigate(destination);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(destination)}`);
    }
  };

  return guard;
};
