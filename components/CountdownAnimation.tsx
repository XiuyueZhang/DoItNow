import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CountdownAnimationProps {
  duration: number;
  onComplete: () => void;
  color: string;
}

export function CountdownAnimation({ duration, onComplete, color }: CountdownAnimationProps) {
  const progress = useSharedValue(0);
  const glowIntensity = useSharedValue(0);
  
  const size = 180;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progress.value = withTiming(1, {
      duration,
      easing: Easing.linear,
    }, (finished) => {
      if (finished) {
        runOnJS(onComplete)();
      }
    });

    glowIntensity.value = withTiming(1, {
      duration: duration * 0.8,
      easing: Easing.inOut(Easing.quad),
    });
  }, [duration, onComplete, progress, glowIntensity]);

  const animatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.3 + (glowIntensity.value * 0.4),
    transform: [{ scale: 1 + (glowIntensity.value * 0.05) }],
  }));

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.circle, { borderColor: `${color}20` }]}>
        <Svg width={size} height={size} style={styles.svg}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`${color}20`}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animatedProps={animatedCircleProps}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
});