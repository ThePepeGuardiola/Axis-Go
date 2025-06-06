import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '../config/routes';
import { useAuth } from '../context/Authcontext';

export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (isAuthenticated) {
      router.replace(ROUTES.AUTH.HOME as any);
    } else {
      router.replace(ROUTES.PUBLIC.LOGIN as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>Página no encontrada</Text>
      <Text style={styles.description}>
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
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
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 80,
    fontWeight: '800',
    color: '#900020',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#900020',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
