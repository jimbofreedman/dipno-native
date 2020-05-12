import * as React from 'react';
import {Text, Container, Content, List, ListItem, Button} from 'native-base';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import useStores from '../useStores';
import { Linking } from 'expo';

function ListScreen({ navigation }) {
  const { userStore, profileStore, matchStore } = useStores();

  React.useEffect(() => {
    if (!userStore.loading && !userStore.error && !userStore.all().length) {
      userStore.loadAll();
    }
    if (!profileStore.loading && !profileStore.error && !profileStore.all().length) {
      profileStore.loadAll();
    }
    if (!matchStore.loading && !matchStore.error) {
      matchStore.loadAll();
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

  const myUserId = profileStore.all()[0].id;

  return (
    <Container>
      <List>
        {matchStore.all().map(m => {
          const user1Id = m.relationships.user1.data.id;
          if (user1Id === myUserId) {
            return null;
          }

          const u = userStore.byId({ id: user1Id });
          const userName = `${u.attributes.first_name} ${u.attributes.last_name.slice(0, 1)}.`;

          const acceptMatch = () => {
            m.update({ attributes: { accepted: true } });
          };

          const connectMatch = () => {
            Linking.openURL(u.attributes.facebook_link);
          };

          const actionButton = m.attributes.accepted ? (
            <Button onPress={connectMatch} title="Connect"><Text>Connect</Text></Button>
          ) : (
            <Button onPress={acceptMatch} title="Accept"><Text>Accept</Text></Button>
        )
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
              {actionButton}
            </ListItem>
          );
        })}
      </List>
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

ListScreen.navigationOptions = {
  header: null,
};

export default observer(ListScreen);
