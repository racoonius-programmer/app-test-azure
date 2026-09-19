import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

type RutaProtegidaProps = {
  children: ReactNode;
};

export default function RutaProtegida({ children }: RutaProtegidaProps) {
  const { accounts } = useMsal();

  if (accounts.length === 0) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
}