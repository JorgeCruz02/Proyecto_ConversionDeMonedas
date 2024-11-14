import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Index() {
    return (
        <ImageBackground 
            source={require('../assets/images/background-image.jpg')} // Reemplaza con la ruta a tu imagen de fondo
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Equipo AppChida</Text>
                <Text style={styles.title}>Grupo 900 CIB</Text>
                <Text style={styles.member}>Axel Roldan Carreon</Text>
                <Text style={styles.member}>Fernando Briseño Milanes</Text>
                <Text style={styles.member}>Jorge Antonio Cruz Molina</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo blanco semitransparente
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    member: {
        fontSize: 20,
        color: '#555',
        marginBottom: 10,
    },
});
