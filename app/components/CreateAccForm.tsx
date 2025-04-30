import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { router, useRouter } from "expo-router";
import BirthdatePicker from '../../components/DateTime';

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
  { label: '+1', value: '+1' },
  { label: '+52', value: '+52' },
  { label: '+55', value: '+55' },
  { label: '+54', value: '+54' },
  { label: '+56', value: '+56' },
  { label: '+57', value: '+57' },
  { label: '+34', value: '+34' },
  { label: '+33', value: '+33' },
];

const data_1 = [
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Femenino', value: 'Femenino' },
  { label: 'Otro', value: 'Otro' },
];

// Formulario de registro
const SignupForm = () => {
  // Estados para los inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [phone, setPhone] = useState('');
  const [country_code, setCountry_code] = useState('');
  const [gender, setGender] = useState<boolean | null>(null);

  const router = useRouter();
  
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5050';

  const [registroCompletado, setRegistroCompletado] = useState(false);
  
  // Función de validación y registro
  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword || !birthdate || !gender) {
        alert("Error: " + "Todos los campos son obligatorios.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Error: " + "Las contraseñas no coinciden.");
        return;
    }

    const userData = {
        username, email, password, birthdate, phone: phone || null, country_code: country_code || null, gender
    };

    setLoading(true);

    try {
      await AsyncStorage.multiSet(
        Object.entries(userData).map(([key, value]) => {
          if (key === "birthdate" && value instanceof Date) {
            // Formateamos la fecha correctamente
            return [key + "Registro", value.toISOString().split('T')[0]];
          }
          return [key + "Registro", value ? value.toString() : ""];
        })
      );

      const response = await fetch(`${API_URL}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
      });

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            alert("Éxito: " + "Registro exitoso. Verifica tu correo.");
            setRegistroCompletado(true);  // Marcamos que el registro fue exitoso
        } else {
            alert("Error: " + data.message || "Hubo un problema con el registro.");
        }
    } catch (error) {
        setLoading(false);
        alert("Error: " + "No se pudo conectar con el servidor.");
    }
  };

  // Efecto para redirigir cuando el registro es exitoso
  useEffect(() => {
    if (registroCompletado) {
        setTimeout(() => {
          router.push("/(tabs)/VerificationScreen");
        }, 100);
    }
  }, [registroCompletado]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const keys = [
          "usernameRegistro",
          "emailRegistro",
          "birthdateRegistro",
          "phoneRegistro",
          "country_codeRegistro",
          "genderRegistro"
        ];
  
        const valores = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(valores);
  
        if (data.usernameRegistro) setUsername(data.usernameRegistro);
        if (data.emailRegistro) setEmail(data.emailRegistro);
        if (data.birthdateRegistro) { const date = new Date(data.birthdateRegistro);
          if (!isNaN(date.getTime())) {
            setBirthdate(date);
          } else {
            setBirthdate(undefined);
          }
        } else {
          setBirthdate(undefined);
        }
        if (data.phoneRegistro) setPhone(data.phoneRegistro);
        if (data.country_codeRegistro) setCountry_code(data.country_codeRegistro);
        if (data.genderRegistro) setGender(data.genderRegistro === "true");
      } catch (error: any) {
        alert("Error cargando datos del formulario: " + error);
      }
    };
  
    cargarDatos();
  }, []);

  // Función para formatear el input de telefono
  function formatPhoneNumber(value: string) {
    // Elimina todo lo que no sea número
    const cleaned = value.replace(/\D/g, '');
    // Aplica el formato ###-###-####
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    let formatted = match[1];
    if (match[2]) formatted += '-' + match[2];
    if (match[3]) formatted += '-' + match[3];
    return formatted;
  }

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
            setGender(item.value);
            }}
          />
        </View>

        <BirthdatePicker value={birthdate} onChange={setBirthdate} />
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
              onChangeText={text => setPhone(formatPhoneNumber(text))}
              keyboardType="numeric"
              placeholderTextColor="#777"
            />
          </View>
      </View>

      <TouchableOpacity style={buttonStyles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={buttonStyles.buttonText}>Registrarse</Text>}
      </TouchableOpacity>
    </FormContainer>
  );
};

// Componente de subtexto
const Subtext = () => {
  return (
    <View style={subtextStyles.container}>
      <TouchableOpacity onPress={() => router.push("/(tabs)/Login")}>
        <Text style={subtextStyles.textBold}>Ya tienes una cuenta</Text>
      </TouchableOpacity>
    </View>
  )
};

// Componente principal
const CreateAccForm = (props: any) => (
  <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 40, }}>
    <View style={{ height: 100, marginBottom: 30 }}>
      <SignupHeader />
    </View>
    <ScrollView>
      <SignupForm />
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