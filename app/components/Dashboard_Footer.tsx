import { StyleSheet, View, TouchableOpacity, Image, Text, Animated, Pressable } from 'react-native';
import { NavButton1, NavButton2, NavButton3 } from './Dashboard';
import { useAuth } from '../../context/Authcontext';
import { useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import { ROUTES, AppRoute } from '../../config/routes';
import { useRouter } from 'expo-router';

// Bottom navigation bar
export const BottomNav = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(170))[0];

  const toggleMenu = () => {
    if (menuVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 170,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const handleLogout = () => {
    // Close menu first
    closeMenu();
    // Then logout
    setTimeout(() => {
      logout();
    }, 300);
  };
  
  const handleNavigation = (path: AppRoute) => {
    closeMenu();
    // Use setTimeout to ensure menu is closed before navigation
    setTimeout(() => {
      safeNavigate(path);
    }, 300);
  };

  const safeNavigate = (path: string) => {
    try {
      // Extract the route name from the path
      const routeName = path.split('/').pop();
      if (routeName) {
        // Keep PerfilUsuario as is, convert others to lowercase
        const finalRouteName = routeName === 'PerfilUsuario' ? routeName : routeName.toLowerCase();
        router.replace(`/Auth/${finalRouteName}` as any);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <View style={styles.bottomNav}>
      {menuVisible && (
        <Pressable onPress={closeMenu} style={StyleSheet.absoluteFill}>
          <View style={styles.overlay} />
        </Pressable>
      )}
      
      <NavButton1 onPress={() => handleNavigation(ROUTES.AUTH.HOME)} iconPath="M2.92542 14.8235L13.3723 4.37659C13.8849 3.86403..." width={29} height={29} />
      <NavButton2 onPress={() => handleNavigation(ROUTES.AUTH.LIST)} iconPath="M13.6945 4.90534C13.9187 4.36637..." width={29} height={29} />
      <TouchableOpacity style={styles.navItem}>
        <View>
          <Image
            source={require('../../assets/images/Search.png')}
            style={{ position: 'relative', bottom: 30, width: 150, height: 150 }}
          />
        </View>
      </TouchableOpacity>
      <NavButton3 onPress={() => handleNavigation(ROUTES.AUTH.NOTIFICATIONS)} iconPath="M25.4772 14.8235C25.4772 13.3738..." width={29} height={29} />
      <TouchableOpacity style={styles.navItem} onPress={toggleMenu}>
        <View style={styles.profile}>
          <Image
            source={require('../../assets/images/profilep.png')}
            style={{ width: 30, height: 30, position: 'relative' }}
          />
        </View>
      </TouchableOpacity>

      {menuVisible && (
        <Animated.View style={[styles.menu, { transform: [{ translateY: slideAnim }] }]}> 
          <TouchableOpacity onPress={() => { closeMenu(); handleNavigation(ROUTES.AUTH.PROFILE); }} style={styles.menuItem}>
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Path d="M8.34259 1.94005C8.433 1.39759 8.90234 1 9.45229 1H10.5462C11.0962 1 11.5655 1.39759 11.6559 1.94005L11.8049 2.83386C11.8756 3.25813 12.1886 3.59838 12.5858 3.76332C12.9832 3.92832 13.4396 3.90629 13.7897 3.65617L14.5273 3.12933C14.9748 2.80969 15.5878 2.86042 15.9767 3.24929L16.7502 4.02284C17.1391 4.41171 17.1898 5.02472 16.8702 5.47223L16.3432 6.21007C16.0931 6.56012 16.0711 7.01633 16.236 7.41363C16.4009 7.81078 16.7411 8.12363 17.1652 8.19433L18.0592 8.34332C18.6017 8.43373 18.9993 8.90307 18.9993 9.45302V10.547C18.9993 11.0969 18.6017 11.5663 18.0592 11.6567L17.1654 11.8056C16.7411 11.8764 16.4009 12.1893 16.236 12.5865C16.071 12.9839 16.093 13.4403 16.3431 13.7904L16.8698 14.5278C17.1895 14.9753 17.1388 15.5884 16.7499 15.9772L15.9763 16.7508C15.5875 17.1396 14.9745 17.1904 14.5269 16.8707L13.7893 16.3439C13.4393 16.0938 12.983 16.0718 12.5857 16.2367C12.1885 16.4016 11.8756 16.7418 11.8049 17.166L11.6559 18.0599C11.5655 18.6024 11.0962 19 10.5462 19H9.45229C8.90234 19 8.433 18.6024 8.34259 18.0599L8.19362 17.1661C8.12291 16.7419 7.80999 16.4016 7.41275 16.2367C7.01535 16.0717 6.55902 16.0937 6.20887 16.3438L5.47125 16.8707C5.02374 17.1904 4.41073 17.1396 4.02186 16.7507L3.24831 15.9772C2.85944 15.5883 2.80871 14.9753 3.12835 14.5278L3.65539 13.79C3.90543 13.4399 3.92747 12.9837 3.76252 12.5864C3.59764 12.1892 3.25746 11.8764 2.83329 11.8057L1.93932 11.6567C1.39686 11.5663 0.999268 11.0969 0.999268 10.547V9.45302C0.999268 8.90307 1.39686 8.43373 1.93932 8.34332L2.83312 8.19436C3.2574 8.12364 3.59765 7.81071 3.76259 7.41347C3.92759 7.01605 3.90556 6.5597 3.65544 6.20954L3.12875 5.47216C2.8091 5.02465 2.85983 4.41164 3.2487 4.02277L4.02225 3.24922C4.41112 2.86036 5.02413 2.80962 5.47164 3.12927L6.20924 3.65613C6.55931 3.90618 7.01555 3.92822 7.41287 3.76326C7.81004 3.59837 8.1229 3.25819 8.1936 2.834L8.34259 1.94005Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M13 10C13 11.6569 11.6568 13 9.99997 13C8.34311 13 6.99997 11.6569 6.99997 10C6.99997 8.34317 8.34311 7.00002 9.99997 7.00002C11.6568 7.00002 13 8.34317 13 10Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
            <Text style={styles.menuText}>Configuración</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
            <Svg width="19" height="20" viewBox="0 0 19 20" fill="none">
              <Path d="M11.75 7V3.25C11.75 2.00736 10.7426 1 9.5 1L3.5 1C2.25736 1 1.25 2.00736 1.25 3.25L1.25 16.75C1.25 17.9926 2.25736 19 3.5 19H9.5C10.7426 19 11.75 17.9926 11.75 16.75V13M14.75 13L17.75 10M17.75 10L14.75 7M17.75 10L5 10" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
            <Text style={styles.menuText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

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
    zIndex: 100,
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
  menu: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  menuText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    position: 'absolute',
    top: -1000,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
  }
});

export default function DashboardFooter() {
  return <BottomNav />;
}
