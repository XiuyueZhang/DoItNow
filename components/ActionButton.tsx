import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ActionButtonProps {
  onPress: () => void;
  color: string;
  text: string;
  size?: 'small' | 'large';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function ActionButton({ 
  onPress, 
  color, 
  text, 
  size = 'large',
  icon,
  style 
}: ActionButtonProps) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.2);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 200 })
    );
    shadowOpacity.value = withSequence(
      withSpring(0.4, { duration: 100 }),
      withSpring(0.2, { duration: 200 })
    );
    onPress();
  };

  const buttonSize = size === 'large' ? 180 : 80;
  const fontSize = size === 'large' ? 18 : 14;

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: color,
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
    },
    style
  ];

  return (
    <AnimatedTouchable
      style={[buttonStyles, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {icon && <>{icon}</>}
      <Text style={[styles.buttonText, { fontSize, marginTop: icon ? 4 : 0 }]}>
        {text}
      </Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});