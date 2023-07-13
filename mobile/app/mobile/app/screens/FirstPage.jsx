import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.jpg';
import backgroundImg from '../assets/image2.jpg';

export default function FirstPage() {

    const navigation = useNavigation();

    function login(){
        navigation.navigate('Login');

    }


    return (
        <ImageBackground source={backgroundImg} style={styles.backgroundImage}>

            <View style={styles.add}>

                <Text style={styles.addText}>Uma jornada multimídia personalizada para você</Text>

                <TouchableOpacity style={styles.loginButton} onPress={login}>
                    <Text style={styles.loginButtonText}>Entre já</Text>
                </TouchableOpacity>

            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    add: {
        width: '60%',
        height: '15%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '30%',
        borderRadius: 50,
    },
    loginButton: {
        width: 100,
        backgroundColor: 'white',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'pink',
    },
    loginButtonText: {
        color: 'pink',
        fontWeight: 'bold',
        fontSize: 16,
    },
    addText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        fontStyle: 'italic',
        textShadowColor: 'pink',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
});


