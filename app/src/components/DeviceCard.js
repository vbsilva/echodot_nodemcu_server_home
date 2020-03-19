import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, PanResponder } from 'react-native';
import api from '../api/api';


const DeviceCard = props => {


    const deviceTapped = async () => {
        const response = await api.get(props.device_name);
        console.log(response.data)
        console.log(response.status)
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