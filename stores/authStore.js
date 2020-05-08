import * as Facebook from 'expo-facebook';
import { AsyncStorage } from 'react-native';

import { observable, action, computed } from 'mobx';
import { now } from 'mobx-utils';

export default class AuthStore {
  @observable facebookId = null;

  @observable facebookToken = null;

  @observable facebookExpires = null;

  @observable facebookName = null;

  @computed get isLoggedIn() {
    return this.facebookId !== null;
  }

  constructor() {
    Facebook.setAutoInitEnabledAsync(true).then(() => {
      console.log('set auto init');
      Facebook.initializeAsync('461460001330325').then(() => {
        console.log('initialized');
      });
    });
  }

  @action.bound async checkLoggedIn() {
    this.facebookToken = await AsyncStorage.getItem('@dipno:facebookToken');
    this.facebookExpires = await AsyncStorage.getItem('@dipno:facebookExpires');
    console.log(this.facebookToken);
    if (!this.facebookToken) {
      return false;
    }

    const response = await fetch(`https://graph.facebook.com/me?access_token=${this.facebookToken}`);
    const data = await response.json();
    console.log('Logged in!', `Hi ${data.name}!`);
    console.log(data);
    this.facebookId = data.id;
    this.facebookName = data.name;

    return true;
  }

  @action.bound
  async login() {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const data = await response.json();
        console.log('Logged in!', `Hi ${data.name}!`);
        console.log(data);
        this.facebookId = data.id;
        this.facebookName = data.name;
        this.facebookToken = token;
        this.facebookExpires = expires;
        AsyncStorage.setItem('@dipno:facebookToken', token);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }
  }

  @action.bound async logout() {
    console.log("Logging Out");
    this.facebookId = null;
    this.facebookName = null;
    await AsyncStorage.removeItem('@dipno:facebookToken');
    await AsyncStorage.removeItem('@dipno:facebookExpires');
  }
}
