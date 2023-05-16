import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ItinariesPages = () => {
    const [itinaries, setItinaries] = useState([]);

    useEffect(() => {
        fetchItinaries();
    }, []);

    const fetchItinaries = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/itinaries');
            console.log('Response:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('Data:', data);
                setItinaries(data);
            } else {
                console.error('Response Status:', response.status);
                const text = await response.text();
                console.error('Response Text:', text);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Itinaries</Text>
            {itinaries.length > 0 ? (
                itinaries.map((itinerary, index) => (
                    <View key={index} style={styles.card}>
                        <Text>{itinerary.destination}</Text>
                        <Text>{itinerary.seats}</Text>
                    </View>
                ))
            ) : (
                <Text>No itineraries found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
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
});

export default ItinariesPages;
