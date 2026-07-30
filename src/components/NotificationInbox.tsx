import { useCallback, useEffect, useState } from 'react';
import styles from '../modules/NotificationInbox.module.css';
import type { AnnouncementProps, NotificationProps } from '../utils/types';
import { notificationsMockData } from '../utils/mockData';
import { API } from '../utils/API';
import type { PartialToast } from '../modals/Toast';

export const NotificationInbox = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [mockNotifications, setMockNotifications] = useState<NotificationProps[]>(notificationsMockData);
    const [announcements, setAnnouncements] = useState<AnnouncementProps[]>([]);
    const [_loading, setLoading] = useState(false);
    const [_hasMore, setHasMore] = useState(true);
    const [_page, setPage] = useState<number>(0);
    const [_toast, setToast] = useState<PartialToast | null>(null);
    // const unreadCount = mockNotifications.filter(n => !n.isRead).length;
    const toggleOpen = () => setIsOpen(!isOpen);

    const markAsRead = (id: number) => {
        setMockNotifications(mockNotifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    // const markAllAsRead = () => {
    //     setMockNotifications(mockNotifications.map(n => ({ ...n, isRead: true })));
    // };

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
    useEffect(() => {
        findAnnouncements(0);
    }, []);
    return (
        // 2. Apply classes using styles.className
        <div className={styles.inboxWrapper}>

            <button className={styles.bellBtn} onClick={toggleOpen} aria-label="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {/* {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>} */}
            </button>

            {isOpen && (
                <div className={styles.inboxDropdown}>
                    <div className={styles.inboxHeader}>
                        <h3>Notifications</h3>
                        {/* {unreadCount > 0 && (
                            <button className={styles.markAllBtn} onClick={markAllAsRead}>
                                Mark all as read
                            </button>
                        )} */}
                    </div>

                    <div className={styles.inboxList}>
                        {announcements.length === 0 ? (
                            <div className={styles.emptyState}>No new announcements</div>
                        ) : (
                            announcements.map((announcement: AnnouncementProps) => (
                                <div key={announcement.title} className={styles.notifItem} onClick={() => markAsRead(announcement.id)}>
                                    <div className={`${styles.notifIndicator} ${styles[announcement.type]}`}></div>

                                    <div className={styles.notifContent}>
                                        <div className={styles.notifTitleRow}>
                                            <h4>{announcement.title}</h4>
                                            <span className={styles.notifTime}>{announcement.expiresAt}</span>
                                        </div>
                                        <p className={styles.notifMessage}>{announcement.message}</p>
                                    </div>
                                </div>
                            )))}
                    </div>
                </div>
            )}
        </div>
    );

}