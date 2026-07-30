import { useEffect, useRef, useState, useCallback } from "react";
import { AnnouncementCard } from "../components/AnnouncementCard";
import { Footer } from "../components/Footer";
import { Navigation } from "../components/Navigation";
import { Modal } from "../modals/Modal";
import { Toast, type PartialToast } from "../modals/Toast";
import styles from '../modules/Announcement.module.css';
import { API } from "../utils/API";
import type { AnnouncementProps } from "../utils/types";

const INITIAL_FORM_STATE: Omit<AnnouncementProps, 'id'> = {
    title: '',
    message: '',
    type: 'INFO',
    createdAt: 'Just now',
    expiresAt: '',
    isUrgent: false
};

export const Announcement = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementProps[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<AnnouncementProps | null>(null);
    const [formData, setFormData] = useState<Omit<AnnouncementProps, 'id'>>(INITIAL_FORM_STATE);
    
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState<number>(0);
    const [toast, setToast] = useState<PartialToast | null>(null);
    
    const loaderRef = useRef<HTMLDivElement>(null);

    const isCreating = selectedRecord?.id === -1;

    const closeDetails = () => {
        setSelectedRecord(null);
        setFormData(INITIAL_FORM_STATE);
    };

    const openDetails = (announcement: AnnouncementProps) => {
        setSelectedRecord(announcement);
        setFormData({
            title: announcement.title,
            message: announcement.message,
            type: announcement.type,
            createdAt: announcement.createdAt || 'Just now',
            expiresAt: announcement.expiresAt || 'Never',
            isUrgent: announcement.isUrgent
        });
    };

    const openCreateModal = () => {
        const newRecord = { ...INITIAL_FORM_STATE, id: -1 } as AnnouncementProps;
        setSelectedRecord(newRecord);
        setFormData(INITIAL_FORM_STATE);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checkedValue = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({ ...prev, [name]: isCheckbox ? checkedValue : value }));
    };

    const findAnnouncements = useCallback(async (pageNumber: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API}/announcements?page=${pageNumber}&size=30`, {
                method: "GET",
                credentials: 'include',
                headers: { 'content-type': 'application/json' }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message ?? 'Failed to fetch announcements');
            }

            const temp = await response.json();

            const data = temp.content;
            
            setHasMore(!data.last);
            setAnnouncements(prev => [...prev, ...data]);
            setPage(pageNumber);
        } catch (err: any) {
            setToast({ message: err.message || 'Could not find announcements.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    const saveAnnouncement = async (dataToSave: AnnouncementProps) => {
        setSubmitting(true);
        const method = isCreating ? "POST" : "PUT";
        
        try {
            const response = await fetch(`${API}/announcements`, {
                method,
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSave)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message ?? 'Something went wrong. Please try again');
            }

            if (isCreating) {
                setAnnouncements(prev => [data, ...prev]);
            } else {
                setAnnouncements(prev => prev.map(a => a.id === dataToSave.id ? data : a));
            }

            setToast({ 
                message: data.message ?? `Successfully ${isCreating ? 'created' : 'updated'} announcement`, 
                type: 'success' 
            });
            closeDetails();

        } catch (err: any) {
            setToast({ message: err.message, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const removeAnnouncement = async (announcement: AnnouncementProps) => {
        const temp = announcement;
        try {
            const response = await fetch(`${API}/announcements/${announcement.id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'content-type': 'application/json' }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message ?? 'Something went wrong. Please try again');
            }

            setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
            
            setToast({ message: 'Successfully removed announcement', type: 'success' });
        } catch (err: any) {
            setToast({ message: err.message, type: 'error' });
            setAnnouncements(prev => [...prev,temp]);
        }
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedRecord) return;
        saveAnnouncement({ ...formData, id: selectedRecord.id } as AnnouncementProps);
    };

    useEffect(() => {
        findAnnouncements(0);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                findAnnouncements(page + 1);
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [page, hasMore, loading, findAnnouncements]);

    return (
        <>
            <Navigation title="Announcements" />

            <Modal isOpen={!!selectedRecord} onClose={closeDetails} title={isCreating ? "Create Announcement" : `${formData.title || 'Announcement'} Details`}>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="title" className={styles.label}>Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className={styles.inputField} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="message" className={styles.label}>Message</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} className={styles.inputField} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="type" className={styles.label}>Notification Type</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange} className={styles.inputField}>
                            <option value="INFO">Info</option>
                            <option value="ANNOUNCEMENT">Announcement</option>
                            <option value="EVENT">Event</option>
                            <option value="WARNING">Warning</option>
                            <option value="ERROR">Error</option>
                            <option value="SUCCESS">Success</option>
                            <option value="SYSTEM">System</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="createdAt" className={styles.label}>Time (Created)</label>
                        <input type="text" id="createdAt" name="createdAt" value={formData.createdAt} onChange={handleChange} required placeholder="e.g., 2 hours ago" readOnly className={`${styles.inputField} ${styles.viewOnlyInput}`} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="expiresAt" className={styles.label}>Expires At</label>
                        <input type="text" id="expiresAt" name="expiresAt" value={formData.expiresAt || ''} onChange={handleChange} placeholder="e.g., 2024-12-31 10:00 AM" className={styles.inputField} />
                    </div>

                    <div className={styles.inputGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" id="isUrgent" name="isUrgent" checked={formData.isUrgent || false} onChange={handleChange} style={{ width: 'auto', cursor: 'pointer' }} />
                        <label htmlFor="isUrgent" className={styles.label} style={{ marginBottom: 0, cursor: 'pointer' }}>Mark as Urgent</label>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={closeDetails} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? (isCreating ? "Creating..." : "Updating...") : "Save Changes"}
                        </button>
                    </div>
                </form>
            </Modal>

            <div style={{ padding: '20px', maxWidth: '500px', display: 'flex', flexDirection: 'column', margin: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                <div className={styles.headerContainer}>
                    <h2 className={styles.headerTitle}>Recent Announcements</h2>
                    <button className={styles.createBtn} onClick={openCreateModal}>Create Announcement +</button>
                </div>
                
                {announcements.length === 0 ? (<div className={styles.noAnnouncements}>No Announcements</div>) : (
                    <div className={styles.gridContainer}>
                        {announcements.map((announcement) => (
                            <div key={announcement.id}>
                                <AnnouncementCard {...announcement} editAnnouncement={() => openDetails(announcement)} removeAnnouncement={removeAnnouncement} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div ref={loaderRef} style={{ height: 40, display: 'flex', justifyContent: 'center', alignContent: 'center' }}/>
            
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <Footer />
        </>
    );
};