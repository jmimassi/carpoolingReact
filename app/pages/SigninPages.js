import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleSignIn = async () => {
        const formData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://pat.infolab.ecam.be:60845/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AsyncStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            });

            // const response = await fetch('http://192.168.0.19:8000/api/user/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${AsyncStorage.getItem('token')}`
            //     },
            //     body: JSON.stringify(formData),
            // });

            if (response.ok) {
                const data = await response.json();
                // Store user credentials in local storage
                await AsyncStorage.setItem('token', data.token);
                console.log('User logged in successfully');
                navigation.navigate('Itinaries');
            } else {
                console.error('Error:', response.status);
            }

            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = async () => {
        // Supprimez les données du localStorage
        await AsyncStorage.removeItem('token');
        console.log('User logged out successfully');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                    />
                    <TouchableOpacity onPress={handleSignIn} style={styles.button}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                    <Button title="Logout" onPress={handleLogout} color="#000000" />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '80%',
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 2,
        borderWidth: 1,
        borderColor: 'black',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#000000',
        paddingVertical: 12,
        borderRadius: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SignInPage;