import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { NavButton1, NavButton2, NavButton3 } from './Dashboard';
import { router } from 'expo-router';

// Barra de navegación inferior
export const BottomNav = () => (
    <View style={styles.bottomNav}>
      <NavButton1 onPress={() => {router.push('/home')}} iconPath="M2.92542 14.8235L13.3723 4.37659C13.8849 3.86403..." width={29} height={29} />
      <NavButton2 onPress={() => {}} iconPath="M13.6945 4.90534C13.9187 4.36637..." width={29} height={29} />
      <TouchableOpacity style={styles.navItem} onPress={() => {}}>
        <View>
          <Image
            source={require('../../assets/images/Search.png')}
            style={{ position: 'relative', bottom: 30, width: 150, height: 150 }}
          />
        </View>
      </TouchableOpacity>
      <NavButton3 onPress={() => {router.push('/metPago')}} iconPath="M25.4772 14.8235C25.4772 13.3738..." width={29} height={29} />
      <TouchableOpacity style={styles.navItem} onPress={() => {}}>
        <View style={styles.profile}>
          <Image
            source={require('../../assets/images/profilep.png')}
            style={{ width: 30, height: 30, position: 'relative' }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
},
navItem: { 
    alignItems: 'center', 
    justifyContent: 'center' 
},
profile: {
    backgroundColor: '#E8F2FE',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
},
});

export default BottomNav;