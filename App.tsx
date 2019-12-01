import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import firebase from 'react-native-firebase';

export default class App extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {};
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("token: " + fcmToken)
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.log("after check")
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        this.getToken();
    } catch (error) {
        console.log('permission rejected');
    }
  }
  
  async createNotificationListeners() {
    firebase.notifications().onNotification(notification => {
        notification.android.setChannelId('insider').setSound('default')
        firebase.notifications().displayNotification(notification)
    });
  }
  
  componentDidMount() {
    console.log("start diidmount")
    const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
    console.log("after channel..")
    firebase.notifications().android.createChannel(channel);
    console.log("after not creating..")
    this.checkPermission();
    console.log("after check..")
    this.createNotificationListeners();
  }
  

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          
          <Text>Just text</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
