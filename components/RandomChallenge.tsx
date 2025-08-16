import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ActionButton } from './ActionButton';
import { Zap, X } from 'lucide-react-native';

interface RandomChallengeProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const CHALLENGES = [
  {
    title: "1-Minute Desk Clean-up",
    description: "Clear the clutter from your workspace",
    duration: "1 min",
    emoji: "🧹"
  },
  {
    title: "Shoulder Stretch Break",
    description: "Roll your shoulders and stretch your neck",
    duration: "30 sec",
    emoji: "🤸‍♀️"
  },
  {
    title: "Deep Breathing",
    description: "Take 5 deep breaths and center yourself",
    duration: "1 min",
    emoji: "🧘‍♀️"
  },
  {
    title: "Hydration Check",
    description: "Drink a full glass of water",
    duration: "30 sec",
    emoji: "💧"
  },
  {
    title: "Quick Walk",
    description: "Take a brief walk around your space",
    duration: "2 min",
    emoji: "🚶‍♀️"
  },
  {
    title: "Gratitude Moment",
    description: "Think of 3 things you're grateful for",
    duration: "1 min",
    emoji: "🙏"
  }
];

export function RandomChallenge({ visible, onClose, onComplete }: RandomChallengeProps) {
  const [currentChallenge, setCurrentChallenge] = useState(CHALLENGES[0]);

  useEffect(() => {
    if (visible) {
      const randomIndex = Math.floor(Math.random() * CHALLENGES.length);
      setCurrentChallenge(CHALLENGES[randomIndex]);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.challengeIcon}>
            <Zap size={24} color="#F59E0B" />
          </View>
          <Text style={styles.title}>Surprise Challenge!</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.challengeEmoji}>{currentChallenge.emoji}</Text>
          
          <Text style={styles.challengeTitle}>{currentChallenge.title}</Text>
          
          <Text style={styles.challengeDescription}>
            {currentChallenge.description}
          </Text>
          
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{currentChallenge.duration}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <ActionButton
            onPress={onComplete}
            color="#F59E0B"
            text="I Did It!"
            size="small"
            style={styles.actionButton}
          />
          
          <ActionButton
            onPress={onClose}
            color="#9CA3AF"
            text="Skip This Time"
            size="small"
            style={styles.actionButton}
          />
        </View>
      </View>
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
  challengeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  challengeEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  challengeDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  durationBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 40,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
});