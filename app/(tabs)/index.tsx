import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { ActionButton } from '@/components/ActionButton';
import { CountdownAnimation } from '@/components/CountdownAnimation';
import { Send, Lightbulb, CheckCircle2 } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface TaskStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskBreakdown {
  goal: string;
  taskType: string;
  steps: TaskStep[];
  environment?: {
    type: string;
    action: string;
    description: string;
  };
}

const TASK_ENVIRONMENTS = {
  exercise: {
    type: 'music',
    action: 'Play energizing workout music',
    description: '🎵 Playing upbeat music to get you moving!'
  },
  writing: {
    type: 'document',
    action: 'Open document editor',
    description: '📝 Creating a focused writing environment'
  },
  study: {
    type: 'focus',
    action: 'Enable focus mode',
    description: '📚 Setting up distraction-free study space'
  },
  work: {
    type: 'productivity',
    action: 'Open work tools',
    description: '💼 Preparing your workspace'
  },
  cleanup: {
    type: 'timer',
    action: 'Start cleanup timer',
    description: '🏠 Time to make your space shine!'
  }
};

export default function HomeScreen() {
  const [goalInput, setGoalInput] = useState('');
  const [taskBreakdown, setTaskBreakdown] = useState<TaskBreakdown | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoadingBreakdown, setIsLoadingBreakdown] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [environmentActivated, setEnvironmentActivated] = useState(false);

  const backgroundOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(1);

  const simulateAIBreakdown = async (goal: string): Promise<TaskBreakdown> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const taskType = detectTaskType(goal);
    const steps = generateStepsForGoal(goal, taskType);
    
    return {
      goal,
      taskType,
      steps,
      environment: TASK_ENVIRONMENTS[taskType as keyof typeof TASK_ENVIRONMENTS]
    };
  };

  const detectTaskType = (goal: string): string => {
    const lowerGoal = goal.toLowerCase();
    if (lowerGoal.includes('exercise') || lowerGoal.includes('workout') || lowerGoal.includes('run') || lowerGoal.includes('gym') || lowerGoal.includes('fitness')) return 'exercise';
    if (lowerGoal.includes('write') || lowerGoal.includes('article') || lowerGoal.includes('report') || lowerGoal.includes('essay') || lowerGoal.includes('blog')) return 'writing';
    if (lowerGoal.includes('study') || lowerGoal.includes('learn') || lowerGoal.includes('read') || lowerGoal.includes('review') || lowerGoal.includes('practice')) return 'study';
    if (lowerGoal.includes('work') || lowerGoal.includes('project') || lowerGoal.includes('task') || lowerGoal.includes('meeting') || lowerGoal.includes('code')) return 'work';
    if (lowerGoal.includes('clean') || lowerGoal.includes('organize') || lowerGoal.includes('tidy') || lowerGoal.includes('declutter')) return 'cleanup';
    return 'work';
  };

  const generateStepsForGoal = (goal: string, taskType: string): TaskStep[] => {
    const baseSteps = [
      { id: '1', title: 'Prepare', description: 'Organize your thoughts and gather necessary tools and materials', completed: false },
      { id: '2', title: 'Start Action', description: 'Begin the first concrete action step immediately', completed: false },
      { id: '3', title: 'Keep Going', description: 'Stay focused and continue pushing forward with the core task', completed: false },
      { id: '4', title: 'Complete Goal', description: 'Finish the final steps and achieve your goal', completed: false }
    ];
    
    if (taskType === 'exercise') {
      return [
        { id: '1', title: 'Change Clothes', description: 'Put on comfortable workout clothes and shoes', completed: false },
        { id: '2', title: 'Warm Up', description: 'Do simple stretches and warm-up exercises', completed: false },
        { id: '3', title: 'Start Exercise', description: 'Begin your actual workout routine', completed: false },
        { id: '4', title: 'Cool Down', description: 'Do post-workout stretches and cleanup', completed: false }
      ];
    }
    
    if (taskType === 'writing') {
      return [
        { id: '1', title: 'Set Up', description: 'Open your document and organize your writing space', completed: false },
        { id: '2', title: 'Write First Line', description: 'Start with the opening sentence or paragraph', completed: false },
        { id: '3', title: 'Develop Content', description: 'Continue writing and developing your main ideas', completed: false },
        { id: '4', title: 'Review & Polish', description: 'Read through and make final edits', completed: false }
      ];
    }
    
    if (taskType === 'study') {
      return [
        { id: '1', title: 'Prepare Materials', description: 'Gather books, notes, and study materials', completed: false },
        { id: '2', title: 'Review Basics', description: 'Start with reviewing fundamental concepts', completed: false },
        { id: '3', title: 'Deep Focus', description: 'Dive into detailed study and practice', completed: false },
        { id: '4', title: 'Test Knowledge', description: 'Quiz yourself or summarize what you learned', completed: false }
      ];
    }
    
    if (taskType === 'cleanup') {
      return [
        { id: '1', title: 'Pick One Area', description: 'Choose a specific area or room to start with', completed: false },
        { id: '2', title: 'Sort Items', description: 'Separate items into keep, donate, and trash piles', completed: false },
        { id: '3', title: 'Clean & Organize', description: 'Clean the space and organize remaining items', completed: false },
        { id: '4', title: 'Final Touch', description: 'Do a final cleanup and enjoy your organized space', completed: false }
      ];
    }
    
    return baseSteps;
  };

  const triggerHapticFeedback = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleGoalSubmit = async () => {
    if (!goalInput.trim()) return;
    
    triggerHapticFeedback();
    setIsLoadingBreakdown(true);
    
    try {
      const breakdown = await simulateAIBreakdown(goalInput);
      setTaskBreakdown(breakdown);
      setCurrentStepIndex(0);
      
      if (breakdown.environment) {
        setEnvironmentActivated(true);
      }
    } catch (error) {
      console.error('Failed to generate task breakdown:', error);
    } finally {
      setIsLoadingBreakdown(false);
    }
  };

  const handleStepStart = () => {
    triggerHapticFeedback();
    setIsCountingDown(true);
    backgroundOpacity.value = withTiming(0.8, { duration: 500 });
    textOpacity.value = withTiming(0.3, { duration: 500 });
  };

  const handleCountdownComplete = () => {
    setIsCountingDown(false);
    setShowCompleteButton(true);
    backgroundOpacity.value = withTiming(1, { duration: 500 });
    textOpacity.value = withTiming(1, { duration: 500 });
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handleStepComplete = () => {
    triggerHapticFeedback();
    setShowCompleteButton(false);
    
    if (taskBreakdown) {
      const updatedSteps = [...taskBreakdown.steps];
      updatedSteps[currentStepIndex].completed = true;
      
      setTaskBreakdown({
        ...taskBreakdown,
        steps: updatedSteps
      });
      
      if (currentStepIndex < taskBreakdown.steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const handleReset = () => {
    setGoalInput('');
    setTaskBreakdown(null);
    setCurrentStepIndex(0);
    setEnvironmentActivated(false);
    setIsCountingDown(false);
    setShowCompleteButton(false);
  };

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const renderGoalInput = () => (
    <View style={styles.goalInputContainer}>
      <View style={styles.headerSection}>
        <Text style={styles.appTitle}>Do It Now</Text>
        <Text style={styles.subtitle}>Tell me what you want to accomplish, and I'll help you start immediately</Text>
      </View>
      
      <View style={styles.inputSection}>
        <TextInput
          style={styles.goalInput}
          placeholder="I want to... (e.g., go for a 30-minute run)"
          placeholderTextColor="#9CA3AF"
          value={goalInput}
          onChangeText={setGoalInput}
          multiline={true}
          maxLength={200}
          autoFocus={true}
        />
        
        <ActionButton
          onPress={handleGoalSubmit}
          color="#14B8A6"
          text={isLoadingBreakdown ? "Analyzing..." : "Break It Down"}
          size="small"
          icon={<Send size={20} color="#ffffff" />}
          style={{ ...styles.submitButton, opacity: goalInput.trim() ? 1 : 0.5 }}
        />
      </View>
    </View>
  );

  const renderTaskBreakdown = () => {
    if (!taskBreakdown) return null;
    
    const currentStep = taskBreakdown.steps[currentStepIndex];
    const isLastStep = currentStepIndex === taskBreakdown.steps.length - 1;
    const allCompleted = taskBreakdown.steps.every(step => step.completed);
    
    return (
      <ScrollView style={styles.breakdownContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.goalSection}>
          <Text style={styles.goalTitle}>{taskBreakdown.goal}</Text>
          
          {environmentActivated && taskBreakdown.environment && (
            <View style={styles.environmentCard}>
              <Lightbulb size={16} color="#14B8A6" />
              <Text style={styles.environmentText}>
                {taskBreakdown.environment.description}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Progress {taskBreakdown.steps.filter(s => s.completed).length}/{taskBreakdown.steps.length}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(taskBreakdown.steps.filter(s => s.completed).length / taskBreakdown.steps.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.stepsContainer}>
          {taskBreakdown.steps.map((step, index) => (
            <View 
              key={step.id} 
              style={[
                styles.stepItem,
                index === currentStepIndex && !step.completed && styles.currentStep,
                step.completed && styles.completedStep
              ]}
            >
              <View style={styles.stepHeader}>
                <View style={[
                  styles.stepNumber,
                  step.completed && styles.stepNumberCompleted,
                  index === currentStepIndex && !step.completed && styles.stepNumberCurrent
                ]}>
                  {step.completed ? (
                    <CheckCircle2 size={16} color="#ffffff" />
                  ) : (
                    <Text style={[
                      styles.stepNumberText,
                      index === currentStepIndex && !step.completed && styles.stepNumberTextCurrent
                    ]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.stepTitle,
                  step.completed && styles.stepTitleCompleted,
                  index === currentStepIndex && !step.completed && styles.stepTitleCurrent
                ]}>
                  {step.title}
                </Text>
              </View>
              <Text style={[
                styles.stepDescription,
                step.completed && styles.stepDescriptionCompleted
              ]}>
                {step.description}
              </Text>
            </View>
          ))}
        </View>
        
        {!allCompleted && (
          <View style={styles.currentStepSection}>
            <Text style={styles.currentStepTitle}>Current Step</Text>
            <View style={styles.currentStepCard}>
              <Text style={styles.currentStepName}>{currentStep.title}</Text>
              <Text style={styles.currentStepDesc}>{currentStep.description}</Text>
              
              <View style={styles.actionSection}>
                {isCountingDown ? (
                  <CountdownAnimation
                    duration={15000}
                    onComplete={handleCountdownComplete}
                    color="#14B8A6"
                  />
                ) : showCompleteButton ? (
                  <ActionButton
                    onPress={handleStepComplete}
                    color="#059669"
                    text={isLastStep ? "Complete Goal" : "Mark Complete"}
                  />
                ) : (
                  <ActionButton
                    onPress={handleStepStart}
                    color="#14B8A6"
                    text={isLastStep ? "Start Final Step" : "Start This Step"}
                  />
                )}
              </View>
            </View>
          </View>
        )}
        
        {allCompleted && (
          <View style={styles.completionSection}>
            <Text style={styles.completionTitle}>🎉 Goal Achieved!</Text>
            <Text style={styles.completionMessage}>Congratulations! You completed "{taskBreakdown.goal}"</Text>
            <ActionButton
              onPress={handleReset}
              color="#8B5CF6"
              text="Start New Goal"
              size="small"
            />
          </View>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Animated.View style={[styles.backgroundGradient, backgroundAnimatedStyle]} />
      
      {!taskBreakdown ? renderGoalInput() : renderTaskBreakdown()}
      
      {taskBreakdown && (
        <View style={styles.resetSection}>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8fafc',
  },
  goalInputContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputSection: {
    alignItems: 'center',
  },
  goalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: '#111827',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minHeight: 120,
    width: '100%',
    textAlignVertical: 'top',
    marginBottom: 30,
  },
  submitButton: {
    width: 200,
  },
  breakdownContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalSection: {
    paddingTop: 60,
    marginBottom: 30,
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  environmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  environmentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 30,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
    borderRadius: 4,
  },
  stepsContainer: {
    marginBottom: 30,
  },
  stepItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currentStep: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  completedStep: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberCompleted: {
    backgroundColor: '#059669',
  },
  stepNumberCurrent: {
    backgroundColor: '#F59E0B',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  stepNumberTextCurrent: {
    color: '#ffffff',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  stepTitleCompleted: {
    color: '#059669',
  },
  stepTitleCurrent: {
    color: '#D97706',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  stepDescriptionCompleted: {
    color: '#047857',
  },
  currentStepSection: {
    marginBottom: 30,
  },
  currentStepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  currentStepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  currentStepName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  currentStepDesc: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  actionSection: {
    alignItems: 'center',
  },
  completionSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginBottom: 30,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  completionMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  resetSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  spacer: {
    height: 100,
  },
});