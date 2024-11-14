import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable, ImageBackground } from 'react-native';
import * as Crypto from 'expo-crypto';
import { Endpoints } from "@/constants/Endpoints";
import { MyContext } from "./Context";
import { router } from "expo-router";

export default function Register() {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const { setLoginData } = useContext(MyContext);

    const onRegister = async () => {
        const hashedPassword = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
        
        const formData = new FormData();
        formData.append('token', 'code37');
        formData.append('id', id);
        formData.append('username', username);
        formData.append('pass', hashedPassword);
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('email', email);

        fetch(Endpoints.REGISTER, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setErrorMessage(data.error);
            } else {
                console.log(data);
                setLoginData(data);
                router.replace('/mainmenu');
            }
        })
        .catch(err => setErrorMessage("Error al conectar con el servidor."));
    }

    return (
        <ImageBackground 
            source={require('../assets/images/background-image.jpg')} // Cambia al fondo que desees
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Registro</Text>

                <TextInput placeholder="ID" onChangeText={setId} style={styles.input} />
                <TextInput placeholder="Usuario" onChangeText={setUsername} style={styles.input} />
                <TextInput placeholder="Contraseña" secureTextEntry onChangeText={setPassword} style={styles.input} />
                <TextInput placeholder="Nombre" onChangeText={setFirstname} style={styles.input} />
                <TextInput placeholder="Apellido" onChangeText={setLastname} style={styles.input} />
                <TextInput placeholder="Correo Electrónico" onChangeText={setEmail} style={styles.input} />

                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                <Pressable style={styles.registerButton} onPress={onRegister}>
                    <Text style={styles.registerButtonText}>Registrar</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fondo blanco semitransparente
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxWidth: 400,
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
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
    },
    registerButton: {
        paddingVertical: 15,
        backgroundColor: '#000',
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: '#d9534f',
        marginBottom: 10,
        fontSize: 14,
    },
});
