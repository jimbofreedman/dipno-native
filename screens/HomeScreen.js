import * as React from 'react';
import {Text, Container, Content, List, ListItem, Button} from 'native-base';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { createStackNavigator } from '@react-navigation/stack';


import useStores from '../useStores';

import ListScreen from './ListScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

HomeScreen.navigationOptions = {

};

export default observer(HomeScreen);
