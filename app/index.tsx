import { Redirect } from 'expo-router';

export default function Index() {
  // Esta página simplemente redirecciona según el estado de autenticación
  return <Redirect href="/Public/pantalla-inicial" />;
}