import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';

interface ChartData {
  label: string;
  value: number;
}

interface ProgressChartProps {
  data: ChartData[];
  width: number;
  height: number;
}

export function ProgressChart({ data, width, height }: ProgressChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (width - 80) / data.length - 10;
  const chartHeight = height - 40;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (chartHeight - 30);
          const x = 40 + index * (barWidth + 10);
          const y = chartHeight - barHeight;
          
          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#14B8A6"
                rx={4}
                ry={4}
              />
              <Text
                x={x + barWidth / 2}
                y={chartHeight + 20}
                fontSize="12"
                textAnchor="middle"
                fill="#6B7280"
              >
                {item.label}
              </Text>
              <Text
                x={x + barWidth / 2}
                y={y - 5}
                fontSize="10"
                textAnchor="middle"
                fill="#374151"
                fontWeight="600"
              >
                {item.value}
              </Text>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});