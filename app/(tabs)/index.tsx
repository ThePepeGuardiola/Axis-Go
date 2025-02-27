import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Image, Pressable, Text } from "react-native";


export default function App() {
    return(

        
        <View style={styles.container}>
            
            <StatusBar style="auto"/>

            {/* IMAGES */}


            <Image
                    source={require('@/assets/images/welcome-image.png')}
                    style={styles.mainimage}
                    />

            <Image
                    source={require('@/assets/images/back-image.png')}
                    style={styles.backimage}
                    />

            {/* TEXT */}


            <Text style={styles.mtext}>Descubre tu ruta de transporte ideal aquí.</Text>

            <Text style={styles.stext}>Explora todas las rutas de transporte disponibles según tus intereses y destino principal.</Text>


        {/* BUTTONS */}


        <View style={styles.logbuttons}>
            <Pressable style={styles.button}>
                    <Text style={styles.logtext}>Login</Text>
            </Pressable>


            <Pressable style={styles.button2}>
                    <Text style={styles.logtext2}>Register</Text>
            </Pressable>
        </View>
            

    </View>
);
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },

    backimage: {
        zIndex: -1,
        position: 'absolute',
        top: 0,
        right: 0,
    },

    mainimage: {
        overflow: 'hidden',
        left: -330,
        position: 'absolute',
        bottom: 50,
        width: 1040,
        resizeMode: 'contain',
    },

    mtext: {
        fontSize: 36,
        position: 'absolute',
        paddingBottom: 330,
        color: '#900020',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    stext: {
        fontSize: 18,
        textAlign: 'center'
    },

    logbuttons:{
        flexDirection: 'row',
    },

    logtext: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },

    button: {
        width: '70%',
        marginVertical: 80,
        marginHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#900020',
        shadowColor: '#FF9EB4',
        shadowOffset:{ width: 0, height: 7},
        shadowOpacity: 1,
        shadowRadius: 10,
    },

    logtext2: {
        fontSize: 25,
        fontWeight: 'bold',
    },

    button2: {
        width: '60%',
        marginVertical: 80,
        paddingVertical: 20,
        borderRadius: 10,
        alignItems: 'center',
    },

});