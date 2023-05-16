import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import jwt_decode from 'jwt-decode';

let username = '';

const ItinariesPages = () => {
    const [itinaries, setItinaries] = useState([]);

    useEffect(() => {
        const fetchItinaries = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found in localStorage');
                    return;
                }

                const decodedToken = jwt_decode(token);
                username = decodedToken.id;

                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await fetch('http://localhost:8000/api/itinariesCard', options);
                const data = await response.json();

                if (response.ok) {
                    setItinaries(data);
                } else {
                    console.error('Response Status:', response.status);
                    console.error('Response Text:', data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchItinaries();
    }, []);

    const handleClimbOnBoard = (itinerary) => {
        // Actions à effectuer lors du clic sur le bouton "Climb On Board"
        console.log(itinerary)
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Itinaries</Text>
            {itinaries.length > 0 ? (
                itinaries.map((itinerary, index) => (
                    <View key={index} style={styles.card}>
                        <Text>Itinerary ID: {itinerary.itinaries_id}</Text>
                        <Text>Start Address: {itinerary.startAddress}</Text>
                        <Text>Seats: {itinerary.seats}</Text>
                        <Text>Destination: {itinerary.destination}</Text>
                        <Text>Created At: {itinerary.createdAt}</Text>
                        <Text>Updated At: {itinerary.updatedAt}</Text>
                        <Text>Start Date: {itinerary.startDate}</Text>
                        <Text>Hours: {itinerary.hours}</Text>
                        <Text>Conductor Email: {itinerary.conductorEmail}</Text>
                        <Text>Passenger Emails: {itinerary.passengerEmails}</Text>
                        {username !== itinerary.conductorEmail && (
                            <Button title="Climb on board" onPress={() => handleClimbOnBoard(itinerary)} color="#000000" />
                        )}

                    </View>
                ))
            ) : (
                <Text>No itineraries found.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        width: '80%',
        padding: 16,
        marginVertical: 8,

        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 2,
    },
    button: {
        backgroundColor: '#4287f5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ItinariesPages;