import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUpPage = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [maxPassengers, setMaxPassengers] = useState(0);
    const [licensePlate, setLicensePlate] = useState('');
    const [picture, setPicture] = useState('');

    const handleSignUp = async () => {
        const formData = {
            email: email,
            password: password,
            address: address,
            number_passengers_max: maxPassengers,
            license_plate: licensePlate,
            picture: picture,
        };

        try {
            const response = await fetch('http://localhost:8000/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Handle the response
            if (response.ok) {
                console.log('User registered successfully');
            } else {
                console.error('Error:', response.status);
            }

            setEmail('');
            setPassword('');
            setAddress('');
            setMaxPassengers(0);
            setLicensePlate('');
            setPicture('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSignIn = () => {
        navigation.navigate('SignIn');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                required
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                required
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={text => setAddress(text)}
                required
            />
            <TextInput
                style={styles.input}
                placeholder="Max Passengers"
                value={maxPassengers.toString()}
                onChangeText={text => setMaxPassengers(parseInt(text))}
                keyboardType="numeric"
                required
            />
            <TextInput
                style={styles.input}
                placeholder="License Plate"
                value={licensePlate}
                onChangeText={text => setLicensePlate(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Picture"
                value={picture}
                onChangeText={text => setPicture(text)}
                required
            />
            <Button title="Sign Up" onPress={handleSignUp} color="#000000" />
            <Button title="Sign In" onPress={handleSignIn} color="#000000" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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

export default SignUpPage;
