import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DeviceCard from '../components/DeviceCard';
import api from '../api/api';
import Images from '../../assets/index';


export default class DeviceScreen extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            devices: {}
        }
    }

    errorLoadingMessage = 'Error loading devices from server :('

    loadDevices = async() => {
        try {
            const devices = await api.get('devices');
            this.setState({
                loading: false,
                devices: devices.data
            })
        } catch (err) {
            Alert.alert(this.errorLoadingMessage);

        }
    }

    componentDidMount() {
        this.loadDevices();

    }



    render () {
        var element;
        if (this.state.loading) {
            element = <ActivityIndicator size='large' color='rgba(0, 200, 0, 1)' />;
        } else {
            element = [];
            for (var i in this.state.devices) {
                element.push(
                    <DeviceCard
                        key={i}
                        device_name={i}
                        device_type={this.state.devices[i]["device_type"]}
                        value={this.state.devices[i]["value"]}
                        imageSource={Images.icons[i]}/>
                );
            }
        }
        return (
            <LinearGradient
                colors = {['black', '#020316', '#0A063C']}
                style={styles.gradient}>
                    <Text style={styles.pagetitle}>Tap to control</Text>
                    <View style={styles.cardContainer}>
                        {element}
                    </View>
            </LinearGradient>
        );
    }
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: 25
    },
    pagetitle: {
        fontSize: 30,
        alignSelf: 'center',
        color: 'rgba(0, 200, 0, 0.9)',
        padding: 25,
        shadowColor: 'rgba(0, 127, 0, 0.9)',
        shadowOffset: { height: 3, width: 3 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        fontFamily: 'Verdana'
    },
});