import { useEffect, useRef, useState } from 'react';
import styles from '../modules/Logs.module.css';
import { API } from '../utils/API';
import { useUser } from '../contexts/UserContext';
import { Modal } from '../modals/Modal';
import { RedirectUser } from '../components/RedirectUser';
import { Toast } from '../modals/Toast';
import type { AuditLog, PartialToast } from '../utils/types';
import { getToken } from '../utils/Utils';


export const Logs = () => {


    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [_isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [toast, setToast] = useState<PartialToast | null>(null);
    const { user, isLoading } = useUser();
    const [selectedRecord, setSelectedRecord] = useState<AuditLog | null>(null);
    const loaderRef = useRef<HTMLDivElement>(null);
    const openDetails = (record: AuditLog) => setSelectedRecord(record);
    const closeDetails = () => setSelectedRecord(null);

    const fetchLogs = async (pageNumber: number) => {

        try {
            const response = await fetch(`${API}/admin/logs?page=${pageNumber}&size=100`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                setToast({message: error.message ?? 'Failed to fetch logs',type:'error'})
                return;
            }

            const temp = await response.json();

            const data: AuditLog[] = temp.content;

            setLogs(prev => [...prev, ...data]);

            setHasMore(!temp.last);

            setPage(pageNumber);
        } catch (error) {
            setToast({message: 'Could not load system logs.',type:'error'})
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(0);
    }, []);

    useEffect(() => {

        const observer = new IntersectionObserver(entries => {

            if (entries[0].isIntersecting && hasMore && !loading) {
                fetchLogs(page + 1);
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect()
    }, [page, hasMore, loading])


    if (!user || isLoading) {
        return <RedirectUser />;
    }

    const filteredLogs = logs.filter(log => (log.value.toLowerCase().includes(searchTerm.toLowerCase()) || log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())) && (statusFilter == 'ALL' || statusFilter == log.status));

    return (
        <>

            <Modal isOpen={!!selectedRecord} onClose={closeDetails} title="AuditLog Details">
                {selectedRecord && (
                    <div>
                        <p><strong>User:</strong> {selectedRecord.performedBy}</p>
                        <p><strong>Status:</strong> {selectedRecord.status}</p>
                        <p><strong>Timestamp:</strong> {selectedRecord.now}</p>
                        <hr className={styles.divider} />
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{selectedRecord.value}</pre>
                    </div>
                )}
            </Modal>
            <div className={styles.pageWrapper}>
                <div className={styles.dashboardContainer}>
                    <div className={styles.header}>
                        <h1>System Logs</h1>
                        <input type="text" placeholder="Search logs, users, or actions..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.dropDownBox}>
                            <option value="ALL" className={styles.dropDownOption}>All</option>
                            <option value="SUCCESSFUL" className={styles.dropDownOption}>Successful</option>
                            <option value="FAILED" className={styles.dropDownOption}>Failed</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <div className={styles.loading}>Loading secure logs...</div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.logTable}>
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>User</th>
                                        <th>Action / Activity</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className={styles.emptyState}>No logs found.</td>
                                        </tr>
                                    ) : (
                                        filteredLogs.map((log) => (
                                            <tr key={log.id} onClick={() => openDetails(log)} style={{ cursor: 'pointer' }}>
                                                <td>{new Date(log.now).toLocaleString()}</td>
                                                <td className={styles.userCell}>{log.performedBy}</td>
                                                <td>{log.value}</td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${log.status === 'FAILED' ? styles.statusFailed : styles.statusSuccess}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <div ref={loaderRef} style={{ height: 40, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>{loading && <span>Loading...</span>}</div>
                        </div>
                    )}
                </div>
            </div>
            {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
        </>
    );
};