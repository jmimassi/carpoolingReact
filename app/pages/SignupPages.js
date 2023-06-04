import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
            const response = await fetch('http://192.168.0.19:8000/api/user/register', {
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
            <View style={styles.formContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    required
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    required
                />
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter address"
                    value={address}
                    onChangeText={text => setAddress(text)}
                    required
                />
                <Text style={styles.label}>Max Passengers</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter max passengers"
                    value={maxPassengers.toString()}
                    onChangeText={text => setMaxPassengers(parseInt(text))}
                    keyboardType="numeric"
                    required
                />
                <Text style={styles.label}>License Plate</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter license plate"
                    value={licensePlate}
                    onChangeText={text => setLicensePlate(text)}
                />
                <Text style={styles.label}>Picture</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter picture"
                    value={picture}
                    onChangeText={text => setPicture(text)}
                    required
                />
                <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <Button title="Sign In" onPress={handleSignIn} color="#000000" />
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
        shadowOpacity: 0.3,
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});


export default SignUpPage;
