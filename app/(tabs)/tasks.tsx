import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TaskCard } from '@/components/TaskCard';
import { ActionButton } from '@/components/ActionButton';
import { TaskInputModal } from '@/components/TaskInputModal';
import { Plus } from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  snoozes: number;
  maxSnoozes: number;
  category: string;
}

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review today\'s priorities',
    description: 'Take 2 minutes to plan your day',
    completed: false,
    snoozes: 0,
    maxSnoozes: 2,
    category: 'work'
  },
  {
    id: '2',
    title: 'Clean your workspace',
    description: 'Clear the clutter for better focus',
    completed: false,
    snoozes: 0,
    maxSnoozes: 1,
    category: 'chores'
  },
  {
    id: '3',
    title: 'Take a 5-minute walk',
    description: 'Get your body moving',
    completed: false,
    snoozes: 0,
    maxSnoozes: 3,
    category: 'exercise'
  },
  {
    id: '4',
    title: 'Read one article',
    description: 'Learn something new today',
    completed: false,
    snoozes: 0,
    maxSnoozes: 2,
    category: 'study'
  },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [showTaskInput, setShowTaskInput] = useState(false);

  const currentTask = tasks.find(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleCompleteTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: true }
          : task
      )
    );
  };

  const handleSnoozeTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId && task.snoozes < task.maxSnoozes
          ? { ...task, snoozes: task.snoozes + 1 }
          : task
      )
    );
  };

  const handleAddTask = (title: string, description: string, category: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: description || undefined,
      completed: false,
      snoozes: 0,
      maxSnoozes: 2,
      category,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      work: '💼',
      study: '📚',
      exercise: '💪',
      chores: '🏠',
      personal: '✨'
    };
    return emojiMap[category] || '✨';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Next Step Focus</Text>
        <Text style={styles.subtitle}>
          {currentTask ? 'Focus on one task at a time' : 'All tasks completed! 🎉'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentTask ? (
          <View style={styles.currentTaskContainer}>
            <TaskCard
              task={currentTask}
              emoji={getCategoryEmoji(currentTask.category)}
              onComplete={() => handleCompleteTask(currentTask.id)}
              onSnooze={() => handleSnoozeTask(currentTask.id)}
              isActive={true}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Amazing Work!</Text>
            <Text style={styles.emptyStateText}>
              You've completed all your tasks. Take a moment to celebrate! 🎊
            </Text>
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.sectionTitle}>
              Completed Today ({completedTasks.length})
            </Text>
            {completedTasks.map(task => (
              <View key={task.id} style={styles.completedTaskItem}>
                <Text style={styles.completedTaskEmoji}>
                  {getCategoryEmoji(task.category)}
                </Text>
                <Text style={styles.completedTaskTitle}>{task.title}</Text>
                <Text style={styles.completedTaskCheck}>✓</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          onPress={() => setShowTaskInput(true)}
          color="#14B8A6"
          text="Add Task"
          size="small"
          icon={<Plus size={20} color="#ffffff" />}
        />
      </View>

      <TaskInputModal
        visible={showTaskInput}
        onClose={() => setShowTaskInput(false)}
        onAddTask={handleAddTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentTaskContainer: {
    marginBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  completedSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  completedTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  completedTaskEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  completedTaskTitle: {
    flex: 1,
    fontSize: 16,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  completedTaskCheck: {
    fontSize: 18,
    color: '#10B981',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: 'center',
  },
});