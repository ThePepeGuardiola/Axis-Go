import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'session_token';

// Guardar el session_token en el almacenamiento local
export const saveSessionToken = async (token) => {
    try {
        await AsyncStorage.setItem(SESSION_KEY, token);
    } catch (error) {
        console.error("Error al guardar el token de sesión:", error);
    }
};

// Obtener el session_token almacenado
export const getSessionToken = async () => {
    try {
        return await AsyncStorage.getItem(SESSION_KEY);
    } catch (error) {
        console.error("Error al obtener el token de sesión:", error);
        return null;
    }
};

// Eliminar el session_token del almacenamiento local (cerrar sesión)
export const clearSessionToken = async () => {
    try {
        await AsyncStorage.removeItem(SESSION_KEY);
    } catch (error) {
        console.error("Error al eliminar el token de sesión:", error);
    }
};

// Verificar si el token es válido en el backend
export const validateSession = async () => {
    const token = await getSessionToken();
    if (!token) return { isAuthenticated: false, isVerified: false }; // No hay sesión

    try {
        const response = await fetch("http://localhost:5050/api/validate-session", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            await clearSessionToken();
            return { isAuthenticated: false, isVerified: false };
        }

        const data = await response.json();
        return {
            isAuthenticated: data.valid, // Si el token es válido
            isVerified: data.is_verified // Si la cuenta está verificada
        };
    } catch (error) {
        console.error("Error al validar la sesión:", error);
        return { isAuthenticated: false, isVerified: false };
    }
};

// Cerrar sesión
export const logout = async () => {
    const token = await getSessionToken();
    if (!token) return;

    try {
        await fetch("http://localhost:5050/api/logout", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }

    await clearSessionToken();
};