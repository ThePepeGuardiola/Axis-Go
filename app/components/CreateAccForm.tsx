import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Pressable, Modal, } from "react-native";
import { useRouter } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { useAlert } from '@/context/AlertContext'; 
import { AntDesign } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from 'react-native-calendars'; 

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
  const [gender, setGender] = useState<boolean | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5050';

  const [registroCompletado, setRegistroCompletado] = useState(false);
  const { showAlert } = useAlert();
  
  // Función de validación y registro
  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword || !birthdate || !gender) {
        showAlert("", "Todos los campos son obligatorios.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showAlert("","Las contraseñas no coinciden.","error");
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
            showAlert("","Registro exitoso. Verifica tu correo.","success");
            setRegistroCompletado(true);  // Marcamos que el registro fue exitoso
        } else {
            showAlert("",data.error || "Hubo un problema con el registro.","error");
        }
    } catch (error) {
        setLoading(false);
        showAlert("","No se pudo conectar con el servidor.", "error");
        console.error("❌ Error en fetch:", error);
    }
  };

  const handleDateSelect = (day: any) => {
    console.log("📅 Fecha seleccionada:", day.dateString);
    const selectedDate = day.dateString;

    setBirthdate(new Date(selectedDate).toLocaleDateString("CA-en"));

    setMarkedDates({
        [selectedDate]: {
            selected: true,
            selectedColor: '#900020',
            selectedTextColor: 'white'
        }
    });

    setTimeout(() => setShowCalendarModal(false), 300);
  };

  const openCalendar = () => {
    setShowCalendarModal(true);
  };

  // Efecto para redirigir cuando el registro es exitoso
  useEffect(() => {
    if (registroCompletado) {
        setTimeout(() => {
            router.replace("/VerificationScreen");
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
        if (data.birthdateRegistro) setBirthdate(data.birthdateRegistro);
        if (data.phoneRegistro) setPhone(data.phoneRegistro);
        if (data.country_codeRegistro) setCountry_code(data.country_codeRegistro);
        if (data.genderRegistro) setGender(data.genderRegistro === "true");
      } catch (error) {
        console.error("Error cargando datos del formulario:", error);
      }
    };
  
    cargarDatos();
  }, []);

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

        <View  style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '47%'}}>
          <Pressable onPress={openCalendar} style={inputStyles.input}>
            <Text style={{ color: "#777", fontSize: 16, paddingTop: 22, paddingLeft: 10 }}>
              {birthdate}
            </Text>
          </Pressable>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showCalendarModal}
          onRequestClose={() => setShowCalendarModal(false)}
        >
          <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowCalendarModal(false)}
          >
              <View style={styles.calendarModal}>
                  <Pressable style={styles.calendarContainer} onPress={e => e.stopPropagation()}>
                      <View style={styles.calendarHeader}>
                          <Text style={styles.calendarTitle}>Selecciona tu Fecha de Nacimiento</Text>
                          <Pressable onPress={() => setShowCalendarModal(false)} style={styles.closeButton}>
                              <AntDesign name="close" size={24} color="#333" />
                          </Pressable>
                      </View>
                      <Calendar
                          current={undefined}
                          minDate="1900-01-01"
                          maxDate={new Date().toISOString().split('T')[0]}
                          onDayPress={handleDateSelect}
                          markedDates={markedDates}
                          style={styles.calendar}
                          theme={{
                              backgroundColor: '#ffffff',
                              calendarBackground: '#ffffff',
                              textSectionTitleColor: '#333333',
                              textSectionTitleDisabledColor: '#d9e1e8',
                              selectedDayBackgroundColor: '#900020',
                              selectedDayTextColor: '#ffffff',
                              todayTextColor: '#900020',
                              dayTextColor: '#2d4150',
                              textDisabledColor: '#d9e1e8',
                              dotColor: '#900020',
                              selectedDotColor: '#ffffff',
                              arrowColor: '#900020',
                              disabledArrowColor: '#d9e1e8',
                              monthTextColor: '#333333',
                              indicatorColor: '#900020',
                              textDayFontWeight: '300',
                              textMonthFontWeight: 'bold',
                              textDayHeaderFontWeight: '600',
                              textDayFontSize: 16,
                              textMonthFontSize: 16,
                              textDayHeaderFontSize: 14
                          }}
                      />
                      <View style={styles.calendarActions}>
                          <Pressable
                              style={styles.calendarButton}
                              onPress={() => setShowCalendarModal(false)}
                          >
                              <Text style={styles.calendarButtonText}>Cerrar</Text>
                          </Pressable>
                      </View>
                  </Pressable>
              </View>
          </Pressable>
      </Modal>
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
    inputSearchStyle: { height: 40, fontSize: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    calendarModal: {
        width: '100%',
        maxWidth: 500,
        borderRadius: 16,
        overflow: 'hidden',
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    calendar: {
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 4,
        marginBottom: 10,
    },
    calendarActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    calendarButton: {
        backgroundColor: '#900020',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    webDateInput: {
        flex: 1,
        height: '100%',
        borderWidth: 0,
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#333',
        outline: 'none',
        fontFamily: 'inherit',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#bebebe',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
    }
});