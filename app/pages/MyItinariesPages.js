import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Modal, TextInput } from 'react-native';
import jwt_decode from 'jwt-decode';

let username = '';

const ItinariesPages = () => {
    const [itinaries, setItinaries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [NewModalVisible, setNewModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [passengersList, setPassengersList] = useState([]);
    const [formValues, setFormValues] = useState({
        startAddress: '',
        seats: 0,
        destination: '',
        startDate: '',
        hours: ''
    });

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

                const response = await fetch('http://localhost:8000/api/itinariesMyCard', options);
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

        fetchItinaries();
    }, []);

    const Cancel = async (itinerary) => {
        // Actions à effectuer lors du clic sur le bouton "Cancel"
        console.log(itinerary);
    };

    const deleteItinerary = async (itinerary) => {
        // Actions à effectuer lors du clic sur le bouton "Supprimer"
        console.log(itinerary);
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
            const token = localStorage.getItem('token');
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

            const response = await fetch(`http://localhost:8000/api/itinarie/${selectedItinerary.itinaries_id}`, options);

            if (response.ok) {
                console.log('Itinerary updated successfully');
            } else {
                console.error('Update request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setModalVisible(false);
    };


    const requestItinerary = async (
        itinerary) => {
        try {
            const token = localStorage.getItem('token');
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

            const response = await fetch(`http://localhost:8000/api/itinaries/PassengerList/${itinerary.itinaries_id}`, options);
            const data = await response.json();

            if (response.ok) {
                console.log(data);
                setModalVisible(false);
                setPassengersList(data.itinaries_users);
                setNewModalVisible(true);
            } else {
                console.error('Request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAcceptPassenger = async (passenger) => {
        try {
            const token = localStorage.getItem('token');
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
                `http://localhost:8000/api/booking/${itinaries_user_id}/accept`,
                options
            );

            if (response.ok) {
                console.log('Passenger accepted successfully');
            } else {
                console.error('Accept request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDenyPassenger = async (passenger) => {
        try {
            const token = localStorage.getItem('token');
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
                `http://localhost:8000/api/booking/${itinaries_user_id}/deny`,
                options
            );

            if (response.ok) {
                console.log('Passenger denied successfully');
            } else {
                console.error('Deny request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
                        {username !== itinerary.conductorEmail ? (
                            <View>
                                <Button title="Cancel" onPress={() => Cancel(itinerary)} color="#000000" />
                            </View>
                        ) : (
                            <View>
                                <Button title="Supprimer" onPress={() => deleteItinerary(itinerary)} color="#000000" />
                                <Button title="Modifier" onPress={() => editItinerary(itinerary)} color="#000000" />
                                <Button title="Request" onPress={() => requestItinerary(itinerary)} color="#000000" />
                            </View>
                        )}
                    </View>
                ))
            ) : (
                <Text>No itineraries found.</Text>
            )}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Edit Itinerary</Text>
                        <TextInput
                            style={styles.input}
                            value={formValues.startAddress}
                            onChangeText={(text) => handleInputChange('startAddress', text)}
                            placeholder="Start Address"
                        />
                        <TextInput
                            style={styles.input}
                            value={formValues.seats.toString()}
                            onChangeText={(text) => handleInputChange('seats', Number(text))}
                            placeholder="Seats"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={formValues.destination}
                            onChangeText={(text) => handleInputChange('destination', text)}
                            placeholder="Destination"
                        />
                        <TextInput
                            style={styles.input}
                            value={formValues.startDate}
                            onChangeText={(text) => handleInputChange('startDate', text)}
                            placeholder="Start Date"
                        />
                        <TextInput
                            style={styles.input}
                            value={formValues.hours}
                            onChangeText={(text) => handleInputChange('hours', text)}
                            placeholder="Hours"
                        />
                        <Button title="Submit" onPress={handleSubmit} color="#000000" />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="#000000" />
                    </View>
                </View>
            </Modal>
            <Modal visible={NewModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <ScrollView style={styles.modalScrollView}>
                        <View style={styles.modalContent}>
                            <Text>Passenger List</Text>
                            <View style={styles.passengerList}>
                                {passengersList.map((passenger, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.passengerCard,
                                            passenger.request_user ? styles.passengerCardGreen : styles.passengerCardRed,
                                        ]}>
                                        <Text>User: {passenger.fk_user}</Text>
                                        <Text>Message: {passenger.message}</Text>
                                        <View style={styles.buttonContainer}>
                                            <Button title="Accept" onPress={() => handleAcceptPassenger(passenger)} color="#000000" />
                                            <Button title="Deny" onPress={() => handleDenyPassenger(passenger)} color="#000000" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <Button title="Close" onPress={() => setNewModalVisible(false)} color="#000000" />
                        </View>
                    </ScrollView>
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
    modalScrollView: {
        width: '90%',
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 10,
    },
    passengerList: {
        alignItems: 'center',
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
});

export default ItinariesPages;