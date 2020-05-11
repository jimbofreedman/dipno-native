import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text, Container } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { observer } from 'mobx-react';

import useStores from '../useStores';

function HomeScreen() {
  const { authStore } = useStores();

  return (
    <Container>
      <Button rounded light onPress={authStore.login}>
        <Text>Login with Facebook</Text>
      </Button>
    </Container>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

export default observer(HomeScreen);
