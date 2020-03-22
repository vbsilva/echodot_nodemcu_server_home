import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Vibration, Alert } from 'react-native';
import api from '../api/api';
import * as Haptics from 'expo-haptics';


export default class DeviceCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            tapped: false
        }

    }
    errorMessage = 'Something went wrong :(';

    relayTapped = async() => {
        try {
            const newState = this.state.value? 0 : 1;
            await api.get(this.props.device_name + '?state=' + newState);
            Haptics.notificationAsync('success')
            this.setState({
                value: newState
            });
        } catch (err) {
            console.log(err)
            Haptics.notificationAsync('error');
            Alert.alert(this.errorMessage);
        }

    }

    generalTapped = async() => {
        try {
            const response = await api.get(this.props.device_name);
            Haptics.notificationAsync('success');
        } catch (err) {
            console.log(err);
            Haptics.notificationAsync('error')
            Alert.alert(this.errorMessage);
        }
    }

    sensorTapped = async() => {
        if (this.state.tapped) {
            this.setState({
                tapped: false
            })
            return;
        }

        try {
            const response = await api.get(this.props.device_name);
            Haptics.notificationAsync('success');
            this.setState({
                value: response.data,
                tapped: true
            });
        } catch (err) {
            console.log(err);
            Haptics.notificationAsync('error')
            Alert.alert(this.errorMessage);
        }
    }    

    render() {
        var deviceTapped;
        var sensorValue = null;
        var icon;
        switch (this.props.device_type) {
            case 'relay':
                deviceTapped = this.relayTapped;
                icon = <Image style={styles.icon} source={this.props.imageSource}/>
                break;
            case 'sensor':
                deviceTapped = this.sensorTapped;
                icon = <Image style={[styles.icon, {opacity: this.state.tapped? 0.2 : 1}]} source={this.props.imageSource}/>
                sensorValue = <Text style={[styles.sensorValue, {opacity: this.state.tapped? 1: 0}]}>{this.state.value}°C</Text>;
                break;
            case 'general':
                deviceTapped = this.generalTapped;
                icon = <Image style={styles.icon} source={this.props.imageSource}/>
                break;
        }
        return (
            <View>
                <TouchableOpacity style={styles.card} onPress={deviceTapped}>
                    {icon}
                    {sensorValue}
                </TouchableOpacity>
            </View>
        );
    }
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
        opacity: 1
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorText: {
        color: 'red',
        fontSize: 40
    },
    sensorValue: {
        color: 'rgba(0, 220, 0, 0.7)',
        fontSize: 40,
        position: 'absolute',
        fontFamily: 'Futura'
    }
});