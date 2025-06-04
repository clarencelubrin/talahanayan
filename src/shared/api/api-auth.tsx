import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { api } from './api-route';
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  token: string | null | undefined;
  logIn: (urlencoded: URLSearchParams) => Promise<boolean>;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const refreshToken = async () => {
  const response = await api.post("/refresh-token", null, { withCredentials: true });
  return response.data;
};


export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshToken,
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    if (token === null) { 
      navigate('/login');
    }
  }, [token]);
  // Set up the interceptor once, and use current token
  useLayoutEffect(() => {
    const interceptor = api.interceptors.request.use((config: any) => {
      if (token && !config._retry) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Request made with token:', token);
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Prevent concurrent refreshes by tracking the refresh promise
  useLayoutEffect(() => {
    let refreshPromise: Promise<any> | null = null;

    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        console.log('>> Error in response:', error, 'for request:', originalRequest.url);

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== '/refresh-token'
        ) {
          originalRequest._retry = true;

          try {
            if (!refreshPromise) {
              refreshPromise = refreshToken().then((data) => {
                return data;
              }).catch((err) => {
                throw err;
              }).finally(() => {
                // Clear the refresh promise when done
                refreshPromise = null;
              });
            }
            const newAccessToken = (await refreshPromise).access_token;
            setToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (err) {
            console.error("Refresh token failed", err);
            setToken(null);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);
  const logIn = async (urlencoded: URLSearchParams) => {
    try {
      const response = await api.post('/token', urlencoded, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true, // Ensure cookies are sent
      });
      const newToken = response.data.access_token;
      setToken(newToken);
      return true;
    } catch {
      setToken(null);
      return false;
    }
  };

  const logOut = async () => {
    await api.post('/logout', null, {
      withCredentials: true, // Ensure cookies are sent
    }).then(() => {
      console.log('Logged out successfully');
    }
    ).catch((error) => {
      console.error('Logout failed:', error);
    });
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
