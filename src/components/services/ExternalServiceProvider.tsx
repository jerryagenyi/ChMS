import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

type ServiceType = 'auth' | 'payment' | 'storage';

interface ServiceContextType {
  connect: (service: ServiceType) => Promise<void>;
  disconnect: (service: ServiceType) => Promise<void>;
  isConnected: (service: ServiceType) => boolean;
  isLoading: boolean;
  error: Error | null;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

interface ExternalServiceProviderProps {
  service: ServiceType;
  children: React.ReactNode;
}

export const ExternalServiceProvider: React.FC<ExternalServiceProviderProps> = ({
  service,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectedServices, setConnectedServices] = useState<Set<ServiceType>>(new Set());
  const toast = useToast();

  const handleTokenRefresh = useCallback(async () => {
    try {
      const response = await fetch('/api/services/token/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { token } = await response.json();
      return token;
    } catch (err) {
      throw new Error('Token refresh failed');
    }
  }, [service]);

  const connect = useCallback(
    async (serviceType: ServiceType) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/services/${serviceType}/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired, try to refresh
            await handleTokenRefresh();
            // Retry the connection
            return connect(serviceType);
          }
          throw new Error(`Connection failed: ${response.statusText}`);
        }

        setConnectedServices(prev => new Set([...prev, serviceType]));
        toast({
          title: 'Connection successful',
          status: 'success',
          duration: 3000,
        });
      } catch (err) {
        setError(err as Error);
        toast({
          title: 'Connection failed',
          description: (err as Error).message,
          status: 'error',
          duration: 5000,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleTokenRefresh, toast]
  );

  const disconnect = useCallback(
    async (serviceType: ServiceType) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/services/${serviceType}/disconnect`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error(`Disconnection failed: ${response.statusText}`);
        }

        setConnectedServices(prev => {
          const next = new Set(prev);
          next.delete(serviceType);
          return next;
        });

        toast({
          title: 'Disconnection successful',
          status: 'success',
          duration: 3000,
        });
      } catch (err) {
        setError(err as Error);
        toast({
          title: 'Disconnection failed',
          description: (err as Error).message,
          status: 'error',
          duration: 5000,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const isConnected = useCallback(
    (serviceType: ServiceType) => connectedServices.has(serviceType),
    [connectedServices]
  );

  const value = {
    connect,
    disconnect,
    isConnected,
    isLoading,
    error,
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

export const useExternalService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useExternalService must be used within an ExternalServiceProvider');
  }
  return context;
};
