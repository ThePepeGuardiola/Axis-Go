import React, { useState } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  Pressable, 
  Modal, 
  TouchableOpacity 
} from "react-native";
import { BottomNav } from "../components/Dashboard_Footer";
import { router } from "expo-router";

const MetPago = () => {
  const [selectedCard, setSelectedCard] = useState<{ id: string; number: string; holder: string } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock card data (in a real app, this would come from state management or backend)
  const [cards, setCards] = useState([
    { id: '1', number: '4111-1111-1111-1111', holder: 'Juan Pérez' },
    { id: '2', number: '5500-0000-0000-0004', holder: 'María González' }
  ]);

  const handleCardPress = (card: React.SetStateAction<{ id: string; number: string; holder: string; } | null>) => {
    setSelectedCard(card);
    setIsModalVisible(true);
  };

  const handleRemoveCard = () => {
    if (selectedCard) {
      setCards(cards.filter(card => card.id !== selectedCard.id));
      setIsModalVisible(false);
    }
  };

  const handleEditCard = () => {
    // Navigate to edit card screen with selected card details
    if (selectedCard) {
      router.push({
        pathname: '/CardFormScreen',
        params: { cardId: selectedCard.id }
      });
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.835 3.86998L16.055 2.09998L6.16504 12L16.065 21.9L17.835 20.13L9.70504 12L17.835 3.86998Z" fill="#0B0B0B"/>
        </svg>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Tú cartera</Text>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push('/CardFormScreen')}
        >
          <Text style={styles.addButtonText}>+ Agregar tarjeta</Text>
        </Pressable>
        
        {cards.map((card) => (
          <Pressable 
            key={card.id} 
            style={styles.cardItem}
            onPress={() => handleCardPress(card)}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardHolder}>{card.holder}</Text>
              <Text style={styles.cardNumber}>{card.number}</Text>
            </View>
            <View style={styles.cardActions}>
              <Text style={styles.editText}>Editar</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Modal for card actions */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleEditCard}
            >
              <Text style={styles.modalButtonText}>Editar Tarjeta</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.removeButton]}
              onPress={handleRemoveCard}
            >
              <Text style={styles.modalButtonText}>Eliminar Tarjeta</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  back: {
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#900020",
  },
  addButton: {
    backgroundColor: "#900020",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardItem: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInfo: {
    flex: 1,
  },
  cardHolder: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardNumber: {
    fontSize: 14,
    color: "#666",
  },
  cardActions: {
    marginLeft: 10,
  },
  editText: {
    color: "#900020",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#900020',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#FF0000',
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: '#900020',
    fontWeight: 'bold',
  },
});

export default MetPago;