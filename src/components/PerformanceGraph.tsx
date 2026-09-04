import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import styles from '../modules/PerformanceGraph.module.css';
import { parseCreatedAt } from '../utils/Utils';
import { CustomTooltip } from './CustomTooltip';
import type { PerformanceGraphProps } from '../types/performance';

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ performances }) => {
  // Memoize data sorting and transformation to prevent expensive re-sorting on render
  const sortedData = useMemo(() => {
    if (!performances || performances.length === 0) return [];

    return [...performances]
      .map((performance) => ({
        ...performance,
        createdAtDate: parseCreatedAt(performance.createdAt)
      }))
      .sort((a, b) => a.createdAtDate.getTime() - b.createdAtDate.getTime());
  }, [performances]);

  if (sortedData.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No performance records available for graph.</p>
      </div>
    );
  }

  return (
    <div className={styles.graphContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={sortedData}
          margin={{
            top: 16,
            right: 16,
            left: 0,
            bottom: 4
          }}
        >
          <defs>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#e2e8f0"
            vertical={false}
          />

          <XAxis
            dataKey="createdAtDate"
            tickFormatter={(value: Date) =>
              value.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            dy={8}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            width={58}
            tickFormatter={(value) => `${value}ms`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: '#cbd5e1',
              strokeWidth: 1,
              strokeDasharray: '4 4'
            }}
          />

          <Area
            type="monotone"
            dataKey="executionTime"
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="url(#latencyGradient)"
            dot={{
              r: 3.5,
              fill: '#ffffff',
              stroke: '#2563eb',
              strokeWidth: 2
            }}
            activeDot={{
              r: 6,
              fill: '#2563eb',
              stroke: '#ffffff',
              strokeWidth: 2.5
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};