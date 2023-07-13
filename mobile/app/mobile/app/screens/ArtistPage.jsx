import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc, updateDoc, addDoc, getDocs, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';
import ArtistMedia from './ArtistsMedia';
import AudioListScreen from './ArtistsMedia'


export default function ArtistPage({ route }) {

    const navigation = useNavigation();

    const { email } = route.params;

    const [id, setId] = useState('');
    const [personName, setPersonName] = useState('');
    const [personSurname, setPersonSurname] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showMidia, setShowMidia] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailUri, setThumbnailUri] = useState(null);
    const [itemUri, setItemUri] = useState('');
    const [itemType, setItemType] = useState('');
    const [activeButton, setActiveButton] = useState(''); // Initialize with the active button's key


    useEffect(() => {
        const fetchPersonData = async () => {
            try {

                const docRef = collection(FIREBASE_DB, 'pessoa');
                const docSnapshot = await getDocs(
                    query(docRef, where('email', '==', email))
                );

                docSnapshot.forEach((doc) => {
                    const data = doc.data();
                    setId(doc.id);
                    setPersonName(data.name);
                    setPersonSurname(data.surname);
                    setProfileImageUrl(data.imageUrl || null);
                });


            } catch (error) {
                console.log('Error fetching person data:', error);
            }
        };

        fetchPersonData();
    }, [email]);


    return (
        <View style={styles.container}>
            <View style={styles.header}>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.iconBack} name="chevron-back-outline" size={30} color="black" />
                </TouchableOpacity>


            </View>

            <View style={styles.fundo}>
                <View style={styles.borderImage}>
                    <TouchableOpacity >
                        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>{personName} {personSurname}</Text>

                <TouchableOpacity
                    style={[styles.button, activeButton === 'ver-meus-videos' && styles.activeButton]}
                    onPress={() => {
                        setActiveButton('ver-meus-videos');
                        setShowForm(false);
                        setShowMidia(true);
                    }}
                >
                    <Text style={styles.buttonText}>Mídias</Text>
                </TouchableOpacity>

                {showMidia && (
                    <View style={styles.formContainer}>

                        <AudioListScreen artistId={id} />

                    </View>

                )}

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: "10%",
    },
    options: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'grey',
    },
    button: {
        backgroundColor: 'pink',
        borderRadius: 25,
        padding: 10,
        margin: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    input: {
        width: 200,
        height: 35,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: 'pink',
        color: 'white',
        fontWeight: 'bold',

    },
    thumbnailButton: {
        backgroundColor: 'pink',
        width: 200,
        height: 35,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 5,
    },
    thumbnailButtonText: {
        color: 'white',
    },
    itemButton: {
        backgroundColor: 'pink',
        width: 200,
        height: 35,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
    },
    itemButtonText: {
        color: 'white',
    },
    uploadButton: {
        backgroundColor: 'pink',
        width: '80%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: 'bold',
        padding: 10,
    },
    activeButton: {
        backgroundColor: '#FE496C',
    },
    fundo: {
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    borderImage: {
        backgroundColor: "pink",
        width: 120,
        height: 120,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    }
});

