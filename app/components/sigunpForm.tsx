import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import FormContainer from "./FormContainer";
import FormInput from "./FormIpunt";
import FormSubmitButton from "./FormSubmitButtom";

const SignupForm = () => {
    return (
        <FormContainer>
            <FormInput placeholder="Email" />
            <FormInput placeholder="Password" />
            <FormInput placeholder="Confirm Password" />
            <FormSubmitButton title="Sign up" onPress={() => console.log('Send')} />
        </FormContainer>
    );
}

const styles = StyleSheet.create({
    
})

export default SignupForm;