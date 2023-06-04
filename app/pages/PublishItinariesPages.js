import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PublishItinariesForm = () => {
    const [startAddress, setStartAddress] = useState('');
    const [seats, setSeats] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [hours, setHours] = useState('');

    const handleSubmit = async () => {
        try {
            const data = {
                startAddress,
                seats: parseInt(seats),
                destination,
                startDate,
                hours,
            };

            // Effectuer la requête POST vers localhost:8000/itinaries avec les données
            const response = await fetch('http://pat.infolab.ecam.be:60846/api/itinaries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            console.log('Response:', responseData);

            // Récupérer le user connecté depuis le token dans le localStorage
            const token = await AsyncStorage.getItem('token');
            const decodedToken = jwt_decode(token);
            const fk_user = decodedToken.id;

            const bookingData = {
                fk_itinaries: responseData.itinaries_id, // Utiliser la valeur retournée de la première requête
                fk_user,
                type_user: 'conductor', // Remplacer par la valeur appropriée
                request_user: false, // Remplacer par la valeur appropriée
                message: 'je suis le conducteur', // Remplacer par la valeur appropriée
            };

            // Effectuer la deuxième requête POST vers localhost:8000/api/bookings avec les données
            const bookingResponse = await fetch(
                'http://pat.infolab.ecam.be:60846/api/bookings',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookingData),
                }
            );

            const bookingResponseData = await bookingResponse.json();

            console.log('Booking Response:', bookingResponseData);
            // Effectuer des actions supplémentaires après la soumission du formulaire
        } catch (error) {
            console.error('Error:', error);
            // Gérer les erreurs lors de la soumission du formulaire
        }
    };


    return (
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

export default PublishItinariesForm;
