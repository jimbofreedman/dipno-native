import { AsyncStorage } from 'react-native';

class StorageService {
  constructor() {
    this.storage = AsyncStorage;
    this.token_key = '@dipno/apiToken';
    this.form_key = '@dipno/search_form';
  }

  getToken() {
    return this.storage.getItem(this.token_key) || false;
  }

  setToken(token) {
    if (token) {
      this.storage.setItem(this.token_key, token);
    }
  }

  removeToken() {
    this.storage.removeItem(this.token_key);
  }
}

export default new StorageService();
