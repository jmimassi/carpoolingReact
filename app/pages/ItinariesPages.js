import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button, Modal, TextInput } from 'react-native';
import jwt_decode from 'jwt-decode';

let username = '';

const ItinariesPages = () => {
    const [itinaries, setItinaries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [message, setMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

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
        setSelectedItinerary(itinerary);
        setModalVisible(true);
    };

    const handleSubmit = () => {
        // Actions à effectuer lors de la soumission du formulaire
        if (selectedItinerary && message) {
            const bookingData = {
                fk_itinaries: selectedItinerary.itinaries_id,
                fk_user: username,
                type_user: 'passenger',
                request_user: false,
                message: message,
            };

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            };

            fetch('http://localhost:8000/api/bookings', options)
                .then((response) => response.json())
                .then((data) => {
                    // Traitez la réponse de la requête ici
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

        setModalVisible(false);
        setMessage('');
    };

    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    const filteredItinaries = itinaries.filter((itinerary) =>
        itinerary.destination.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Itinaries</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search destination"
                value={searchText}
                onChangeText={handleSearchTextChange}
            />
            {filteredItinaries.length > 0 ? (
                filteredItinaries.map((itinerary, index) => (
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
                            <Button
                                title="Climb on board"
                                onPress={() => handleClimbOnBoard(itinerary)}
                                color="#000000"
                            />
                        )}
                    </View>
                ))
            ) : (
                <Text>No itineraries found.</Text>
            )}
            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Climb on Board</Text>
                        <TextInput
                            style={styles.messageInput}
                            placeholder="Enter your message"
                            value={message}
                            onChangeText={setMessage}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    searchInput: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#ffffff',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    messageInput: {
        height: 100,
        borderRadius: 5,
        borderColor: '#dddddd',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
    },
    submitButton: {
        backgroundColor: '#4287f5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignSelf: 'center',
    },
    submitButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ItinariesPages;