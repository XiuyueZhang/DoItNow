import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { ActionButton } from './ActionButton';
import { X, Plus } from 'lucide-react-native';

interface TaskInputModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (title: string, description: string, category: string) => void;
}

const CATEGORIES = [
  { id: 'work', name: 'Work', emoji: '💼', color: '#14B8A6' },
  { id: 'study', name: 'Study', emoji: '📚', color: '#3B82F6' },
  { id: 'exercise', name: 'Exercise', emoji: '💪', color: '#F59E0B' },
  { id: 'chores', name: 'Chores', emoji: '🏠', color: '#8B5CF6' },
  { id: 'personal', name: 'Personal', emoji: '✨', color: '#EC4899' },
];

export function TaskInputModal({ visible, onClose, onAddTask }: TaskInputModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  const handleAddTask = () => {
    if (title.trim()) {
      onAddTask(title.trim(), description.trim(), selectedCategory.id);
      setTitle('');
      setDescription('');
      setSelectedCategory(CATEGORIES[0]);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedCategory(CATEGORIES[0]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add New Task</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.inputSection}>
            <Text style={styles.label}>What do you want to accomplish?</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter task title..."
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              autoFocus={true}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add more details..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    selectedCategory.id === category.id && {
                      backgroundColor: `${category.color}15`,
                      borderColor: category.color,
                    }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={[
                    styles.categoryName,
                    selectedCategory.id === category.id && { color: category.color }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <ActionButton
            onPress={handleAddTask}
            color={selectedCategory.color}
            text="Add Task"
            size="small"
            icon={<Plus size={20} color="#ffffff" />}
            style={{ ...styles.addButton, opacity: title.trim() ? 1 : 0.5 }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  titleInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  descriptionInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 80,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  addButton: {
    width: '100%',
  },
});