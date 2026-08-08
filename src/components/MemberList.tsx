import { MemberCard } from "./MemberCard";
import styles from "../modules/MemberList.module.css";
import { useEffect, useRef, useState } from "react";
import { API } from "../utils/API";
import { Modal } from "../modals/Modal";
import type { AppRole, Member, MemberListProps, PartialToast, Status, ViewMode, YouthProfileProps } from "../utils/types";
import { formatDate, formatRoles, getToken, validAdmin } from "../utils/Utils";
import { useUser } from "../contexts/UserContext";
import { RedirectUser } from "./RedirectUser";
import { Toast } from "../modals/Toast";

export const MemberList: React.FC<MemberListProps> = ({ title }) => {

    const [users, setUsers] = useState<Member[]>([]);
    const [search, setSearch] = useState("");
    const { user } = useUser();
    const [selectedRecord, setSelectedRecord] = useState<Member | null>(null);
    const [view, setView] = useState<ViewMode>("cards");
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [roleFilter, setRoleFilter] = useState<AppRole | "ALL">("ALL");
    const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
    const [_selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
    const [isUpgradingRole, setIsUpgradingRole] = useState(false);
    const [isDowngradingRole, setIsDowngradingRole] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);
    const [toast, setToast] = useState<PartialToast | null>(null);
    const openDetails = (record: Member) => {
        setSelectedRecord(record);
        setSelectedRoles(record.roles);
    };
    const closeDetails = () => setSelectedRecord(null);

    const handleUpgradeRole = async () => {
        if (!selectedRecord) return;

        setIsUpgradingRole(true);

        try {
            const res = await fetch(`${API}/users/role/${selectedRecord.email}/upgrade`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            if (!res.ok) {
                throw new Error("Failed to upgrade role");
            }

            const updatedUser: YouthProfileProps = await res.json();

            setUsers(prev => prev.map(member => member.email === updatedUser.email ? updatedUser : member));

            setSelectedRecord(prev => prev ? { ...prev, roles: updatedUser.roles } : null);

            setToast({ message: `Successfully upgraded role`, type: 'success' })
        } catch (err) {
            setToast({ message: 'Failed to upgrade role', type: 'error' });
        } finally {
            setIsUpgradingRole(false);
            closeDetails();
        }
    };

    const handleDowngradeRole = async () => {
        if (!selectedRecord) return;

        setIsDowngradingRole(true);

        try {
            const res = await fetch(`${API}/users/role/${selectedRecord.email}/downgrade`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${getToken()}`
                },
            });

            if (!res.ok) {
                throw new Error("Failed to downgrade role");
            }
            
            const updatedUser: YouthProfileProps = await res.json();

            setUsers(prev => prev.map(member => member.email === updatedUser.email ? updatedUser : member));

            setSelectedRecord(prev => prev ? { ...prev, roles: updatedUser.roles } : null);

            setToast({ message: `Successfully downgraded role`, type: 'success' });

        } catch (err) {
            console.error(err)
            setToast({ message: 'Failed to downgrade role', type: 'error' });
        } finally {
            setIsDowngradingRole(false);
            closeDetails();
        }
    };

    const handleDeactivate = async () => {

        if (!selectedRecord) return;
        try {
            const response = await fetch(`${API}/users/${selectedRecord.email}/deactivate`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to deactivate account");
            }

            setUsers(prev => prev.map(user => user.email === selectedRecord.email ? { ...user, enabled: false } : user));

            setToast({ message: `Successfully deactivated ${selectedRecord.email}`, type: 'success' })
        } catch (err) {
            setToast({ message: 'Failed to deactivate account', type: 'error' });
        } finally {
            setIsDeactivating(false);
            closeDetails();
        }
    };

    const handleActivate = async () => {
        if (!selectedRecord) return;
        try {
            const response = await fetch(`${API}/users/${selectedRecord.email}/activate`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to activate account");
            }
            setUsers(prev => prev.map(user => user.email === selectedRecord.email ? { ...user, enabled: true } : user))

            setToast({ message: `Successfully activated ${selectedRecord.email}`, type: 'success' })

        } catch (err) {
            setToast({ message: 'Failed to activate account', type: 'error' });
        } finally {
            setIsActivating(false);
            closeDetails()
        }
    }

    const findAllMembers = async (pageNumber: number) => {
        try {

            if (loading || !hasMore) return;

            setLoading(true);

            const res = await fetch(`${API}/users?page=${pageNumber}&size=100`, {
                method: "GET",
                credentials: "include",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!res.ok) {
                throw new Error('Unable to fetch all members');
            }

            const temp = await res.json();


            const data: Member[] = temp.content;

            setUsers(prev => [...prev, ...data]);
            setHasMore(!temp.last);

            setPage(pageNumber);
        } catch (err) {
            setToast({ message: 'Could not find all members.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        findAllMembers(0);
    }, []);

    useEffect(() => {

        const observer = new IntersectionObserver(entries => {

            if (entries[0].isIntersecting && hasMore && !loading) {
                findAllMembers(page + 1);
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect()
    }, [page, hasMore, loading])

    const filteredUsers = users.filter((u) => {
        const query = search.toLowerCase();
        const matchesSearch = u.name.toLowerCase().includes(query) || formatDate(u.dateOfBirth).toLowerCase().includes(query) || formatRoles(u.roles).includes(query);
        const matchesRole = roleFilter === "ALL" || u.roles.includes(roleFilter);

        const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' && u.enabled) || (statusFilter === 'INACTIVE' && !u.enabled)
        return matchesSearch && matchesRole && matchesStatus;
    });

    if (!users) return null;
    if (!user) return <RedirectUser />

    const isAdmin = validAdmin(user.roles);

    return (
        <>
            <Modal isOpen={!!selectedRecord} onClose={closeDetails} title={selectedRecord ? `${selectedRecord.name} Details` : "Member Details"}>
                {selectedRecord && (
                    <div className={styles.modalContent}>
                        {selectedRecord.profileImageUrl ? (
                            <img src={selectedRecord.profileImageUrl} className={styles.modalImage} alt={selectedRecord.name} />
                        ) : (
                            <div className={styles.modalPlaceholder}>
                                <span className={styles.modalAvatar}>{selectedRecord.name.split(" ").map(word => word[0]).slice(0, 2).join("").toUpperCase()}</span>
                            </div>
                        )}

                        <hr className={styles.divider} />

                        <div className={styles.memberDetails}>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Name</span>
                                <span className={styles.value}>{selectedRecord.name}</span>
                            </div>

                            <div className={styles.detailRow}>
                                <span className={styles.label}>Current Role</span>
                                <span className={styles.value}>{formatRoles(selectedRecord.roles)}</span>
                            </div>



                            <div className={styles.detailRow}>
                                <span className={styles.label}>Birthday</span>
                                <span className={styles.value}>{selectedRecord.dateOfBirth ? new Date(selectedRecord.dateOfBirth).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "Not provided"}</span>
                            </div>

                            <div className={styles.detailRow}>
                                <span className={styles.label}>Email</span>
                                <span className={styles.value}>{selectedRecord.email}</span>
                            </div>

                            {isAdmin && (<div className={styles.roleSection}>
                                <label className={styles.roleLabel}>
                                    Change Member Role
                                </label>

                                <button className={styles.saveBtn} disabled={isUpgradingRole || selectedRecord.roles.length === 3} onClick={handleUpgradeRole}>{isUpgradingRole ? "Updating..." : "Update Role"}</button>
                                <button className={styles.saveBtn} disabled={isDowngradingRole || selectedRecord.roles.length === 1} onClick={handleDowngradeRole}>{isDowngradingRole ? "Downgrading..." : "Downgrade Role"}</button>
                                {selectedRecord.enabled !== false ?
                                    (<button className={styles.deactivateBtn} disabled={isDeactivating} onClick={() => {
                                        handleDeactivate();
                                        closeDetails();
                                    }}>{isDeactivating ? "Deactivating..." : "Deactivate Member"}</button>)
                                    :
                                    (<button className={styles.activateBtn} disabled={isActivating} onClick={() => {
                                        handleActivate();
                                        closeDetails();
                                    }}>{isActivating ? "Activating..." : "Activate Member"}</button>)
                                }
                            </div>)}
                        </div>
                    </div>
                )}
            </Modal>

            <div className={styles.pageWrapper}>
                <h1 className={styles.title}>{title}</h1>

                <div className={styles.toolBar}>
                    <div className={styles.controlsBar}>
                        <div className={styles.toggleContainer}>
                            <button className={`${styles.toggleBtn} ${view === "cards" ? styles.active : ""}`} onClick={() => setView("cards")}>Cards</button>
                            <button className={`${styles.toggleBtn} ${view === "table" ? styles.active : ""}`} onClick={() => setView("table")}>Table</button>
                        </div>

                        <input className={styles.searchBar} placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />

                        <select className={styles.filter} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as AppRole | "ALL")}>
                            <option value="ALL">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MEMBER">Member</option>
                            <option value="YOUTH_LEADER">Youth Leader</option>
                        </select>

                        <select className={styles.filter} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as Status | "ALL")}>
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <p className={styles.emptyState}>No members found</p>
                ) : (
                    <>
                        {view === "cards" && (
                            <div className={styles.cardGrid}>
                                {filteredUsers.map((user, idx) => (
                                    <div key={user.email ?? idx} onClick={() => openDetails(user)} className={styles.cardWrapper}>
                                        <MemberCard {...user} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {view === "table" && (
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Birthday</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, idx) => (
                                            <tr key={user.email ?? idx} className={styles.tableRow} onClick={() => openDetails(user)} style={{ cursor: 'pointer' }}>
                                                <td data-label="Name">{user.name}</td>
                                                <td data-label="Email">{user.email}</td>
                                                <td data-label="Role">{formatRoles(user.roles)}</td>
                                                <td data-label="Birthday">{formatDate(user.dateOfBirth)}</td>
                                                <td data-label="Status"><span className={user.enabled ? styles.activeStatus : styles.inactiveStatus}>{user.enabled ? "● Active" : "● Inactive"}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div ref={loaderRef} />
                            </div>
                        )}
                    </>
                )}
            </div>
            {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
        </>
    );
};