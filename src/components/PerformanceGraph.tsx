import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import styles from '../modules/PerformanceGraph.module.css'

// Your exact interface
export interface PerformanceMetrics {
  performanceId: number;
  description: string;
  performanceDetails: string;
  methodName: string;
  executionTime: number;
  createdAt: string;
}

interface PerformanceGraphProps {
  filteredPerformances: PerformanceMetrics[];
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: PerformanceMetrics }[];
  label?: string;
}

export const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {

  if (active && payload && payload.length) {
    const data = payload[0].payload as PerformanceMetrics;
    const isFailed = data.executionTime > 1000;

    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipDate}>
          {new Date(data.createdAt).toLocaleString()}
        </p>
        
        <div className={styles.tooltipRow}>
          <strong>Method:</strong> 
          <span className={styles.tooltipMethod}>{data.methodName}</span>
        </div>
        
        <div className={`${styles.tooltipRow} ${isFailed ? styles.statusFailed : styles.statusSuccess}`}>
          <strong>Time:</strong> {data.executionTime} ms
        </div>
        
        <div className={styles.tooltipDetails}>
          <strong>Details:</strong>
          <span style={{ margin: 0 }}>
            {data.performanceDetails || "No details provided"}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ filteredPerformances }) => {
  if (!filteredPerformances || filteredPerformances.length === 0) {
    return (
      <div className={styles.emptyState}>
        No performance records available for graph.
      </div>
    );
  }

  // Sort data chronologically so the line draws left to right correctly
  const sortedData = [...filteredPerformances].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className={styles.graphContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          {/* Subtle grid styling */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          
          <XAxis 
            dataKey="createdAt" 
            tickFormatter={(tickItem) => new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            stroke="#6b7280"
            fontSize={12}
            tickMargin={12}
          />
          
          <YAxis 
            label={{ value: 'Execution Time (ms)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12, offset: -5 }}
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `${value}ms`}
          />
          
          {/* Apply a subtle cursor line when hovering */}
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} 
          />
          
          {/* Indigo line styling */}
          <Line 
            type="monotone" 
            dataKey="executionTime" 
            stroke="#4f46e5" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }}
            activeDot={{ r: 7, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceGraph;