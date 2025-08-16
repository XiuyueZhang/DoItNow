import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ActionButton } from './ActionButton';
import { Sparkles } from 'lucide-react-native';

interface Scene {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  scene: Scene;
}

const MOTIVATIONAL_MESSAGES = [
  "You did it! 🎉",
  "Momentum unlocked! ⚡",
  "Keep it flowing! 🌊",
  "You're on fire! 🔥",
  "Amazing progress! ⭐",
  "That's the spirit! 💪",
  "Crushing it! 🚀",
  "Unstoppable! ✨"
];

export function FeedbackModal({ visible, onClose, scene }: FeedbackModalProps) {
  const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={[styles.content, { borderColor: scene.color }]}>
            <View style={styles.iconContainer}>
              <Sparkles size={32} color={scene.color} />
            </View>
            
            <Text style={styles.message}>{randomMessage}</Text>
            
            <Text style={styles.sceneText}>
              {scene.emoji} {scene.name} session complete
            </Text>

            <ActionButton
              onPress={onClose}
              color={scene.color}
              text="Continue"
              size="small"
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 300,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  message: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  sceneText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
});