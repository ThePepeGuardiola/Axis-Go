import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import Svg, { Path } from "react-native-svg";

/* ============================
   Componentes
   ============================ */

// Componente de cabecera del Signup
const SignupHeader = () => (
  <View style={signupHeaderStyles.container}>
    <Text style={signupHeaderStyles.heading}>Create account</Text>
    <Text style={signupHeaderStyles.subheading}>
      Crea una cuenta para que puedas explorar todas las rutas de transporte
      disponibles.
    </Text>
  </View>
);

// Contenedor para el formulario que maneja el teclado
const FormContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <KeyboardAvoidingView
    enabled
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    style={formContainerStyles.container}
  >
    {children}
  </KeyboardAvoidingView>
);

// Componente de entrada de texto
const FormInput: React.FC<{ placeholder: string }> = ({ placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseStyle = {
    backgroundColor: "#FFEEF1",
    height: 65,
    borderRadius: 10,
    fontSize: 16,
    paddingLeft: 10,
    marginBottom: 30,
    borderWidth: 0,
  };

  const focusedStyle = { borderWidth: 2, borderColor: "#900020" };

  const combinedStyle = isFocused ? { ...baseStyle, ...focusedStyle } : baseStyle;

  return (
    <TextInput
      placeholder={placeholder}
      style={combinedStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholderTextColor="#777"
    />
  );
};

// Componente de entrada para contraseñas con toggle de visibilidad
const FormInputPassword: React.FC<{ placeholder: string }> = ({
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const baseStyle = {
    backgroundColor: "#FFEEF1",
    height: 65,
    borderRadius: 10,
    fontSize: 16,
    paddingLeft: 10,
    marginBottom: 30,
    borderWidth: 0
  };

  const focusedStyle = { borderWidth: 2, borderColor: "#900020" };

  const combinedStyle = isFocused ? { ...baseStyle, ...focusedStyle } : baseStyle;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Ícono para mostrar la contraseña (ojo abierto)
  const EyeIconOpen = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.0355 12.3224C1.96642 12.1151 1.96635 11.8907 2.03531 11.6834C3.42368 7.50972 7.36074 4.5 12.0008 4.5C16.6386 4.5 20.5742 7.50692 21.9643 11.6776C22.0334 11.8849 22.0334 12.1093 21.9645 12.3166C20.5761 16.4903 16.639 19.5 11.999 19.5C7.36115 19.5 3.42559 16.4931 2.0355 12.3224Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 12C15 13.6569 13.6568 15 12 15C10.3431 15 8.99995 13.6569 8.99995 12C8.99995 10.3431 10.3431 9 12 9C13.6568 9 15 10.3431 15 12Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  // Ícono para ocultar la contraseña (ojo cerrado)
  const EyeIconClosed = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.9799 8.22257C3.05679 9.31382 2.35239 10.596 1.93433 12.0015C3.22562 16.338 7.24308 19.5 11.9991 19.5C12.9916 19.5 13.952 19.3623 14.8622 19.1049M6.2276 6.22763C7.88385 5.13558 9.86768 4.5 11.9999 4.5C16.7559 4.5 20.7734 7.66205 22.0647 11.9985C21.3528 14.3919 19.8105 16.4277 17.772 17.772M6.2276 6.22763L2.99997 3M6.2276 6.22763L9.87865 9.87868M17.772 17.772L21 21M17.772 17.772L14.1213 14.1213M14.1213 14.1213C14.6642 13.5784 15 12.8284 15 12C15 10.3431 13.6568 9 12 9C11.1715 9 10.4215 9.33579 9.87865 9.87868M14.1213 14.1213L9.87865 9.87868"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <View style={passwordInputStyles.container}>
      <TextInput
        secureTextEntry={!showPassword}
        placeholder={placeholder}
        style={[combinedStyle, { paddingRight: 40 }]} // espacio para el ícono
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#777"
      />
      <TouchableOpacity
        onPress={togglePasswordVisibility}
        style={passwordInputStyles.iconButton}
      >
        {showPassword ? <EyeIconClosed /> : <EyeIconOpen />}
      </TouchableOpacity>
    </View>
  );
};

// Botón para enviar el formulario
const FormSubmitButton: React.FC<{ title: string; onPress: () => void }> = ({
  title,
  onPress,
}) => (
  <TouchableOpacity style={buttonStyles.button} onPress={() => router.replace("/Login")}>
    <Text style={buttonStyles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// Formulario de registro que agrupa los inputs y el botón de envío
const SignupForm = () => (
  <FormContainer>
    <FormInput placeholder="Email" />
    <FormInputPassword placeholder="Password" />
    <FormInputPassword placeholder="Confirm Password" />
    <FormSubmitButton title="Sign up" onPress={() => console.log("Send")} />
  </FormContainer>
);

// Componente de subtexto
const Subtext = () => (
  <View style={subtextStyles.container}>
    <TouchableOpacity onPress={() => router.push('/Login')}>
          <Text style={subtextStyles.textBold}>Already have an account</Text>
    </TouchableOpacity>
    <Text style={subtextStyles.textAccent}>Or continue with</Text>
  </View>
);

// Componente para unir cuentas (botones de Google, Facebook y Apple)
const AccountJoiner = () => (
  <View style={accountJoinerStyles.logoContainer}>
    <TouchableOpacity onPress={() => console.log("Google button pressed")}>
      <View style={accountJoinerStyles.logoWrapper}>
        <Image
          source={{
            uri: "https://loodibee.com/wp-content/uploads/Google-Symbol.png",
          }}
          style={accountJoinerStyles.logo}
        />
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => console.log("Facebook button pressed")}>
      <View style={accountJoinerStyles.logoWrapper}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/480px-2023_Facebook_icon.svg.png",
          }}
          style={accountJoinerStyles.logo}
        />
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => console.log("Apple button pressed")}>
      <View style={accountJoinerStyles.logoWrapper}>
        <Image
          source={{
            uri: "https://1000logos.net/wp-content/uploads/2017/02/Apple-Logosu.png",
          }}
          style={accountJoinerStyles.logo}
        />
      </View>
    </TouchableOpacity>
  </View>
);

// Componente general que engloba todos los anteriores
const CreateAccForm = () => (
  <View style={{ flex: 1 }}>
    <View style={{ height: 100, marginBottom: 40 }}>
      <SignupHeader />
    </View>
    <ScrollView>
      <SignupForm />
      <Subtext />
      <AccountJoiner />
    </ScrollView>
  </View>
);

export default CreateAccForm;

/* ============================
   Objetos de estilos
   ============================ */

const signupHeaderStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#900020",
  },
  subheading: {
    fontSize: 16,
    textAlign: "center",
    paddingTop: 14,
    width: 330,
  },
});

const formContainerStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: Dimensions.get("window").width,
  },
});

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: "#900020",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#FFB0C1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
});

const subtextStyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  textBold: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#494949",
    paddingBottom: 40,
  },
  textAccent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#900020",
  },
});

const accountJoinerStyles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  logoWrapper: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ECECEC",
    margin: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
});

// Estilos para el contenedor del input de contraseña y el botón de visibilidad
const passwordInputStyles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  iconButton: {
    position: "absolute",
    right: 15,
    top: "25%",
  },
});
