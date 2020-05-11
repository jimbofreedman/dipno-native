import * as React from 'react';
import {Text, Container, Content, List, ListItem, Button} from 'native-base';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import useStores from '../useStores';

function ListScreen({ navigation }) {
  const { userStore, profileStore } = useStores();

  React.useEffect(() => {
    if (!userStore.loading && !userStore.error && !userStore.all().length) {
      userStore.loadAll();
    }
    if (!profileStore.loading && !profileStore.error && !profileStore.all().length) {
      profileStore.loadAll();
    }
  });

  if (
    userStore.loading ||
    userStore.all().length < 1 ||
    profileStore.loading ||
    profileStore.all().length < 1
  ) {
    return (
      <Container>
        <Content>
          <Text>Loading...</Text>
        </Content>
      </Container>
    );
  }

  console.log(profileStore.all().length);
  const myUserId = profileStore.all()[0].id;

  return (
    <Container>
      <List>
        {userStore.all().map(u => {
          if (u.id === myUserId || !u.attributes.first_name) {
            return null;
          }

          const userName = `${u.attributes.first_name} ${u.attributes.last_name.slice(0, 1)}.`

          return (
            <ListItem key={u.id}>
              <Button
                title={userName}
                onPress={() => {
                  navigation.navigate('Profile', {
                    userId: u.id,
                  });
                }}
              >
                <Text>
                  {userName}
                </Text>
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

export default observer(ListScreen);
