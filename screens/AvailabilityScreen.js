import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Container, Text, Button, Content } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import useStores from '../useStores';

const styles = StyleSheet.create({});

function TimePicker({ time, update }) {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    update(date.toTimeString());
    hideDatePicker();
  };

  return (
    <Content>
      <Button title="Show Date Picker" onPress={showDatePicker}>
        <Text>{time.toTimeString()}</Text>
      </Button>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        date={time}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </Content>
  );
}

function AvailabilityScreen() {
  const { profileStore } = useStores();

  const handleConfirmFrom = time => {
    profileStore.all()[0].update({
      attributes: {
        available_from: time,
      },
    });
  };

  const handleConfirmTo = time => {
    profileStore.all()[0].update({
      attributes: {
        available_to: time,
      },
    });
  };

  React.useEffect(() => {
    if (!profileStore.loading && !profileStore.error && !profileStore.all().length) {
      profileStore.loadAll().then(d => console.log('loaded profiles'));
    }
  });

  if (profileStore.loading || profileStore.all().length < 1) {
    return (
      <Container>
        <Content>
          <Text>Loading...</Text>
        </Content>
      </Container>
    );
  }

  const profile = profileStore.all()[0];
  const { attributes } = profile;
  const strFrom = attributes.available_from
    ? `Thu, 01 Jan 1970 ${attributes.available_from.slice(0, 17)}`
    : null;
  const strTo = attributes.available_to
    ? `Thu, 01 Jan 1970 ${attributes.available_to.slice(0, 17)}`
    : null;
  const availableFrom = new Date(strFrom);
  const availableTo = new Date(strTo);

  return (
    <Container>
      <Text>I am available from...</Text>
      <TimePicker time={availableFrom} update={handleConfirmFrom} />
      <Text>... to ...</Text>
      <TimePicker time={availableTo} update={handleConfirmTo} />
      <Text>I'd like to chat about:</Text>
      <TextInput
        value={attributes.interests}
        onChangeText={(t) => attributes.interests = t}
        multiline
        editable
        numberOfLines={10}
        />
      <Button onPress={() => profile.save()} title="Save">
        <Text>Save</Text>
      </Button>
    </Container>
  );
}

export default observer(AvailabilityScreen);
