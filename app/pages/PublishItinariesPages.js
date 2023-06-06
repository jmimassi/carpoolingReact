import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

/**
 * Form component for publishing itineraries.
 */
const PublishItinerariesForm = () => {
    const [startAddress, setStartAddress] = useState('');
    const [seats, setSeats] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [hours, setHours] = useState('');
    const navigation = useNavigation();

    /**
     * Handles form submission.
     */
    const handleSubmit = async () => {
        try {
            const data = {
                startAddress,
                seats: parseInt(seats),
                destination,
                startDate,
                hours,
            };

            const token = await AsyncStorage.getItem('token');
            const decodedToken = jwt_decode(token);
            const fk_user = decodedToken.id;

            const response = await fetch('http://pat.infolab.ecam.be:60845/api/itinaries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            const bookingData = {
                fk_itineraries: responseData.itineraries_id,
                fk_user,
                type_user: 'conductor',
                request_user: false,
                message: 'I am the driver',
            };

            const bookingResponse = await fetch('http://pat.infolab.ecam.be:60845/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });

            const bookingResponseData = await bookingResponse.json();

            console.log('Booking Response:', bookingResponseData);
            navigation.navigate('Itineraries');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Destination</Text>
                    <TextInput
                        style={styles.input}
                        value={destination}
                        onChangeText={setDestination}
                        placeholder="Enter destination"
                    />
                    <Text style={styles.label}>Start Address</Text>
                    <TextInput
                        style={styles.input}
                        value={startAddress}
                        onChangeText={setStartAddress}
                        placeholder="Enter start address"
                    />
                    <Text style={styles.label}>Seats</Text>
                    <TextInput
                        style={styles.input}
                        value={seats}
                        onChangeText={setSeats}
                        placeholder="Enter number of seats"
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Start Date</Text>
                    <TextInput
                        style={styles.input}
                        value={startDate}
                        onChangeText={setStartDate}
                        placeholder="Enter start date"
                    />
                    <Text style={styles.label}>Hours</Text>
                    <TextInput
                        style={styles.input}
                        value={hours}
                        onChangeText={setHours}
                        placeholder="Enter hours"
                    />
                    <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                        <Text style={styles.buttonText}>Publish</Text>
                    </TouchableOpacity>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
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

export default PublishItinerariesForm;
