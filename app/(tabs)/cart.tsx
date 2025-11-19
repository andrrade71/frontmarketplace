import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, ScrollView } from '@/components/Themed';
import { Button } from '@/components/ui';

export default function CartScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.emptyState} color="background">
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text type="subtitle" style={styles.emptyTitle}>
          Seu carrinho está vazio
        </Text>
        <Text color="textSecondary" style={styles.emptyDescription}>
          Adicione produtos ao carrinho para vê-los aqui
        </Text>
        <Button
          title="Explorar Produtos"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});
