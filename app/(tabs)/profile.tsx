import React from 'react';
import { StyleSheet, Switch } from 'react-native';
import { View, Text, ScrollView } from '@/components/Themed';
import { Avatar, Card, Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const { colors, colorScheme, toggleTheme } = useTheme();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header} color="background">
        <Avatar name="João Silva" size={80} />
        <Text type="title" style={styles.name}>
          João Silva
        </Text>
        <Text color="textSecondary">joao.silva@email.com</Text>
      </View>

      {/* Settings */}
      <View style={styles.section} color="background">
        <Text type="subtitle" style={styles.sectionTitle}>
          Configurações
        </Text>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow} color="card">
            <Text>Modo Escuro</Text>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.backgroundTertiary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow} color="card">
            <Text>Notificações</Text>
            <Switch
              value={false}
              trackColor={{ false: colors.backgroundTertiary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>
      </View>

      {/* Menu Items */}
      <View style={styles.section} color="background">
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>📦 Meus Pedidos</Text>
        </Card>
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>❤️ Favoritos</Text>
        </Card>
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>📍 Endereços</Text>
        </Card>
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>💳 Formas de Pagamento</Text>
        </Card>
        <Card style={styles.menuCard} pressable onPress={() => {}}>
          <Text>❓ Ajuda</Text>
        </Card>
      </View>

      <View style={styles.section} color="background">
        <Button
          title="Sair"
          variant="outline"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  name: {
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  settingCard: {
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuCard: {
    marginBottom: 12,
  },
});
