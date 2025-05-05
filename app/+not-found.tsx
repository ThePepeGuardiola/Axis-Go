import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '../config/routes';
import { useAuth } from '../context/Authcontext';

export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (isAuthenticated) {
      router.replace(ROUTES.AUTH.HOME);
    } else {
      router.replace(ROUTES.PUBLIC.LOGIN);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>Página no encontrada</Text>
      <Text style={styles.description}>
        Lo sentimos, la ruta que estás buscando no existe o ha sido movida.
      </Text>
      <Pressable style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>
          Volver al {isAuthenticated ? 'inicio' : 'login'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#900020',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#900020',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 