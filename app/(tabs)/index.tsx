import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

<<<<<<< Updated upstream
export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenidos!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
=======
// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Bienvenido!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12'
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           Tap the Explore tab to learn more about what's included in this starter app.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           When you're ready, run{' '}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, View, StyleSheet, Text, TextInput, Image, ImageBackground } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Component from '../../components/Background';

export default function Home() {

    //Input Focus
    
    const [isFocused, setIsFocused] = useState(false);
    const [isFocused_1, setIsFocused_1] = useState(false);

    //Pressable Focus

    const [onPressIn, OnpressOut] = useState(false);
    const [onPressIn_1, OnpressOut_1] = useState(false);
    const [onPressIn_2, OnpressOut_2] = useState(false);
    const [onPressIn_3, OnpressOut_3] = useState(false);
    const [onPressIn_4, OnpressOut_4] = useState(false);
    const [onPressIn_5, OnpressOut_5] = useState(false);
    const [onPressIn_6, OnpressOut_6] = useState(false);

    return (
        <SafeAreaProvider>
            <StatusBar style='auto'/>
            <SafeAreaView edges={['top', 'bottom', 'left', 'right']}>
                <View style={styles.container}>
                    <Component />
                    <View style={{flex: 1 , display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                        <Text style={styles.title}>Iniciar Sesión</Text>
                    </View>

                    <View style={{flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
                        <Text style={styles.text}>¡Bienvenido de nuevo, te hemos hechado de menos!</Text>
                    </View>

                    <View style={{flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}} >
                        <TextInput style={isFocused ? styles.areaFocus : styles.area}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder='Correo Electrónico'
                        />

                        <TextInput style={isFocused_1 ? styles.areaFocus : styles.area}
                            onFocus={() => setIsFocused_1(true)}
                            onBlur={() => setIsFocused_1(false)}
                            placeholder='Contraseña'
                        />
                    </View>
                                
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}} >
                        <Pressable
                            onPress={() => console.log('Siguiente bloque')}
                            onPressIn={() => OnpressOut(true)}
                            onPressOut={() => OnpressOut(false)}
                            hitSlop={5}
                            pressRetentionOffset={{top: 5, left: 5, bottom: 5, right: 5}}
                        >
                            <Text style={onPressIn ? styles.new : styles.textRed}>Olvidaste tu contraseña?</Text>
                        </Pressable>
                    </View>

                    <View style={{flex: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}} >
                        <Pressable
                            onPress={() => console.log('Siguiente bloque')}
                            onPressIn={() => OnpressOut_1(true)}
                            onPressOut={() => OnpressOut_1(false)}
                            hitSlop={20}
                            pressRetentionOffset={{top: 20, left: 20, bottom: 20, right: 20}}
                        >
                            <Text style={onPressIn_1 ? styles.buttonActive : styles.button}>Iniciar</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => console.log('Siguiente bloque')}
                            onPressIn={() => OnpressOut_2(true)}
                            onPressOut={() => OnpressOut_2(false)}
                            hitSlop={5}
                            pressRetentionOffset={{top: 5, left: 5, bottom: 5, right: 5}}
                        >
                            <Text style={onPressIn_2 ? styles.textRed : styles.new}>Crear nueva cuenta</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => console.log('Siguiente bloque')}
                            onPressIn={() => OnpressOut_3(true)}
                            onPressOut={() => OnpressOut_3(false)}
                            hitSlop={5}
                            pressRetentionOffset={{top: 5, left: 5, bottom: 5, right: 5}}
                        >
                            <Text style={onPressIn_3 ? styles.new : styles.continue}>O continuar con</Text>
                        </Pressable>
                    </View>

                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} >
                        <Pressable style={onPressIn_4 ? styles.imgFocus : styles.img}
                            onPress={() => console.log('Siguiente bloque')}
                            onPressIn={() => OnpressOut_4(true)}
                            onPressOut={() => OnpressOut_4(false)}
                        >
                            <Image
                                source={require('../../assets/icons/google.png')}
                                style={{width: 40, height: 40, margin: 10}}
                            />
                        </Pressable>

                        <Pressable style={onPressIn_5 ? styles.imgFocus : styles.img}
                            onPress={() => console.log('Siguiente bloque')}
                            onPressIn={() => OnpressOut_5(true)}
                            onPressOut={() => OnpressOut_5(false)}
                        >
                            <Image
                                source={require('../../assets/icons/facebook-ci.png')}
                                style={{width: 40, height: 40, margin: 10}}
                        />
                        </Pressable>

                        <Pressable style={onPressIn_6 ? styles.imgFocus : styles.img}
                            onPress={() => console.log('Siguiente bloque')}
                            onPressIn={() => OnpressOut_6(true)}
                            onPressOut={() => OnpressOut_6(false)}
                        >
                            <Image
                                source={require('../../assets/icons/apple.png')}
                                style={{width: 40, height: 40, margin: 10}}
                            />
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
)}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        paddingHorizontal: 30,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 35,
        fontWeight: '800',
        color: '#900020',
    },
    text: {
        color: '#000',
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
    },
    textRed: {
        color: '#900020',
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        display: 'flex',
        color: '#fff',
        fontSize: 25,
        fontWeight: '700',
        backgroundColor: '#900020',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 350,
        height: 60,
        borderRadius: 10,
    },
    buttonActive: {
        display: 'flex',
        color: '#fff',
        fontSize: 25,
        fontWeight: '700',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 350,
        height: 60,
        borderRadius: 10,
    },
    new: {
        color: 'gray',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    continue: {
        color: '#900020',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    area: {
        borderWidth: 2,
        borderColor: '#ffffff',
        borderRadius: 10,
        width: 350,
        height: 70,
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '700',
        backgroundColor: '#ffeaee',
    },
    areaFocus: {
        borderWidth: 2,
        borderColor: '#900020',
        borderRadius: 10,
        width: 350,
        height: 60,
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '700',
        backgroundColor: '#ffeaee',
    },
    img: {
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    imgFocus: {
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }
});
>>>>>>> Stashed changes
