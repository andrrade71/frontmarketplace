import { StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { Button } from '@/components/ui';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text type="title">Modal</Text>
      <Text>Este é um exemplo de modal screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
