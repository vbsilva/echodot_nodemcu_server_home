import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Vibration, Alert } from 'react-native';
import api from '../api/api';
import * as Haptics from 'expo-haptics';


const DeviceCard = props => {
    const errorMessage = 'Something went wrong :(';


    const deviceTapped = async () => {
       api.get(props.device_name)
        .then( () => {
            Haptics.notificationAsync('success')
        })
        .catch( error => {
            Haptics.notificationAsync('error')
            console.log(error);
            Alert.alert(errorMessage);
        })
    }

    return (
        <View>
            <TouchableOpacity 
                style={styles.card}
                onPress={deviceTapped}>
                <Image style={styles.icon} source={props.imageSource}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#020316',
        borderRadius: 12,
        borderColor: '#FFFF',
        borderWidth: 1,
        shadowColor: 'rgba(0, 127, 0, 0.9)',
        shadowOffset: { height: 3, width: 3 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        minWidth: 120,
        minHeight: 150,
        margin: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        minWidth: 80,
        minHeight: 80,
    }
});

export default DeviceCard;