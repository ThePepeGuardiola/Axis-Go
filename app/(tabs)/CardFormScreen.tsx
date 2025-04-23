import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Pressable,
  ScrollView,
  Platform 
} from "react-native";
import { BottomNav } from "../components/Dashboard_Footer";
import { router, useLocalSearchParams } from "expo-router";

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

type CardType = 'visa' | 'mastercard' | 'amex' | 'discover';

const cardPatterns: Record<CardType, RegExp> = {
  visa: /^4/,
  mastercard: /^5[1-5]/,
  amex: /^3[47]/,
  discover: /^6(?:011|5)/
};

const cardTypeIcons: Record<CardType, any> = {
  visa: require('@/assets/images/visa.png'),
  mastercard: require('@/assets/images/Mastercard Logo.png'),
  amex: require('@/assets/images/amex-american-express.png'),
  discover: require('@/assets/images/discover.jpeg')
};

const CreditCardInput = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<CardType | ''>('');
  const [cardBackground, setCardBackground] = useState(cardColorCombinations[0]);
  const [isEditing, setIsEditing] = useState(false);

  // Get card ID from route params if editing
  const { cardId } = useLocalSearchParams();

  // Load card data if editing
  React.useEffect(() => {
    if (cardId) {
      // Mock data for editing
      const mockCard = {
        id: '1',
        number: '4111-1111-1111-1111',
        holder: 'Juan Pérez',
        expiryMonth: '12',
        expiryYear: '25',
        cvv: '123'
      };
      
      setCardNumber(mockCard.number);
      setCardHolder(mockCard.holder);
      setExpiryMonth(mockCard.expiryMonth);
      setExpiryYear(mockCard.expiryYear);
      setCvv(mockCard.cvv);
      setIsEditing(true);
    }
  }, [cardId]);

  // Choose a random card background on mount
  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * cardColorCombinations.length);
    setCardBackground(cardColorCombinations[randomIndex]);
  }, []);

  // Recognize card type
  const recognizeCardType = (number: string) => {
    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(number)) {
        return type as CardType;
      }
    }
    return '';
  };

  // Handle card number input
  const handleCardNumberChange = (text: string) => {
    const cleanedText = text.replace(/\D/g, '');
    const formattedText = cleanedText.replace(/(\d{4})/g, '$1-').trim();
    const limitedText = formattedText.slice(0, 19);
    setCardNumber(limitedText);
    setCardType(recognizeCardType(cleanedText));
  };

  // Handle card holder input
  const handleCardHolderChange = (text: string) => {
    const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
    const limitedText = cleanedText.slice(0, 40);
    setCardHolder(limitedText);
  };

  // Handle expiry month input
  const handleExpiryMonthChange = (text: string) => {
    const cleanedText = text.replace(/\D/g, '');
    const limitedText = Math.min(Math.max(parseInt(cleanedText) || 0, 1), 12).toString().padStart(2, '0');
    setExpiryMonth(limitedText);
  };

  // Handle expiry year input
  const handleExpiryYearChange = (text: string) => {
    const cleanedText = text.replace(/\D/g, '');
    const limitedText = cleanedText.slice(0, 2);
    setExpiryYear(limitedText);
  };

  // Handle CVV input
  const handleCvvChange = (text: string) => {
    const cleanedText = text.replace(/\D/g, '');
    const maxLength = cardType === 'amex' ? 4 : 3;
    const limitedText = cleanedText.slice(0, maxLength);
    setCvv(limitedText);
  };

  const handleSubmit = () => {
    if (isEditing) {
      console.log('Updating card:', { cardNumber, cardHolder, expiryMonth, expiryYear, cvv });
    } else {
      console.log('Adding new card:', { cardNumber, cardHolder, expiryMonth, expiryYear, cvv });
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.835 3.86998L16.055 2.09998L6.16504 12L16.065 21.9L17.835 20.13L9.70504 12L17.835 3.86998Z" fill="#0B0B0B"/>
        </svg>
      </Pressable>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.card, { backgroundColor: cardBackground.gradient1 }]}>
          <View style={styles.cardHeader}>
            {cardType && (
              <Image source={cardTypeIcons[cardType]} style={styles.cardTypeIcon} />
            )}
            <Image source={require('@/assets/images/Axis_logo.png')} style={styles.brandLogo} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de tarjeta</Text>
            <TextInput
              style={styles.input}
              placeholder="0000-0000-0000-0000"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              maxLength={19}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del titular</Text>
            <TextInput
              style={styles.input}
              placeholder="Juan Pérez"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={cardHolder}
              onChangeText={handleCardHolderChange}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.expiryContainer}>
              <Text style={styles.label}>Fecha de expiración</Text>
              <View style={styles.expiryRow}>
                <TextInput
                  style={styles.expiryInput}
                  placeholder="MM"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={expiryMonth}
                  onChangeText={handleExpiryMonthChange}
                  maxLength={2}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.expiryInput}
                  placeholder="YY"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={expiryYear}
                  onChangeText={handleExpiryYearChange}
                  maxLength={2}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.cvvContainer}>
              <Text style={styles.label}>CVV/CVC</Text>
              <TextInput
                style={styles.cvvInput}
                placeholder="***"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={cvv}
                onChangeText={handleCvvChange}
                maxLength={cardType === 'amex' ? 4 : 3}
                keyboardType="numeric"
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Actualizar tarjeta' : 'Agregar tarjeta'}
            </Text>
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTypeIcon: {
    width: 80,
    height: 65,
    resizeMode: 'contain',
  },
  brandLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  expiryContainer: {
    flex: 1,
    marginRight: 20,
  },
  expiryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  expiryInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    width: 70,
    textAlign: 'center',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  cvvContainer: {
    width: '40%',
  },
  cvvInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  submitButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreditCardInput;