import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';


const DeviceCard = props => {
    return (
        <View>
            <TouchableOpacity style={styles.card}>
                <Image style={styles.icon} source={props.imageSource}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#020316',
        borderRadius: 10,
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