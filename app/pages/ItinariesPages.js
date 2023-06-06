import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Button,
    Modal,
    TextInput,
} from 'react-native';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

let username = '';

/**
 * Page des itinéraires
 */
const ItinariesPages = () => {
    const [itinaries, setItinaries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [message, setMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    /**
     * Récupère les itinéraires depuis l'API
     */
    const fetchItinaries = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
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

            const response = await fetch(
                'http://pat.infolab.ecam.be:60845/api/itinariesCard',
                options
            );
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

    useEffect(() => {
        fetchItinaries();
    }, []);

    /**
     * Gère le clic sur le bouton "Climb On Board"
     * @param {object} itinerary - L'itinéraire sélectionné
     */
    const handleClimbOnBoard = (itinerary) => {
        setSelectedItinerary(itinerary);
        setModalVisible(true);
    };

    /**
     * Soumet le formulaire de réservation
     */
    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

        const decodedToken = jwt_decode(token);
        username = decodedToken.id;

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
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            };

            fetch('http://pat.infolab.ecam.be:60845/api/bookings', options)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    fetchItinaries();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

        setModalVisible(false);
        setMessage('');
    };

    /**
     * Vérifie si l'utilisateur est déjà inscrit à un itinéraire
     * @param {object} itinerary - L'itinéraire à vérifier
     * @returns {boolean} - True si l'utilisateur est déjà inscrit, sinon False
     */
    const isUserAlreadyOnBoard = (itinerary) => {
        return itinerary.passengerEmails.includes(username);
    };

    /**
     * Gère le changement de texte dans le champ de recherche
     * @param {string} text - Le texte saisi dans le champ de recherche
     */
    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    /**
     * Filtre les itinéraires en fonction du texte de recherche
     */
    const filteredItinaries = itinaries.filter(
        (itinerary) =>
            itinerary.destination.toLowerCase().includes(searchText.toLowerCase()) ||
            itinerary.startAddress.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <TextInput
                style={styles.searchInput}
                placeholder="🔍 Search destination or start address"
                value={searchText}
                onChangeText={handleSearchTextChange}
            />

            {filteredItinaries.length > 0 ? (
                filteredItinaries.map((itinerary, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.destination}>{itinerary.destination}</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>🏠 Start Address</Text>
                            <Text style={styles.cardText}>{itinerary.startAddress}</Text>
                            <Text style={styles.label}>👥 Seats</Text>
                            <Text style={styles.cardText}>{itinerary.seats}</Text>
                            <Text style={styles.label}>⏰ Start Date</Text>
                            <Text style={styles.cardText}>{itinerary.startDate}</Text>
                            <Text style={styles.label}>🕒 Hours</Text>
                            <Text style={styles.cardText}>{itinerary.hours}</Text>
                            <Text style={styles.label}>📧 Conductor</Text>
                            <Text style={styles.cardText}>{itinerary.conductorEmail}</Text>
                        </View>
                        {username !== itinerary.conductorEmail && (
                            <View>
                                {isUserAlreadyOnBoard(itinerary) ? (
                                    <Text style={styles.errorText}>You are already subscribed</Text>
                                ) : itinerary.seats > 0 ? (
                                    <TouchableOpacity
                                        onPress={() => handleClimbOnBoard(itinerary)}
                                        style={styles.button}
                                    >
                                        <Text style={styles.buttonText}>Climb On Board</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text style={styles.errorText}>No seats available</Text>
                                )}
                            </View>
                        )}
                    </View>
                ))
            ) : (
                <Text>No itineraries found</Text>
            )}

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
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
                </TouchableOpacity>
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
        padding: 24,
        marginVertical: 16,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 2,
    },
    destination: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    textContainer: {
        marginTop: 8,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardText: {
        marginBottom: 16,
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
        height: 40,
        borderRadius: 5,
        borderColor: '#dddddd',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
    },
    submitButton: {
        backgroundColor: '#000000',
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
    errorText: {
        color: '#CE6A6B',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default ItinariesPages;
