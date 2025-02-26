// HomeScreen.tsx
import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { WeatherSection, Categories, RecentSection, Welcome } from '../components/Dashboard';
import { TopBar } from '../components/Dashboard_header';
import { BottomNav } from '../components/Dashboard_Footer';

const HomeScreen: React.FC = () => {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <WeatherSection />
          <Categories />
          <RecentSection />
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  };
  

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFC1CF' 
},
  contentContainer: { padding: 20 },
});

export default HomeScreen;
