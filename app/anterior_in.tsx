import { Text, View, StyleSheet, 
    TextInput, Pressable,
    Button, ImageBackground, Image
} from "react-native";
import { useFonts } from "expo-font";
import IconRocket from './iconrocket';
import IconRobot from './robot';
import { Endpoints } from "@/constants/Endpoints";
import { useContext, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { Link, router } from "expo-router";
import { MyContext } from "./Context";

export default function Index() {

    const [loaded, error] = useFonts({
        'poppins': require('../assets/fonts/PoppinsSemiBold.ttf'),
    });

    const [userValue, setUserValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [failedLogin, setFailedLogin] = useState(false);

    const { loginData, setLoginData } = useContext(MyContext);

    const onButtonLogin = async () => {
        console.log('logging in!');
        const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, passValue);

        const form = new FormData();
        form.append('token', 'code37');
        form.append('user', userValue);
        form.append('pass', digest);

        fetch(Endpoints.LOGIN, {
            method: 'POST',
            body: form
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (!data.error && data.id) {
                setLoginData(data);
                router.replace('/mainmenu');
            } else {
                setFailedLogin(true);
            }
        })
        .catch(err => { console.log(err) });
    }

    return (
        <ImageBackground 
            source={require('../assets/images/background-image.jpg')} // Cambia al fondo deseado
            style={styles.background}
        >
            <View style={styles.container}>
                <Image source={require('../assets/images/store-icon.png')} style={styles.headerImage} />
                <Text style={styles.title}>App Chida</Text>
                <Text style={styles.subtitle}>Ingresa para continuar</Text>

                <View style={styles.inputfieldlabel}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="NOMBRE" 
                        onChangeText={setUserValue}
                    />
                </View>
                <View style={styles.inputfieldlabel}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="PASSWORD" 
                        onChangeText={setPassValue} 
                        secureTextEntry
                    />
                </View>
                <Pressable style={styles.button} onPress={onButtonLogin}>
                    <Text style={styles.buttonText}>Log in</Text>
                </Pressable>
                {failedLogin ? (<Text style={styles.errorText}>Fallo al login</Text>) : undefined}
				<Text>   </Text>
				<Pressable style={styles.button} onPress={() => router.push("/register")}>
    				<Text style={styles.buttonText}>Register</Text>
				</Pressable>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        height: '100%',
    },
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo semitransparente
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        width: '90%',
        maxWidth: 400,
    },
    headerImage: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontFamily: 'poppins',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    inputfieldlabel: {
        marginBottom: 15,
        width: '100%',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingLeft: 15,
        width: '100%',
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        marginTop: 15,
        color: '#d9534f',
        fontSize: 14,
    }
});
