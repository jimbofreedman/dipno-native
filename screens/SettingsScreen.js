import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {Container, Text, Button, Content} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import useStores from '../useStores';
import TextInputStylePropTypes from 'react-native-web/dist/exports/TextInput/TextInputStylePropTypes';

function SettingsScreen() {
  const { authStore } = useStores();

  return (
    <Container>
      <Button onPress={authStore.logout} title="Logout">
        <Text>Logout</Text>
      </Button>
    </Container>
  );
}

export default observer(SettingsScreen);
