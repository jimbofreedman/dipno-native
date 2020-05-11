import * as Facebook from 'expo-facebook';
import { AsyncStorage } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { observable, action, computed } from 'mobx';

import apiService from '../services/apiService';

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
      SecureStore.getItemAsync('facebookToken').then(t => {
        this.facebookToken = t;
        Facebook.initializeAsync('461460001330325').then(() => {});
      });
    });
  }

  @action.bound async checkLoggedIn() {
    apiService
      .convertToken({
        client_id: 'yiY1DGCuMBiWTWMkP4mZDoksndxEUhJf6uDklbPq',
        client_secret:
          'n5AIxbyK366tlCMrhXuYWx80x9MDlSWAgJ6pZxD4TpNwfS6xAepqabAnsF4u9QkN93QC6fNhHuxUAn2ljOWBh9gm7WCF2IWkI8T8w6jPj9nzD89UVynXTjd1sQARFHUq',
        grant_type: 'convert_token',
        backend: 'facebook',
        token: this.facebookToken,
      })
      .then(data => {
        console.log('logged in');
        this.apiToken = data.access_token;
        return true;
      })
      .catch(() => {
        console.log('not logged in');
        this.logout();
        return false;
      });
  }

  @action.bound
  async login() {
    try {
      const {
        type,
        token,
        /*        expires,
        permissions,
        declinedPermissions, */
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        const apiToken = await apiService.convertToken({
          client_id: 'yiY1DGCuMBiWTWMkP4mZDoksndxEUhJf6uDklbPq',
          client_secret:
            'n5AIxbyK366tlCMrhXuYWx80x9MDlSWAgJ6pZxD4TpNwfS6xAepqabAnsF4u9QkN93QC6fNhHuxUAn2ljOWBh9gm7WCF2IWkI8T8w6jPj9nzD89UVynXTjd1sQARFHUq',
          grant_type: 'convert_token',
          backend: 'facebook',
          token,
        });
        this.apiToken = apiToken.access_token;
        this.facebookToken = token;
        SecureStore.setItemAsync('facebookToken', this.facebookToken);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }
  }

  @action.bound async logout() {
    await SecureStore.deleteItemAsync('facebookToken');
    this.facebookToken = null;
    this.apiToken = null;
  }
}