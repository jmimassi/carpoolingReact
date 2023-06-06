import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Modal, TextInput, TouchableOpacity } from 'react-native';
import { ScrollViewIndicator } from 'react-native-scrollview-indicator';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
let username = '';


const ItinariesPages = () => {
    const [itinaries, setItinaries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [NewModalVisible, setNewModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [passengersList, setPassengersList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [formValues, setFormValues] = useState({
        startAddress: '',
        seats: 0,
        destination: '',
        startDate: '',
        hours: ''
    });

    const fetchItinaries = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
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

            const response = await fetch('http://pat.infolab.ecam.be:60845/api/itinariesMyCard', options);

            const data = await response.json();

            if (response.ok) {
                setItinaries(data);
                console.log(data);
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

    const Cancel = async (itinerary) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const decodedToken = jwt_decode(token);
            username = decodedToken.id;
            console.log(username)

            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await fetch(
                `http://pat.infolab.ecam.be:60845/api/booking/user/${username}/itinarie/${itinerary.itinaries_id}`,
                options
            );

            // const response = await fetch(
            //     `http://192.168.0.19:8000/api/booking/user/${username}/itinarie/${itinerary.itinaries_id}`,
            //     options
            // );


            if (response.ok) {
                console.log('Booking canceled successfully');
                fetchItinaries();
            } else {
                console.log(response)
                console.error('Cancel request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        // fetchItinaries();r
    };

    const deleteItinerary = async (itinerary) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const { itinaries_id } = itinerary;

            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await fetch(`http://pat.infolab.ecam.be:60845/api/itinarie/${itinaries_id}`, options);
            // const response = await fetch(`http://192.168.0.19:8000/api/itinarie/${itinaries_id}`, options);

            if (response.ok) {
                console.log('Itinerary deleted successfully');
                fetchItinaries();
            } else {
                console.error('Delete request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        fetchItinaries();
    };


    const editItinerary = (itinerary) => {
        setSelectedItinerary(itinerary);
        setFormValues({
            startAddress: itinerary.startAddress || '',
            seats: itinerary.seats || 0,
            destination: itinerary.destination || '',
            startDate: itinerary.startDate || '',
            hours: itinerary.hours || ''
        });
        setModalVisible(true);
    };

    const handleInputChange = (field, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formValues),
            };

            const response = await fetch(`http://pat.infolab.ecam.be:60845/api/itinarie/${selectedItinerary.itinaries_id}`, options);
            // const response = await fetch(`http://192.168.0.19:8000/api/itinarie/${selectedItinerary.itinaries_id}`, options);

            if (response.ok) {
                console.log('Itinerary updated successfully');
                fetchItinaries();
                console.log('refetch');
            } else {
                console.error('Update request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setModalVisible(false);
    };


    const requestItinerary = async (itinerary) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log(itinerary);
            console.log(itinerary.itinaries_id);
            const response = await fetch(`http://pat.infolab.ecam.be:60845/api/itinaries/PassengerList/${itinerary.itinaries_id}`, options);
            // const response = await fetch(`http://192.168.0.19:8000/api/itinaries/PassengerList/${itinerary.itinaries_id}`, options);
            const data = await response.json();

            if (response.ok) {
                // ...
                if (data) {
                    setPassengersList(
                        data.itinaries_users.map((passenger) => ({
                            ...passenger
                        }))
                    );
                    console.log("C'est la passenger list:", passengersList);
                } else {
                    setPassengersList(null);
                }
                setNewModalVisible(true);
            } else {
                console.error('Request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const itinariesDecrementSeats = async (itinariesId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token not found in AsyncStorage');
                return;
            }

            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await fetch(
                `http://pat.infolab.ecam.be:60845/api/itinarie/${itinariesId}/seatsmin`,
                options
            );

            // const response = await fetch(
            //     `http://192.168.0.19:8000/api/itinarie/${itinariesId}/seatsmin`,
            //     options
            // );

            if (response.ok) {
                const data = await response.json();
                // const updatedSeats = data.seats - 1;
                console.log('Seats updated successfully:', data);
                fetchItinaries();
            } else {
                console.error('Seats update request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const itinariesIncrementSeats = async (itinariesId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token not found in AsyncStorage');
                return;
            }

            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await fetch(
                `http://pat.infolab.ecam.be:60845/api/itinarie/${itinariesId}/seatsplus`,
                options
            );

            // const response = await fetch(
            //     `http://192.168.0.19:8000/api/itinarie/${itinariesId}/seatsplus`,
            //     options
            // );

            if (response.ok) {
                const data = await response.json();
                // const updatedSeats = data.seats + 1;
                console.log('Seats updated successfully:', data);
                fetchItinaries();
            } else {
                console.error('Seats update request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleAcceptPassenger = async (passenger) => {
        if (passenger.seats <= 0) {
            setErrorMessage('No seats available for this itinerary');
            return; // Empêche d'accepter si les places sont épuisées
        }
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const { itinaries_user_id } = passenger;
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await fetch(
                `http://pat.infolab.ecam.be:60845/api/booking/${itinaries_user_id}/accept`,
                options
            );
            // const response = await fetch(
            //     `http://192.168.0.19:8000/api/booking/${itinaries_user_id}/accept`,
            //     options
            // );

            if (response.ok) {
                console.log('Passenger accepted successfully');
                passenger.request_user = true; // Met à jour la propriété request_user du passager
                itinariesDecrementSeats(passenger.fk_itinaries);
            } else {
                console.error('Accept request failed');
            }
        } catch (error) {
            console.error('Error:', error);
            fetchItinaries();
        }
    };

    const handleDenyPassenger = async (passenger) => {
        console.log("c'est le token", token)
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const decodedToken = jwt_decode(token);
            username = decodedToken.id;

            const { itinaries_user_id } = passenger;
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await fetch(
                `http://pat.infolab.ecam.be:60845/api/booking/${itinaries_user_id}/deny`,
                options
            );

            if (response.ok) {
                console.log('Passenger denied successfully');
                passenger.request_user = false; // Met à jour la propriété request_user du passager
                console.log(passenger);
                itinariesIncrementSeats(passenger.fk_itinaries);


            } else {
                console.error('Deny request failed');
            }
        } catch (error) {
            console.error('Error:', error);
            fetchItinaries();
        }
    };



    const handleSearchTextChange = (text) => {
        setSearchText(text);

    };

    const filteredItinaries = itinaries.filter((itinerary) =>
        itinerary.destination.toLowerCase().includes(searchText.toLowerCase()) ||
        itinerary.startAddress.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
        >
            {/* <Text style={styles.title}>Itinaries</Text> */}
            <TextInput
                style={styles.searchInput}
                placeholder="🔍 Search destination or start address"
                value={searchText}
                onChangeText={handleSearchTextChange}
            />
            {filteredItinaries.length > 0 ? (
                filteredItinaries.map((itinerary, index) => (
                    <View key={index} style={[styles.card, itinerary.conductorEmail !== username && (itinerary.passengerRequest[username] ? styles.passengerAcceptedCard : styles.passengerDeniedCard)]}>
                        <Text style={styles.destination}>{itinerary.destination}</Text>

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

                        {username !== itinerary.conductorEmail ? (
                            <TouchableOpacity onPress={() => Cancel(itinerary)} style={[styles.buttoncard, { backgroundColor: '#000000' }]}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        ) : (
                            <View >
                                <TouchableOpacity onPress={() => deleteItinerary(itinerary)} style={[styles.buttoncard, { backgroundColor: '#CE6A6B' }]}>
                                    <Text style={styles.buttonTextcard}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => editItinerary(itinerary)} style={[styles.buttoncard, { backgroundColor: '#4A919E' }]}>
                                    <Text style={styles.buttonTextcard}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => requestItinerary(itinerary)} style={[styles.buttoncard, { backgroundColor: '#212E53' }]}>
                                    <Text style={styles.buttonTextcard}>Request</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>


                ))
            ) : (
                <Text>No itineraries found.</Text>
            )}
            <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContentEdit}>
                        <Text style={styles.modalTitle}>Edit Itinarie</Text>

                        <Text style={styles.label}>Destination</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.destination}
                            onChangeText={(text) => handleInputChange('destination', text)}
                            placeholder="Destination"
                        />
                        <Text style={styles.label}>Start Adress</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.startAddress}
                            onChangeText={(text) => handleInputChange('startAddress', text)}
                            placeholder="Start Address"
                        />
                        <Text style={styles.label}>Seats</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.seats.toString()}
                            onChangeText={(text) => handleInputChange('seats', Number(text))}
                            placeholder="Seats"
                            keyboardType="numeric"
                        />
                        <Text style={styles.label}>Start Date</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.startDate}
                            onChangeText={(text) => handleInputChange('startDate', text)}
                            placeholder="Start Date"
                        />
                        <Text style={styles.label}>Hours</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.hours}
                            onChangeText={(text) => handleInputChange('hours', text)}
                            placeholder="Hours"
                        />
                        {/* <Button title="Submit" onPress={handleSubmit} color="#000000" />
                         */}
                        <TouchableOpacity onPress={() => handleSubmit()} style={[styles.buttoncard, { backgroundColor: '#000000' }]}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="#000000" />
                    </View>
                </View>
            </Modal>
            <Modal visible={NewModalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Passenger List</Text>
                        <ScrollView
                            showsVerticalScrollIndicator={false}>
                            {passengersList && passengersList.length > 0 ? (
                                <View style={styles.passengerList}>
                                    {passengersList.map((passenger, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.passengerCard,
                                                passenger.request_user ? styles.passengerCardGreen : styles.passengerCardRed,
                                            ]}
                                        >
                                            <Text style={styles.label}>👥 User</Text>
                                            <Text style={styles.cardText}>{passenger.fk_user}</Text>

                                            <Text style={styles.label}>✉️ Message</Text>
                                            <Text style={styles.input}>"{passenger.message}"</Text>
                                            <View style={styles.buttonContainer}>
                                                {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
                                                <TouchableOpacity
                                                    onPress={() => handleAcceptPassenger(passenger)}
                                                    style={[
                                                        styles.button,
                                                        passenger.request_user && styles.buttonDisabled, // Ajoutez ce style pour les passagers déjà acceptés
                                                    ]}
                                                    disabled={passenger.request_user || passenger.seats <= 0} // Désactivez le bouton pour les passagers déjà acceptés ou si les places sont épuisées
                                                >
                                                    <Text style={styles.buttonText}>Accept</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleDenyPassenger(passenger)}
                                                    style={[
                                                        styles.button,
                                                        !passenger.request_user && styles.buttonDisabled, // Ajoutez ce style pour les passagers déjà refusés
                                                    ]}
                                                    disabled={!passenger.request_user} // Désactivez le bouton pour les passagers déjà refusés
                                                >
                                                    <Text style={styles.buttonText}>Deny</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={{ textAlign: 'center', marginBottom: 12 }}>No passengers</Text>

                            )}
                        </ScrollView>
                        <Button title="Close" onPress={() => setNewModalVisible(false)} color="#000000" />
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
    passengerAcceptedCard: {
        backgroundColor: '#C8E6C9',
    },
    passengerDeniedCard: {
        backgroundColor: '#FFCDD2',
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
        maxHeight: '60%'
    },
    modalContentEdit: {
        width: '80%',
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#ffffff'
    },
    messageInput: {
        height: 100,
        borderRadius: 5,
        borderColor: '#dddddd',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        // maxHeight:500
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalScrollView: {
        width: '90%',
    },
    passengerList: {
        alignItems: 'center',
        // maxHeight: 500, // Définissez la hauteur maximale souhaitée ici
    },
    passengerCard: {
        width: '100%',
        padding: 16,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 2,
    },
    passengerCardRed: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    passengerCardGreen: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
    },
    acceptedPassengerCard: {
        backgroundColor: '#C8E6C9',
    },
    deniedPassengerCard: {
        backgroundColor: '#FFCDD2',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardText: {
        marginBottom: 16,
    },
    destination: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        width: 80,
        backgroundColor: '#000000',
        paddingVertical: 12,
        borderRadius: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scrollView: {
        overflow: 'hidden', // Ajoutez cette ligne pour masquer la barre de défilement
    },
    buttoncard: {
        backgroundColor: '#000000',
        paddingVertical: 12,
        borderRadius: 5,
        margin: 2
    },
    buttonTextcard: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },

});

export default ItinariesPages;
