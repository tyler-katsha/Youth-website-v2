import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import styles from '../modules/PerformanceGraph.module.css';
import type { PerformanceGraphProps } from '../utils/types';
import { CustomTooltip } from './CustomTooltip';
import { parseCreatedAt } from '../utils/Utils';

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ performances }) => {
  if (!performances || performances.length === 0) {
        return (
            <div className={styles.emptyState}>
                No performance records available for graph.
            </div>
        );
    }

    const sortedData = [...performances].map((performance) => ({...performance, createdAtDate: parseCreatedAt(performance.createdAt)}))
                       .sort((a, b) => a.createdAtDate.getTime() - b.createdAtDate.getTime());

    return (
        <div className={styles.graphContainer}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={sortedData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 10,
                        bottom: 10
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="createdAtDate"
                        tickFormatter={(value) =>
                            value.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        }
                        stroke="#6b7280"
                        fontSize={12}
                        tickMargin={12}
                    />

                    <YAxis
                        label={{
                            value: 'Execution Time (ms)',
                            angle: -90,
                            position: 'insideLeft',
                            fill: '#6b7280',
                            fontSize: 12,
                            offset: -5
                        }}
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => `${value}ms`}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                            stroke: '#9ca3af',
                            strokeWidth: 1,
                            strokeDasharray: '4 4'
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="executionTime"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        dot={{
                            r: 4,
                            fill: '#4f46e5',
                            strokeWidth: 0
                        }}
                        activeDot={{
                            r: 7,
                            fill: '#4f46e5',
                            stroke: '#ffffff',
                            strokeWidth: 2
                        }}
                    />

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};