import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, } from "react-native";
import { useRouter } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';

/* ============================
    Componentes
   ============================ */

// Componente de cabecera del Signup
const SignupHeader = () => (
  <View style={signupHeaderStyles.container}>
    <Text style={signupHeaderStyles.heading}>Crear cuenta</Text>
    <Text style={signupHeaderStyles.subheading}>
      Crea una cuenta para que puedas explorar todas las rutas de transporte disponibles.
    </Text>
  </View>
);

// Contenedor para el formulario
const FormContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <KeyboardAvoidingView
    enabled
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    style={formContainerStyles.container}
  >
    {children}
  </KeyboardAvoidingView>
);

const data = [
  { label: '+1 (US)', value: 'Estados Unidos' },
  { label: '+1 (CA)', value: 'Canadá' },
  { label: '+52 (MX)', value: 'México' },
  { label: '+55 (BR)', value: 'Brasil' },
  { label: '+54 (AR)', value: 'Argentina' },
  { label: '+56 (CL)', value: 'Chile' },
  { label: '+57 (CO)', value: 'Colombia' },
  { label: '+34 (ESP)', value: 'España' },
  { label: '+33 (FR)', value: 'Francia' },
  { label: '+1 (RD)', value: 'República Dominicana' },
];

const data_1 = [
  { label: 'Hombre', value: true },
  { label: 'Mujer', value: false },
];

type VerificationScreenRouteProp = RouteProp<{ SignupForm: { email: string } }, 'SignupForm'>;
type VerificationScreenNavigationProp = StackNavigationProp<any>;

