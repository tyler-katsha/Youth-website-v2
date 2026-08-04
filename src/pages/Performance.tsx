import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { PerformanceSkeleton } from "../skeletons/pages/PerformanceSkeleton";
import { API } from "../utils/API";
import styles from '../modules/Logs.module.css';
import { Navigation } from '../components/Navigation';
import { Modal } from "../modals/Modal";
import { RedirectUser } from "../components/RedirectUser";
import { getToken } from "../utils/Utils";
import { Toast, type PartialToast } from "../modals/Toast";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceMetrics {
    performanceId: number;
    description: string;
    performanceDetails: string;
    methodName: string;
    executionTime: number;
    createdAt: string;
}

export const Performance = () => {
    const { user, isLoading: userLoading } = useUser();
    const [performances, setPerformances] = useState<PerformanceMetrics[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<PartialToast | null>(null)
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"table" | "dashboard" | "graph">("table");
    const [selectedRecord, setSelectedRecord] = useState<PerformanceMetrics | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const loaderRef = useRef<HTMLDivElement>(null);


    const openDetails = (record: PerformanceMetrics) => setSelectedRecord(record);
    const closeDetails = () => setSelectedRecord(null);

    const fetchPerformances = async (pageNumber: number) => {
        try {

            if (loading || !hasMore) return;

            setLoading(true);

            const response = await fetch(`${API}/admin/performances?page=${pageNumber}&size=100`, {
                method: 'GET',
                credentials: 'include',
                headers: { 
                    'content-type': 'application/json',
                    'Authorization':`Bearer ${getToken()}`
                 }
            });

            if (!response.ok) {
                setToast({
                    type: 'error',
                    message: await response.text() ?? 'Failed to deactivate account'
                })
                return;
            }

            const temp = await response.json();

            const data: PerformanceMetrics[] = temp.content;


            setPerformances(prev => [...prev, ...data]);

            setHasMore(!temp.last);

            setPage(pageNumber);
        } catch (err) {
            setToast({
                type: 'error',
                message: 'Something went wrong Please try again'
            })
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformances(0);
    }, []);

    useEffect(() => {

        const observer = new IntersectionObserver(entries => {

            if (entries[0].isIntersecting && hasMore && !loading) {
                fetchPerformances(page + 1);
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect()
    }, [page, hasMore, loading])

    if (userLoading || isLoading) return <PerformanceSkeleton />;
    if (!user) return <RedirectUser />;

    const filteredPerformances = performances.filter((performance) =>
        (performance.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (performance.methodName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (performance.performanceDetails || "").toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <>
            <Navigation title="Admin" />

            <Modal isOpen={!!selectedRecord} onClose={closeDetails} title="Performance Details">
                {selectedRecord && (
                    <div>
                        <p><strong>Method:</strong> {selectedRecord.methodName}</p>
                        <p><strong>Description:</strong> {selectedRecord.description}</p>
                        <p><strong>Execution Time:</strong> {selectedRecord.executionTime} ms</p>
                        <hr className={styles.divider} />
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{selectedRecord.performanceDetails}</pre>
                    </div>
                )}
            </Modal>
            <div className={styles.pageWrapper}>
                <div className={styles.dashboardContainer}>
                    <div className={styles.header}>
                        <h1>Performance Metrics</h1>

                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                            <button onClick={() => setViewMode("table")} style={{ padding: "6px 12px", background: viewMode === "table" ? "#222" : "#eee", color: viewMode === "table" ? "#fff" : "#000", border: "none", cursor: "pointer" }}>Table</button>
                            {/* <button onClick={() => setViewMode("graph")} style={{ padding: "6px 12px", background: viewMode === "graph" ? "#222" : "#eee", color: viewMode === "graph" ? "#fff" : "#000", border: "none", cursor: "pointer" }}>Graph</button> */}
                            {/* <button onClick={() => setViewMode("dashboard")} style={{ padding: "6px 12px", background: viewMode === "dashboard" ? "#222" : "#eee", color: viewMode === "dashboard" ? "#fff" : "#000", border: "none", cursor: "pointer" }}>Live Dashboard</button> */}

                            {viewMode === "table" && (
                                <input type="text" placeholder="Search description, method..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            )}
                        </div>
                    </div>

                    {
                        // "Add in later features"
                    }
                    {/* {viewMode === "graph" ? (
                        <div style={{ width: "100%", height: "500px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={performances}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="createdAt"
                                        tickFormatter={(value) =>
                                            new Date(value).toLocaleTimeString()
                                        }
                                    />

                                    <YAxis
                                        label={{
                                            value: "Execution Time (ms)",
                                            angle: -90,
                                            position: "insideLeft",
                                        }}
                                    />

                                    <Tooltip
                                        formatter={(value) => [`${value} ms`, "Execution Time"]}
                                        labelFormatter={(label) =>
                                            new Date(label).toLocaleString()
                                        }
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="executionTime"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{ r: 5 }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
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
                                        filteredPerformances.map((p) => (
                                            <tr key={p.performanceId} onClick={() => openDetails(p)} style={{ cursor: 'pointer' }}>
                                                <td>{new Date(p.createdAt).toLocaleString()}</td>
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
                    )} */}

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
                                    filteredPerformances.map((p) => (
                                        <tr key={p.performanceId} onClick={() => openDetails(p)} style={{ cursor: 'pointer' }}>
                                            <td>{new Date(p.createdAt).toLocaleString()}</td>
                                            <td>{p.description ?? "N/A"}</td>
                                            <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{p.methodName}</td>
                                            <td><span className={`${styles.statusBadge} ${p.executionTime > 1000 ? styles.statusFailed : styles.statusSuccess}`}>{p.executionTime} ms</span></td>
                                            <td>{p.performanceDetails ?? "No details provided"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div ref={loaderRef} style={{ height: 40, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>{loading && <span>Loading...</span>}</div>
                    </div>

                    
                </div>

            </div>

            {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
            
        </>
    );
};