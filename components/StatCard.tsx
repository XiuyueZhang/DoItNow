import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  emoji: string;
}

export function StatCard({ title, value, subtitle, color, emoji }: StatCardProps) {
  return (
    <View style={[styles.container, { borderTopColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    borderTopWidth: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 16,
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});