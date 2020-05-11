import * as React from 'react';
import { Text, Container, Content, List, ListItem, Button } from 'native-base';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import useStores from '../useStores';

function ProfileScreen({ route }) {
  const { userStore, profileStore } = useStores();

  console.log(route);

  React.useEffect(() => {
    if (!userStore.loading && !userStore.error && !userStore.all().length) {
      userStore.loadAll();
    }
  });

  if (userStore.loading || userStore.all().length < 1) {
    return (
      <Container>
        <Content>
          <Text>Loading...</Text>
        </Content>
      </Container>
    );
  }

  const user = userStore.byId({ id: route.params.userId });

  const userName = `${user.attributes.first_name} ${user.attributes.last_name.slice(0, 1)}.`

  return (
    <Container>
      <Text>{userName}</Text>
    </Container>
  );
}

ProfileScreen.navigationOptions = {
  header: null,
};

export default observer(ProfileScreen);
