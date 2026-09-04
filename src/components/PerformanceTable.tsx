import styles from '../modules/Logs.module.css';
import type { PerformanceGraphProps } from "../utils/types";
import { parseCreatedAt } from '../utils/Utils';

export const PerformanceTable: React.FC<PerformanceGraphProps> = ({ performances,searchTerm = "", onRowClick }) => {

    const filteredPerformances = performances.filter((performance) =>
        (performance.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (performance.methodName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (performance.performanceDetails || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.logTable}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Method</th>
                        <th>Execution Time</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPerformances.length === 0 ? (
                        <tr>
                            <td colSpan={5} className={styles.emptyState}>No records found.</td>
                        </tr>
                    ) : (
                        filteredPerformances.map((p,index) => (
                            <tr key={index} onClick={() => onRowClick?.(p)} style={{ cursor: 'pointer' }}>
                                <td>{parseCreatedAt(p.createdAt).toLocaleString()}</td>
                                <td>{p.description ?? "N/A"}</td>
                                <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{p.methodName}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${p.executionTime > 1000 ? styles.statusFailed : styles.statusSuccess}`}>
                                        {p.executionTime} ms
                                    </span>
                                </td>
                                <td>{p.performanceDetails ?? "No details provided"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}