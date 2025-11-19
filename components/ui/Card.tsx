import React from 'react';
import { StyleSheet, ViewProps, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { View } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';

export type CardProps = ViewProps & {
  pressable?: boolean;
  onPress?: () => void;
  elevated?: boolean;
};

export function Card({ style, pressable, onPress, elevated = true, children, ...props }: CardProps) {
  const { colors } = useTheme();

  const cardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
        elevated && styles.elevated,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  if (pressable && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
