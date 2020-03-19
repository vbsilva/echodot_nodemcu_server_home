import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const HomeScreen = (props) => {
    return (
        <LinearGradient
            colors = {['black', '#020316', '#0A063C']}
            style={styles.gradient} >
                
                <Image style={styles.splash_image} source={require('../../assets/chroma_lair_nobg.png')}/>
                <TouchableOpacity style={styles.button} onPress={() => {props.navigation.navigate('Device')}}>
                    <Image style={styles.icon} source={require('../../assets/login_icon.png')}/>
                    <Text style={styles.text}> Login </Text>
                </TouchableOpacity>

            </LinearGradient>
      );
};


const styles = StyleSheet.create({
    gradient: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flex: 1
    },
    splash_image: {
        width: 400,
        height: 400,
        marginTop: 100
    },
    icon: {
        width: 25,
        height: 25,
    },
    button: {
        width: 175,
        backgroundColor: '#020316',
        borderRadius: 10,
        borderColor: '#FFFF',
        borderWidth: 1,
        shadowColor: 'rgba(0, 127, 0, 0.9)',
        shadowOffset: { height: 3, width: 3 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    text: {
        //color: '#0DF219',
        color: 'rgba(0, 200, 0, 1)',
        fontSize: 25,
        shadowColor: 'rgba(0, 127, 0, 0.9)',
        shadowOffset: { height: 3, width: 3 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
    }
});

export default HomeScreen;

