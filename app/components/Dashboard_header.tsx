import React from 'react';
import { TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Componente de icono con botón
interface IconButtonProps {
    onPress: () => void;
    iconPath: string;
  }
interface IconButtonProps {
  onPress: () => void;
  iconPath: string;
}

export const IconButton1: React.FC<IconButtonProps> = ({ onPress }) => (
    <TouchableOpacity style={styles.iconPlaceholder} onPress={onPress}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15.75 10.5V6C15.75 3.92893 14.0711 2.25 12 2.25C9.92893 2.25 8.25 3.92893 8.25 6V10.5M19.606 8.50723L20.8692 20.5072C20.9391 21.1715 20.4183 21.75 19.7504 21.75H4.24963C3.58172 21.75 3.06089 21.1715 3.13081 20.5072L4.39397 8.50723C4.45424 7.93466 4.93706 7.5 5.51279 7.5H18.4872C19.0629 7.5 19.5458 7.93466 19.606 8.50723ZM8.625 10.5C8.625 10.7071 8.4571 10.875 8.25 10.875C8.04289 10.875 7.875 10.7071 7.875 10.5C7.875 10.2929 8.04289 10.125 8.25 10.125C8.4571 10.125 8.625 10.2929 8.625 10.5ZM16.125 10.5C16.125 10.7071 15.9571 10.875 15.75 10.875C15.5429 10.875 15.375 10.7071 15.375 10.5C15.375 10.2929 15.5429 10.125 15.75 10.125C15.9571 10.125 16.125 10.2929 16.125 10.5Z"
                stroke="black"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
    </TouchableOpacity>
  );
  
  export const IconButton2: React.FC<IconButtonProps> = ({ onPress, iconPath }) => (
      <TouchableOpacity style={styles.iconPlaceholder} onPress={onPress}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M14.8569 17.0817C16.7514 16.857 18.5783 16.4116 20.3111 15.7719C18.8743 14.177 17.9998 12.0656 17.9998 9.75V9.04919C17.9999 9.03281 18 9.01641 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9L5.9998 9.75C5.9998 12.0656 5.12527 14.177 3.68848 15.7719C5.4214 16.4116 7.24843 16.857 9.14314 17.0818M14.8569 17.0817C13.92 17.1928 12.9666 17.25 11.9998 17.25C11.0332 17.25 10.0799 17.1929 9.14314 17.0818M14.8569 17.0817C14.9498 17.3711 15 17.6797 15 18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18C9 17.6797 9.05019 17.3712 9.14314 17.0818"
                stroke="black"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
      </TouchableOpacity>
    );
  
  // Componente de barra superior
  export const TopBar = () => (
    <View style={styles.topBar}>
      <IconButton1 iconPath="M15.75 10.5V6C15.75 3.92893..." onPress={() => {
          }} />
  
      <TextInput style={styles.searchBar} placeholder="Buscar" />
  
      <IconButton2 iconPath="M14.8569 17.0817C16.7514 16.857 18.5783..." onPress={() => {
          }} />
    </View>
  );

  const styles = StyleSheet.create({
    topBar: { 
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 15,
        backgroundColor: '#fff'
        },
    searchBar: { 
        flex: 1, 
        marginHorizontal: 10, 
        padding: 10, 
        borderRadius: 10,
        backgroundColor: '#EFEFEF',
},
    iconPlaceholder: {
        padding: 10 
    }
    });

export default function DashboardHeader() {
  // ... existing component code ...
}
