import React, { CSSProperties, ReactNode, useState } from 'react';
import { View, StyleSheet, ViewStyle, Dimensions, KeyboardAvoidingView, Platform, Text, TouchableOpacity, Image, ScrollView } from 'react-native';

//Signup header component
const SignupHeader = () => {
    return (
        <>
            <View style={signupHeaderStyles.container}>
                <Text style={signupHeaderStyles.heading}>Create account</Text>
                <Text style={signupHeaderStyles.sudheading}>Crea una cuenta para que puedas explorar todas las rutas de transporte disponibles.</Text>
            </View>
        </>
    );
}

const signupHeaderStyles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: { 
        fontSize: 30, 
        fontWeight: 'bold', 
        color: '#900020' 
    },
    sudheading: {
        fontSize: 16, 
        textAlign: 'center', 
        paddingTop: 14,
        width: 330
    }
})

export { SignupHeader };

//From contariner component
interface FormContainerProps {
    children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
    return (
        <KeyboardAvoidingView enabled behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={formContainerStyles.container}>
            {children}
        </KeyboardAvoidingView>
    );
}

const formContainerStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        width: Dimensions.get('window').width
    }
});

export {FormContainer} ;

//Form input component
interface FormInputProps {
  placeholder: string;
}

const FormInput: React.FC<FormInputProps> = ({ placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Base styles without a border or outline.
  const baseStyle: CSSProperties = {
    backgroundColor: "#FFEEF1",
    height: "65px",
    borderRadius: "10px",
    fontSize: "16px",
    paddingLeft: "10px",
    marginBottom: "30px",
    border: "none",      // Remove any default border.
    outline: "none",     // Remove the default focus outline.
    transition: "outline .2s ease",
    width: "98%"
  };

  const focusedStyle: CSSProperties = {
    outline: "2px solid #900020"
  };

  // Merge styles conditionally.
  const combinedStyle = isFocused ? { ...baseStyle, ...focusedStyle } : baseStyle;

  return (
    <input
      type="text"
      placeholder={placeholder}
      style={combinedStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

export {FormInput} ;

//Password input component
interface PasswordProps {
    placeholder: string;
  }
  
  const FormInputPassword: React.FC<PasswordProps> = ({ placeholder }) => {
    // State to track whether the input is focused
    const [isFocused, setIsFocused] = useState(false);
    // State to track whether the password should be visible
    const [showPassword, setShowPassword] = useState(false);
  
    // Base styles without a border or outline.
    const baseStyle: CSSProperties = {
      backgroundColor: "#FFEEF1",
      height: "65px",
      borderRadius: "10px",
      fontSize: "16px",
      paddingLeft: "10px",
      marginBottom: "30px",
      border: "none",      // Remove any default border.
      outline: "none",     // Remove the default focus outline.
      transition: "outline .2s ease",
      width: "98%"
    };
  
    const focusedStyle: CSSProperties = {
      outline: "2px solid #900020"
    };
  
    // Merge styles conditionally.
    const combinedStyle = isFocused ? { ...baseStyle, ...focusedStyle } : baseStyle;
  
    // Toggle function to switch between showing and hiding the password
    const togglePasswordVisibility = () => {
      setShowPassword(prevState => !prevState);
    };

    //Icons for the password visibility toggle
    const EyeIconOpen = () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.0355 12.3224C1.96642 12.1151 1.96635 11.8907 2.03531 11.6834C3.42368 7.50972 7.36074 4.5 12.0008 4.5C16.6386 4.5 20.5742 7.50692 21.9643 11.6776C22.0334 11.8849 22.0334 12.1093 21.9645 12.3166C20.5761 16.4903 16.639 19.5 11.999 19.5C7.36115 19.5 3.42559 16.4931 2.0355 12.3224Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 12C15 13.6569 13.6568 15 12 15C10.3431 15 8.99995 13.6569 8.99995 12C8.99995 10.3431 10.3431 9 12 9C13.6568 9 15 10.3431 15 12Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );

    const EyeIconClosed = () => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.9799 8.22257C3.05679 9.31382 2.35239 10.596 1.93433 12.0015C3.22562 16.338 7.24308 19.5 11.9991 19.5C12.9916 19.5 13.952 19.3623 14.8622 19.1049M6.2276 6.22763C7.88385 5.13558 9.86768 4.5 11.9999 4.5C16.7559 4.5 20.7734 7.66205 22.0647 11.9985C21.3528 14.3919 19.8105 16.4277 17.772 17.772M6.2276 6.22763L2.99997 3M6.2276 6.22763L9.87865 9.87868M17.772 17.772L21 21M17.772 17.772L14.1213 14.1213M14.1213 14.1213C14.6642 13.5784 15 12.8284 15 12C15 10.3431 13.6568 9 12 9C11.1715 9 10.4215 9.33579 9.87865 9.87868M14.1213 14.1213L9.87865 9.87868" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );

    return (
      <div style={{ position: 'relative'}}>
        <input
          type={showPassword ? 'text' : 'password'}  // Dynamically set input type
          placeholder={placeholder}
          style={combinedStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {/* Button positioned inside the container */}
        <button
          onClick={togglePasswordVisibility}
          style={{
            position: 'absolute',
            right: '15px',
            top: '38%',
            transform: 'translateY(-50%)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#900020'
          }}
        >
          {showPassword ? <EyeIconClosed /> : <EyeIconOpen />}
        </button>
      </div>
    );
  };
  
  export { FormInputPassword };

//Submit button component
interface SubmitButtonProps {
    title: string;
    onPress: () => void;
}

const FormSubmitButton: React.FC<SubmitButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={buttonStyles.button} onPress={onPress}>
            <Text style={buttonStyles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const buttonStyles = StyleSheet.create({
    button: {
        backgroundColor: '#900020',
        height: 60,
        borderRadius: 10,
        boxShadow: '0px 10px 20px #FFB0C1',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'semibold'
    }
});

export {FormSubmitButton};


//Signup form component
const SignupForm = () => {
    return (
      <FormContainer>
        <FormInput placeholder="Email" />
        <FormInputPassword placeholder="Password" />
        <FormInputPassword placeholder="Confirm Password" />
        <FormSubmitButton title="Sign up" onPress={() => console.log('Send')} />
      </FormContainer>
    );
  };
  

const signupFormStyles = StyleSheet.create({
    
})

export {SignupForm} ;

//Subtext component
const Subtext = () => {
    return (
        <View style={subtexStyles.container}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#494949', paddingBottom: 40}}>Already have an account</Text>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#900020'}}>Or continue with</Text>
        </View>
    );
}

const subtexStyles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60
    },
});

export {Subtext} ;

//Account joiner component
const AccountJoiner = () => {
    return (
        <View style={styles.logoContainer}>
            <TouchableOpacity onPress={() => console.log('Google button pressed')}>
                <View style={[styles.logoWrapper]}>
                    <Image source={{ uri: 'https://loodibee.com/wp-content/uploads/Google-Symbol.png' }} style={styles.logo} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Facebook button pressed')}>
                <View style={[styles.logoWrapper]}>
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/480px-2023_Facebook_icon.svg.png' }} style={styles.logo} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Apple button pressed')}>
                <View style={[styles.logoWrapper]}>
                    <Image source={{ uri: 'https://1000logos.net/wp-content/uploads/2017/02/Apple-Logosu.png' }} style={styles.logo} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    logoWrapper: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#ECECEC',
        margin: 20
    },
    logo: {
        width: 40,
        height: 40,
    },
});

export {AccountJoiner} ;

//Overall component
const CreateAccForm = () => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{height: 100, marginBottom: 40}}>
                <SignupHeader />
            </View>
            <ScrollView>
                <SignupForm />
                <Subtext />
                <AccountJoiner />
            </ScrollView>
        </View>
    );
};

export default CreateAccForm;