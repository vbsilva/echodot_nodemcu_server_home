import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const HomeScreen = (props) => {
    console.log(props.navigation);
    return (
        <LinearGradient
            colors = {['#020316', '#020316', '#0A063C']}
            style={styles.gradient} >
                <View>
                    <Image style={styles.splash_image} source={require('../../assets/chroma_lair_nobg.png')}/>
                    <TouchableOpacity style={styles.button} onPress={() => {props.navigation.navigate('Device')}}>
                        <Image style={styles.icon} source={require('../../assets/login_icon.png')}/>
                        <Text style={styles.text}> Login </Text>
                    </TouchableOpacity>

                </View>
            </LinearGradient>
      );
};


const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    view: {
        flex:4,
        justifyContent: 'space-between'

    },
    image_view: {
        flex: 3
    },
    splash_image: {
        width: 300,
        height: 300,
    },
    icon: {
        width: 25,
        height: 25
    },
    button: {
        backgroundColor: '#020316',
        borderRadius: 5,
        //marginHorizontal: 150,
        //margin: 100,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //padding: 10
    },
    text: {
        //color: '#0DF219',
        color: '#fff',
        fontSize: 25
    }
});

export default HomeScreen;

