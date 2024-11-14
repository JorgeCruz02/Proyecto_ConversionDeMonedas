import { View, Text, Image, StyleSheet, Pressable, ScrollView, ImageBackground } from "react-native";
import { useContext } from 'react';
import { MyContext } from "./Context";
import { router, Link } from "expo-router";

export default function Index() {
    const { loginData, setLoginData } = useContext(MyContext);

    const logout = () => {
        // Limpiar datos de login y redirigir a la pantalla de inicio
        setLoginData({});
        router.replace('/');
    };

    return (
        <ImageBackground 
            source={require('../assets/images/background-image.jpg')} // Reemplaza con la ruta a tu imagen de fondo
            style={styles.background}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>←</Text>
                    </Pressable>

                    <Image style={styles.pfpImage} source={{ uri: loginData.pfp_url || 'https://via.placeholder.com/260' }} />
                    <Text style={styles.username}>{loginData.id || 'Id'}</Text>
                    <Text style={styles.subtitle}>Mi Perfil</Text>

                    <View style={styles.infoSection}>
                        <Text style={styles.label}>NOMBRE</Text>
                        <Text style={styles.info}>{loginData.username || 'Username'}</Text>
                        
                        <Text style={styles.label}>EMAIL</Text>
                        <Text style={styles.info}>{loginData.correo || 'example@domain.com'}</Text>
                        
                        <Text style={styles.label}>Credits</Text>
                        <Text style={styles.info}>{loginData.credits || 'N/A'}</Text>
                        
                        <Text style={styles.label}>XP</Text>
                        <Text style={styles.info}>{loginData.xp || 'N/A'}</Text>
                    </View>

                    <Pressable onPress={logout} style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </Pressable>

                    <Pressable style={styles.logoutButton} onPress={() => router.push("/changeProfilePic")}>
                        <Text style={styles.logoutButtonText}>Change Profile Pic</Text>
                    </Pressable>

                    <View style={styles.footer}>
                        <Link href="/credits">
                            <Text style={styles.footerText}>-----Made by App Chida.-----</Text>
                        </Link>
                    </View> 
                    <Text>   </Text>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    container: {
        width: '90%',
        alignItems: 'flex-start',
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo blanco semitransparente
        borderRadius: 20,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 20,
    },
    backButtonText: {
        fontSize: 24,
        color: '#333',
    },
    pfpImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        alignSelf: 'center',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        alignSelf: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
        alignSelf: 'center',
    },
    infoSection: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginTop: 10,
    },
    info: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
        paddingLeft: 10, // Separación del borde izquierdo
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#333',
        borderRadius: 20,
        marginTop: 20,
        alignSelf: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    footer: {
        marginTop: 20,
        alignSelf: 'center',
    },
    footerText: {
        color: '#333',
        fontSize: 20,
    },
});