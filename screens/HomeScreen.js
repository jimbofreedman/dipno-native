import * as React from 'react';
import { Text, Container, Content, List, ListItem } from 'native-base';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import useStores from '../useStores';

function HomeScreen() {
  const { userStore } = useStores();

  React.useEffect(() => {
    if (!userStore.loading && !userStore.error && !userStore.all().length) {
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
        {userStore.all().map(u => {
          console.log(toJS(u.attributes));
          return <ListItem key={u.attributes.first_name}><Text>{u.attributes.first_name} {u.attributes.last_name}</Text></ListItem>;
        })}
      </List>
    </Container>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

export default observer(HomeScreen);
