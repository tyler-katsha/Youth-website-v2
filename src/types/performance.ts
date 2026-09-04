export interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: PerformanceMetrics }[];
  label?: string;
}

export interface PerformanceGraphProps {
  performances: PerformanceMetrics[];
  searchTerm?: string;
  onRowClick?: (record: PerformanceMetrics) => void;
}

export interface PerformanceMetrics {
    performanceId: number;
    description: string;
    performanceDetails: string;
    methodName: string;
    executionTime: number;
    createdAt: number[];
}
