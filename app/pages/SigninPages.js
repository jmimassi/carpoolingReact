import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        const formData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:8000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                // Store user credentials in local storage
                localStorage.setItem('token', data.token);
                console.log('User logged in successfully');
            } else {
                console.error('Error:', response.status);
            }

            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = () => {
        // Supprimez les données du localStorage
        localStorage.removeItem('token');
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                <Button title="Sign In" onPress={handleSignIn} color="#000000" />
                <Button title="Logout" onPress={handleLogout} color="#000000" />
            </View>
        </View>
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
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 2,
        borderWidth: 1,
        borderColor: 'black',
    },
    input: {
        height: 40,
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default SignInPage;
