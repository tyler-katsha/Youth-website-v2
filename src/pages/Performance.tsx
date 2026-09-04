import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { PerformanceSkeleton } from "../skeletons/pages/PerformanceSkeleton";
import { API } from "../utils/API";
import styles from '../modules/Logs.module.css';
import { Modal } from "../modals/Modal";
import { RedirectUser } from "../components/RedirectUser";
import { getToken } from "../utils/Utils";
import { Toast } from "../modals/Toast";
import type { PartialToast, PerformanceMetrics } from "../utils/types";
import { PerformanceDashboard } from "../components/LiveDashboard";
import { PerformanceGraph } from "../components/PerformanceGraph";
import { PerformanceTable } from "../components/PerformanceTable";

export const Performance = () => {
    const { user, isLoading: userLoading } = useUser();
    const [searchTerm, setSearchTerm] = useState("");
    const [performances, setPerformances] = useState<PerformanceMetrics[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<PartialToast | null>(null)
    const [loading, setLoading] = useState(false);
    
    const [viewMode, setViewMode] = useState<"table" | "dashboard" | "graph">("table");
    const [selectedRecord, setSelectedRecord] = useState<PerformanceMetrics | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const loaderRef = useRef<HTMLDivElement>(null);
    const closeDetails = () => setSelectedRecord(null);

    const fetchPerformances = async (pageNumber: number) => {
        const token = getToken();

        try {

            if (loading || !hasMore) return;

            setLoading(true);

            const response = await fetch(`${API}/admin/performances?page=${pageNumber}&size=100`, {
                method: 'GET',
                credentials: 'include',
                headers: { 
                    'content-type': 'application/json',
                    'Authorization':`Bearer ${token}`
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

    return (
        <>

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
                            <button onClick={() => setViewMode("graph")} style={{ padding: "6px 12px", background: viewMode === "graph" ? "#222" : "#eee", color: viewMode === "graph" ? "#fff" : "#000", border: "none", cursor: "pointer" }}>Graph</button>
                            <button onClick={() => setViewMode("dashboard")} style={{ padding: "6px 12px", background: viewMode === "dashboard" ? "#222" : "#eee", color: viewMode === "dashboard" ? "#fff" : "#000", border: "none", cursor: "pointer" }}>Live Dashboard</button>

                            {viewMode === "table" && (<input type="text" placeholder="Search description, method..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />)}
                        </div>
                    </div>

                    {viewMode === "dashboard" && <PerformanceDashboard/>}

                    {viewMode === "graph" && (<PerformanceGraph performances={performances.length > 0 ? performances : []}/>)}  

                    {viewMode === 'table' && <PerformanceTable performances={performances} searchTerm={searchTerm} onRowClick={setSelectedRecord}/>}          
                </div>

            </div>

            {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
            
        </>
    );
};