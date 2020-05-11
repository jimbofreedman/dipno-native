import * as Facebook from 'expo-facebook';
import { AsyncStorage } from 'react-native';

import { observable, action, computed } from 'mobx';
import { now } from 'mobx-utils';

import apiService from "../services/apiService";
import storageService from '../services/storageService';

export default class AuthStore {
  @observable facebookId = null;

  @observable facebookToken = null;

  @observable facebookExpires = null;

  @observable facebookName = null;

  @observable apiToken = null;

  @computed get isLoggedIn() {
    return this.apiToken !== null;
  }

  constructor() {
    Facebook.setAutoInitEnabledAsync(true).then(() => {

      Facebook.initializeAsync('461460001330325').then(() => {

      });
    });
  }

  @action.bound async checkLoggedIn() {
    this.facebookToken = await AsyncStorage.getItem('@dipno:facebookToken');
    this.facebookExpires = await AsyncStorage.getItem('@dipno:facebookExpires');
    if (!this.facebookToken) {
      return false;
    }

    const response = await fetch(`https://graph.facebook.com/me?access_token=${this.facebookToken}`);
    const data = await response.json();
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
        console.log("Logged into Facebook");
        const apiToken = await apiService.convertToken({
            "client_id": "yiY1DGCuMBiWTWMkP4mZDoksndxEUhJf6uDklbPq",
            "client_secret": "n5AIxbyK366tlCMrhXuYWx80x9MDlSWAgJ6pZxD4TpNwfS6xAepqabAnsF4u9QkN93QC6fNhHuxUAn2ljOWBh9gm7WCF2IWkI8T8w6jPj9nzD89UVynXTjd1sQARFHUq",
            "grant_type": "convert_token",
            "backend": "facebook",
            "token": token
          }
        );
        console.log("Logged in to API")
        this.apiToken = apiToken.access_token;
        this.facebookToken = token;
        console.log("FB Token:" ,this.facebookToken);
        console.log(await apiService.me(token));
        // // Get the user's name using Facebook's Graph API
        // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        // const data = await response.json();
        // console.log('Logged in!', `Hi ${data.name}!`);
        // console.log(data);
        // this.facebookId = data.id;
        // this.facebookName = data.name;
        // this.facebookToken = token;
        // this.facebookExpires = expires;
        // AsyncStorage.setItem('@dipno:facebookToken', token);
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
