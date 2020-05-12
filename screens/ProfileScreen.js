import * as React from 'react';
import { Text, Container, Content, List, ListItem, Button } from 'native-base';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import useStores from '../useStores';

function ProfileScreen({ route }) {
  const { userStore, matchStore, profileStore } = useStores();

  React.useEffect(() => {
    if (!userStore.loading && !userStore.error && !userStore.all().length) {
      userStore.loadAll();
    }
    if (!profileStore.loading && !profileStore.error && !profileStore.all().length) {
      profileStore.loadAll();
    }
    if (!matchStore.loading && !matchStore.error && !matchStore.all().length < 1) {
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

  const user = userStore.byId({ id: route.params.userId });

  const tryMatch = () => {
    const matchData = {
      attributes: {},
      relationships: {
        user1: {
          data: {
            type: 'User',
            id: profileStore.all()[0].id,
          },
        },
        user2: {
          data: {
            type: 'User',
            id: user.id,
          },
        },
      },
    };
    matchStore.create(matchData);
  };

  const userName = `${user.attributes.first_name} ${user.attributes.last_name.slice(0, 1)}.`

  return (
    <Container>
      <Text>{userName}</Text>
      <Text>I'd like to chat about:</Text>
      <Text>{user.attributes.interests}</Text>
      <Button onPress={tryMatch} title="Match"><Text>Match</Text></Button>
    </Container>
  );
}

ProfileScreen.navigationOptions = {
  header: null,
};

export default observer(ProfileScreen);
