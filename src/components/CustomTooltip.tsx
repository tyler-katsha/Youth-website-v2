import styles from '../modules/PerformanceGraph.module.css'
import type { CustomTooltipProps, PerformanceMetrics } from '../utils/types';
import { parseCreatedAt } from '../utils/Utils';

export const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {

  if (active && payload && payload.length) {
    const data = payload[0].payload as PerformanceMetrics;
    const isFailed = data.executionTime > 1000;

    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipDate}>
          {parseCreatedAt(data.createdAt).toLocaleString()}
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