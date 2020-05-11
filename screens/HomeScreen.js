import * as React from 'react';
import { Text, Container, Content, List, ListItem } from 'native-base';
import { observer } from 'mobx-react';

import useStores from '../useStores';

function HomeScreen() {
  const { userStore } = useStores();

  React.useEffect(() => {
    if (!userStore.loading && !userStore.loaded) {
      userStore.loadAll();
    }
  });

  if (userStore.loading) {
    return (
      <Container>
        <Content>
          <Text>Loading...</Text>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <List>
        {userStore.all().map(u => (
          <ListItem>{u.attributes.firstName}</ListItem>
        ))}
      </List>
    </Container>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

export default observer(HomeScreen);
