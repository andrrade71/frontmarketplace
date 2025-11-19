import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { Category } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 3; // 3 cards por linha

export type CategoryCardProps = {
  category: Category;
  onPress?: (category: Category) => void;
};

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { colors } = useTheme();
  const IconComponent = category.IconComponent;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(category)}
      style={[styles.container, { width: CARD_WIDTH }]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        {IconComponent ? (
          <IconComponent width={40} height={40} color={colors.primary} />
        ) : (
          <Text style={styles.icon}>{category.icon}</Text>
        )}
        <Text numberOfLines={1} style={styles.name}>
          {category.name}
        </Text>
        <Text style={styles.count} color="textSecondary">
          {category.productCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    gap: 4,
  },
  icon: {
    fontSize: 32,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  count: {
    fontSize: 10,
  },
});
