import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DeviceCard from '../components/DeviceCard';


const DeviceScreen = () => {
    return (
        <LinearGradient
            colors = {['#020316', '#020316', '#0A063C']}
            style={styles.gradient}>
                <Text style={styles.pagetitle}>Tap to control</Text>
                <View style={styles.cardContainer}>
                    <DeviceCard
                        style={styles.deviceCard}
                        device_name='fan'
                        imageSource={require('../../assets/fan2_icon.png')}
                    />
                    <DeviceCard
                        style={styles.deviceCard}
                        device_name='ac'
                        imageSource={require('../../assets/ac_icon.png')}
                    />
                    <DeviceCard
                        style={styles.deviceCard}
                        device_name='tv'
                        imageSource={require('../../assets/tv_icon.png')}
                    />
                    <DeviceCard
                        style={styles.deviceCard}
                        device_name='temp'
                        imageSource={require('../../assets/temp_icon.png')}
                    />

                </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: 50
    },
    pagetitle: {
        fontSize: 40,
        alignSelf: 'center',
        color: 'rgba(0, 200, 0, 1)',
        padding: 50,
        shadowColor: 'rgba(0, 127, 0, 0.9)',
        shadowOffset: { height: 3, width: 3 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
    }
});

export default DeviceScreen;