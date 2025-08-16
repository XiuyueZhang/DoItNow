import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActionButton } from './ActionButton';
import { Clock, CircleCheck as CheckCircle } from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  snoozes: number;
  maxSnoozes: number;
  category: string;
}

interface TaskCardProps {
  task: Task;
  emoji: string;
  onComplete: () => void;
  onSnooze: () => void;
  isActive?: boolean;
}

export function TaskCard({ task, emoji, onComplete, onSnooze, isActive = false }: TaskCardProps) {
  const canSnooze = task.snoozes < task.maxSnoozes;

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{task.title}</Text>
          {task.description && (
            <Text style={styles.description}>{task.description}</Text>
          )}
        </View>
      </View>

      {task.snoozes > 0 && (
        <View style={styles.snoozeIndicator}>
          <Clock size={16} color="#F59E0B" />
          <Text style={styles.snoozeText}>
            Snoozed {task.snoozes}/{task.maxSnoozes} times
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <ActionButton
          onPress={onComplete}
          color="#10B981"
          text="Complete"
          size="small"
          icon={<CheckCircle size={18} color="#ffffff" />}
          style={styles.actionButton}
        />
        
        {canSnooze && (
          <ActionButton
            onPress={onSnooze}
            color="#9CA3AF"
            text="Snooze"
            size="small"
            icon={<Clock size={18} color="#ffffff" />}
            style={styles.actionButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  activeContainer: {
    borderColor: '#14B8A6',
    borderWidth: 2,
    shadowOpacity: 0.15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  snoozeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  snoozeText: {
    fontSize: 12,
    color: '#92400E',
    marginLeft: 6,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});