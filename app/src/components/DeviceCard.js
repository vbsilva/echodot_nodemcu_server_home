import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Vibration, Alert } from 'react-native';
import api from '../api/api';
import * as Haptics from 'expo-haptics';


export default class DeviceCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            value: this.props.value
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
        console.log("general")
        try {
            const response = await api.get(this.props.device_name);
            Haptics.notificationAsync('success');
        } catch (err) {
            console.log(err);
            Haptics.notificationAsync('error')
            Alert.alert(this.errorMessage);
        }
    }

    render() {
        var deviceTapped = this.props.device_type == "relay" ? this.relayTapped : this.generalTapped;
        return (
            <View>
                <TouchableOpacity 
                    style={styles.card}
                    onPress={deviceTapped}>
                    <Image style={styles.icon} source={this.props.imageSource}/>
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
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorText: {
        color: 'red',
        fontSize: 40
    }
});