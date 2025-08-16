import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { ActionButton } from './ActionButton';
import { X } from 'lucide-react-native';

const { height } = Dimensions.get('window');

interface Scene {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface SceneSelectorProps {
  visible: boolean;
  scenes: Scene[];
  selectedScene: Scene;
  onSelect: (scene: Scene) => void;
  onClose: () => void;
}

export function SceneSelector({ visible, scenes, selectedScene, onSelect, onClose }: SceneSelectorProps) {
  const handleSelectScene = (scene: Scene) => {
    onSelect(scene);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Scene</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Choose your current context to personalize your experience
        </Text>

        <View style={styles.scenesContainer}>
          {scenes.map((scene) => (
            <TouchableOpacity
              key={scene.id}
              style={[
                styles.sceneOption,
                selectedScene.id === scene.id && styles.selectedScene,
                { borderColor: scene.color }
              ]}
              onPress={() => handleSelectScene(scene)}
            >
              <Text style={styles.sceneEmoji}>{scene.emoji}</Text>
              <Text style={styles.sceneName}>{scene.name}</Text>
              {selectedScene.id === scene.id && (
                <View style={[styles.selectedIndicator, { backgroundColor: scene.color }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Each scene adapts the app's behavior to match your current activity
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
    lineHeight: 22,
  },
  scenesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sceneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    marginBottom: 12,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  selectedScene: {
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
  },
  sceneEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  sceneName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});