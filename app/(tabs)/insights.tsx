import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ProgressChart } from '@/components/ProgressChart';
import { StatCard } from '@/components/StatCard';

const { width } = Dimensions.get('window');

interface DailyStats {
  date: string;
  buttonPresses: number;
  tasksCompleted: number;
  challengesCompleted: number;
}

const MOCK_WEEKLY_DATA: DailyStats[] = [
  { date: 'Mon', buttonPresses: 8, tasksCompleted: 3, challengesCompleted: 1 },
  { date: 'Tue', buttonPresses: 12, tasksCompleted: 5, challengesCompleted: 2 },
  { date: 'Wed', buttonPresses: 6, tasksCompleted: 2, challengesCompleted: 0 },
  { date: 'Thu', buttonPresses: 15, tasksCompleted: 7, challengesCompleted: 3 },
  { date: 'Fri', buttonPresses: 10, tasksCompleted: 4, challengesCompleted: 1 },
  { date: 'Sat', buttonPresses: 9, tasksCompleted: 3, challengesCompleted: 2 },
  { date: 'Sun', buttonPresses: 7, tasksCompleted: 2, challengesCompleted: 1 },
];

export default function InsightsScreen() {
  const [weeklyData] = useState<DailyStats[]>(MOCK_WEEKLY_DATA);

  const totalButtonPresses = weeklyData.reduce((sum, day) => sum + day.buttonPresses, 0);
  const totalTasksCompleted = weeklyData.reduce((sum, day) => sum + day.tasksCompleted, 0);
  const totalChallengesCompleted = weeklyData.reduce((sum, day) => sum + day.challengesCompleted, 0);

  const averageDaily = Math.round(totalButtonPresses / 7);
  const mostActiveDay = weeklyData.reduce((max, day) => 
    day.buttonPresses > max.buttonPresses ? day : max
  );

  const chartData = weeklyData.map(day => ({
    label: day.date,
    value: day.buttonPresses,
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Your Momentum</Text>
        <Text style={styles.subtitle}>This week's progress</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Actions Taken"
            value={totalButtonPresses.toString()}
            subtitle="button presses"
            color="#14B8A6"
            emoji="⚡"
          />
          
          <StatCard
            title="Tasks Done"
            value={totalTasksCompleted.toString()}
            subtitle="completed"
            color="#3B82F6"
            emoji="✅"
          />
          
          <StatCard
            title="Challenges"
            value={totalChallengesCompleted.toString()}
            subtitle="completed"
            color="#F59E0B"
            emoji="🎯"
          />
          
          <StatCard
            title="Daily Average"
            value={averageDaily.toString()}
            subtitle="actions/day"
            color="#8B5CF6"
            emoji="📊"
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Activity</Text>
          <ProgressChart data={chartData} width={width - 40} height={200} />
        </View>

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Weekly Insights</Text>
          
          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightEmoji}>🔥</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>
                Your most active day was {mostActiveDay.date} with {mostActiveDay.buttonPresses} actions!
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightEmoji}>💪</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>
                You completed {totalTasksCompleted} tasks this week. Keep building that momentum!
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightEmoji}>🚀</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>
                {totalChallengesCompleted > 0 
                  ? `You took on ${totalChallengesCompleted} surprise challenges. You're unstoppable!`
                  : 'Try tapping the action button more for surprise challenges!'
                }
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  chartContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  insightsContainer: {
    marginBottom: 100,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightEmoji: {
    fontSize: 20,
  },
  insightContent: {
    flex: 1,
    paddingTop: 2,
  },
  insightText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
});