// Formulario de registro
const SignupForm = ({ route, navigation }: { route: VerificationScreenRouteProp, navigation: VerificationScreenNavigationProp }) => {
  const router = useRouter();
  
  // Estados para los inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [country_code, setCountry_code] = useState('');
  const [gender, setGender] = useState('');
  
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5050';

  const [registroCompletado, setRegistroCompletado] = useState(false);
  
  // Función de validación y registro
  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword || !birthdate || !gender) {
        Alert.alert("Error", "Todos los campos son obligatorios.");
        return;
    }

    if (password !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden.");
        return;
    }

    const userData = {
        username, email, password, birthdate, phone: phone || null, country_code: country_code || null, gender
    };

    setLoading(true);

    try {
        await AsyncStorage.multiSet(
          Object.entries(userData).map(([key, value]) => [
            key + "Registro",
            value ? value.toString() : ""
          ])
        );

      // Verificar si los datos se guardaron correctamente
      const checkStorage = await AsyncStorage.multiGet([
        "emailRegistro",
        "passwordRegistro",
        "usernameRegistro",
        "birthdateRegistro",
        "phoneRegistro",
        "country_codeRegistro",
        "genderRegistro"
      ]);

      console.log(checkStorage)

      const response = await fetch(`${API_URL}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
      });

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            Alert.alert("Éxito", "Registro exitoso. Verifica tu correo.");
            await AsyncStorage.multiSet(Object.entries(userData).map(([key, value]) => [key + "Registro", value ? value.toString() : ""]));
            setRegistroCompletado(true);  // Marcamos que el registro fue exitoso
        } else {
            Alert.alert("Error", data.message || "Hubo un problema con el registro.");
        }
    } catch (error) {
        setLoading(false);
        Alert.alert("Error", "No se pudo conectar con el servidor.");
        console.error("❌ Error en fetch:", error);
    }
  };

  // Efecto para redirigir cuando el registro es exitoso
  useEffect(() => {
    if (registroCompletado) {
        setTimeout(() => {
            router.replace("/VerificationScreen");
        }, 100);
    }
  }, [registroCompletado]);

  return (
    <FormContainer >
      <TextInput
        placeholder="Usuario"
        style={inputStyles.input}
        value={username}
        onChangeText={setUsername}
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="Email"
        style={inputStyles.input}
        value={email} // Vinculamos el valor del input con el estado 'email'
        onChangeText={setEmail} // Actualizamos el estado cuando el texto cambia
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#777"
      />

      <View style={inputStyles.container}>
        <View style={inputStyles.subContainer_1}>
          <TextInput
            placeholder="Contraseña"
            style={inputStyles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#777"
          />
        </View>

        <View style={inputStyles.subContainer_2}>
          <TextInput
            placeholder="Confirmar pass."
            style={inputStyles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#777"
          />
        </View>
      </View>

      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap'}}>
        <View style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginVertical: 5, marginRight: 5, width: '47%'}}>
          <Dropdown
            style={styles.dropdown_1}
            placeholderStyle={{ color: "#777", ...styles.placeholderStyle }}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            value={gender}
            data={data_1}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Género"
            searchPlaceholder="Search..."
            onChange={item => {
            setGender(item.label);
            }}
          />
        </View>

        <View  style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '47%'}}>
          <TextInput
            placeholder="Nacimiento"
            style={inputStyles.input}
            value={birthdate}
            onChangeText={setBirthdate}
            keyboardType="numeric"
            autoCapitalize="none"
            placeholderTextColor="#777"
          />
        </View>
      </View>

      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap'}}>
          <View style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginVertical: 5, marginRight: 5, width: '47%'}}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={{ color: "#777", ...styles.placeholderStyle }}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                value={country_code}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Código"
                searchPlaceholder="Search..."
                onChange={item => {
                setCountry_code(item.label);
                }}
              />
          </View>

          <View  style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '47%'}}>
            <TextInput
              placeholder="Número tel."
              style={inputStyles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="numeric"
              placeholderTextColor="#777"
            />
          </View>
      </View>

      <TouchableOpacity style={buttonStyles.button} onPress={handleSignup}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={buttonStyles.buttonText}>Registrarse</Text>}
      </TouchableOpacity>
    </FormContainer>
  );
};

// Componente de subtexto
const Subtext = () => (
  <View style={subtextStyles.container}>
    <TouchableOpacity onPress={() => router.push("/Login")}>
      <Text style={subtextStyles.textBold}>Ya tienes una cuenta</Text>
    </TouchableOpacity>
  </View>
);

// Componente principal
const CreateAccForm = ({ route, navigation }: { route: VerificationScreenRouteProp, navigation: VerificationScreenNavigationProp }) => (
  <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 40, }}>
    <View style={{ height: 100, marginBottom: 30 }}>
      <SignupHeader />
    </View>
    <ScrollView>
      <SignupForm route={route} navigation={navigation} />
      <Subtext />
    </ScrollView>
  </View>
);

export default CreateAccForm;

/* ============================
  Estilos
   ============================ */

const signupHeaderStyles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 35, fontWeight: "800", color: "#900020" },
  subheading: { fontSize: 16, textAlign: "center", fontWeight: '600', paddingTop: 14, width: 330 },
});

const formContainerStyles = StyleSheet.create({
  container: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, width: '100%' },
});

const inputStyles = StyleSheet.create({
  input: { backgroundColor: "#FFEEF1", height: 65, borderRadius: 10, fontSize: 16, paddingHorizontal: 20, marginVertical: 10, borderWidth: 0, width: '100%' },
  container: { display: 'flex', flexDirection: "row", justifyContent: "space-between", width: '100%', },
  subContainer_1: { width: '47%' },
  subContainer_2: { width: '47%' },
});

const buttonStyles = StyleSheet.create({
  button: { backgroundColor: "#900020", height: 60, width: '100%', borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 20, shadowColor: "#FFB0C1", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 5 },
  buttonText: { color: "#FFFFFF", fontSize: 25, fontWeight: "700" },
});

const subtextStyles = StyleSheet.create({
  container: { display: 'flex', flexDirection: 'column', justifyContent: "space-between", alignItems: "center", height: 60, paddingVertical: 5, marginVertical: 20, width: '100%', },
  textBold: { fontSize: 16, fontWeight: "600", color: "gray", paddingBottom: 20 },
  textAccent: { fontSize: 16, fontWeight: "600", color: "#900020" },
});

const styles = StyleSheet.create({
    dropdown: { height: 65, width: '100%', backgroundColor: '#FFEEF1', borderRadius: 10, paddingHorizontal: 20 },
    dropdown_1: { height: 65, width: '100%', backgroundColor: '#FFEEF1', borderRadius: 10, paddingHorizontal: 20 },
    icon: { marginRight: 10 },
    item: { padding: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    textItem: { flex: 1, fontSize: 16 },
    placeholderStyle: { fontSize: 16 },
    selectedTextStyle: { fontSize: 16 },
    iconStyle: { width: 20, height: 20 },
    inputSearchStyle: { height: 40, fontSize: 16 }
});