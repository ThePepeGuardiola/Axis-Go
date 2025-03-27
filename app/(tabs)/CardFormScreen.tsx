import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Pressable,
  ScrollView 
} from "react-native";
import { BottomNav } from "../components/Dashboard_Footer";
import { router } from "expo-router";

// Color combinations for card backgrounds
const cardColorCombinations = [
  { gradient1: "#900020", gradient2: "#FF809D" },
  { gradient1: "#0077BE", gradient2: "#4CB8C4" },
  { gradient1: "#8E44AD", gradient2: "#9B59B6" },
  { gradient1: "#27AE60", gradient2: "#2ECC71" },
  { gradient1: "#F39C12", gradient2: "#F1C40F" },
  { gradient1: "#16A085", gradient2: "#1ABC9C" },
  { gradient1: "#2C3E50", gradient2: "#34495E" }
];

// Card type recognition regex patterns
const cardPatterns = {
  visa: /^4/,
  mastercard: /^5[1-5]/,
  amex: /^3[47]/,
  discover: /^6(?:011|5)/
};

const CreditCardInput = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('');
  const [cardBackground, setCardBackground] = useState(cardColorCombinations[0]);

  // Refs for input focus tracking
  const cardNumberRef = useRef(null);
  const cardHolderRef = useRef(null);
  const expiryMonthRef = useRef(null);
  const expiryYearRef = useRef(null);
  const cvvRef = useRef(null);

  // State for tracking focused inputs
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Recognize card type
  const recognizeCardType = (number: string) => {
    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(number)) {
        return type;
      }
    }
    return '';
  };

  // Handle card number input
  const handleCardNumberChange = (text: string) => {
    // Remove non-numeric characters
    const cleanedText = text.replace(/\D/g, '');
    
    // Format with dashes
    const formattedText = cleanedText.replace(/(\d{4})/g, '$1-').trim();
    
    // Limit to 16 digits
    const limitedText = formattedText.slice(0, 19);
    
    setCardNumber(limitedText);
    setCardType(recognizeCardType(cleanedText));
  };

  // Handle expiry month input
  const handleExpiryMonthChange = (text: string) => {
    // Only allow numeric input, limit to 2 digits, max 12
    const cleanedText = text.replace(/\D/g, '');
    const limitedText = Math.min(Math.max(parseInt(cleanedText) || 0, 1), 12).toString().padStart(2, '0');
    setExpiryMonth(limitedText);
  };

  // Handle expiry year input
  const handleExpiryYearChange = (text: string) => {
    // Only allow numeric input, limit to 2 digits
    const cleanedText = text.replace(/\D/g, '');
    const limitedText = cleanedText.slice(0, 2);
    setExpiryYear(limitedText);
  };

  // Handle CVV input
  const handleCvvChange = (text: string) => {
    // Only allow numeric input, limit to 3-4 digits
    const cleanedText = text.replace(/\D/g, '');
    const limitedText = cleanedText.slice(0, 4);
    setCvv(limitedText);
  };

  // Choose a random card background on component mount
  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * cardColorCombinations.length);
    setCardBackground(cardColorCombinations[randomIndex]);
  }, []);

  // Function to get input style based on focus
  const getInputStyle = (inputName: string) => {
    return [
      styles.input,
      focusedInput === inputName && styles.inputFocused
    ];
  };

  // Function to get expiry input style based on focus
  const getExpiryInputStyle = (inputName: string) => {
    return [
      styles.expiryInput,
      focusedInput === inputName && styles.inputFocused
    ];
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.835 3.86998L16.055 2.09998L6.16504 12L16.065 21.9L17.835 20.13L9.70504 12L17.835 3.86998Z" fill="#0B0B0B"/>
        </svg>
      </Pressable>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View 
          style={[
            styles.cardContainer, 
            { 
              backgroundImage: `linear-gradient(244.80deg, ${cardBackground.gradient1} 30%, ${cardBackground.gradient2} 90%)` 
            }
          ]}
        >
          <Image source={require('@/assets/images/Axis_logo.png')} style={styles.brand}/>

          <Text style={styles.label}>Número de tarjeta</Text>
          <TextInput 
            ref={cardNumberRef}
            style={getInputStyle('cardNumber')} 
            placeholder="0000-0000-0000-0000" 
            placeholderTextColor="#ccc" 
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            maxLength={19}
            onFocus={() => setFocusedInput('cardNumber')}
            onBlur={() => setFocusedInput(null)}
          />

          <Text style={styles.label}>Nombre del titular</Text>
          <TextInput 
            ref={cardHolderRef}
            style={getInputStyle('cardHolder')} 
            placeholder="Juan Pérez" 
            placeholderTextColor="#ccc"
            maxLength={40}
            value={cardHolder}
            onChangeText={setCardHolder}
            onFocus={() => setFocusedInput('cardHolder')}
            onBlur={() => setFocusedInput(null)}
          />

          <View style={styles.row}>
            <View style={styles.expiration}>
              <Text style={styles.label}>Fecha de expiración</Text>
              <View style={styles.expiryRow}>
                <TextInput 
                  ref={expiryMonthRef}
                  style={getExpiryInputStyle('expiryMonth')} 
                  placeholder="MM" 
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  value={expiryMonth}
                  onChangeText={handleExpiryMonthChange}
                  maxLength={2}
                  onFocus={() => setFocusedInput('expiryMonth')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TextInput 
                  ref={expiryYearRef}
                  style={getExpiryInputStyle('expiryYear')} 
                  placeholder="AA" 
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  value={expiryYear}
                  onChangeText={handleExpiryYearChange}
                  maxLength={2}
                  onFocus={() => setFocusedInput('expiryYear')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>
            <View style={styles.cvvContainer}>
              <Text style={styles.label}>CVV/CVC</Text>
              <TextInput 
                ref={cvvRef}
                style={getInputStyle('cvv')} 
                placeholder="***" 
                placeholderTextColor="#ccc" 
                secureTextEntry
                keyboardType="numeric"
                value={cvv}
                onChangeText={handleCvvChange}
                maxLength={4}
                onFocus={() => setFocusedInput('cvv')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>  
          </View>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('./metPago')}
          >
            <Text style={styles.buttonText}>Agregar tarjeta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  cardContainer: {
    padding: 20,
    borderRadius: 10,
    width: 400,
  },
  brand: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    position: 'relative',
    left: '85%'
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "white",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "rgba(255,255,255,0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFocused: {
    borderColor: "rgba(255, 255, 255, 0.6)",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "rgba(255,255,255,0.5)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  expiration: {
    width: "50%",
  },
  expiryRow: {
    flexDirection: "row",
  },
  expiryInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 5,
    fontSize: 14,
    color: "white",
    width: 60,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "rgba(255,255,255,0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cvvContainer: {
    alignItems: "flex-end",
  },
  cvvInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "white",
    width: 100,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 15,
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreditCardInput;