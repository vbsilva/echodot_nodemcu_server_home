import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Images from '../../assets/index';


const HomeScreen = (props) => {
    return (
        <LinearGradient
            colors = {['black', '#020316', '#0A063C']}
            style={styles.gradient} >
                
                <Image style={styles.splash_image} source={Images.logos.chroma_lair}/>
                <TouchableOpacity style={styles.button} onPress={() => {props.navigation.navigate('Device')}}>
                    <Image style={styles.icon} source={Images.icons.login}/>
                    <Text style={styles.text}> Login </Text>
                </TouchableOpacity>

            </LinearGradient>
      );
};


const styles = StyleSheet.create({
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    splash_image: {
        width: 400,
        height: 400,
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
        fontFamily: 'Verdana'
    }
});

export default HomeScreen;

