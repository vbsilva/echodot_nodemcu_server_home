import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DeviceScreen = () => {
    return (
        <LinearGradient
            colors = {['#020316', '#020316', '#0A063C']}
            style={{flex: 1}}>
                <Text style={styles.text}>Device Screen</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 10,
        color: 'red'
    }
})

export default DeviceScreen;