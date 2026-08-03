import { MemberCard, type Member } from "./MemberCard";
import styles from "../modules/MemberList.module.css";
import { useEffect, useRef, useState } from "react";
import { API } from "../utils/API";
import { Modal } from "../modals/Modal";
import type { AppRole, MemberListProps, Status, ViewMode } from "../utils/types";
import { formatDate, formatRoles, validAdmin } from "../utils/Utils";
import { useUser } from "../contexts/UserContext";
import { RedirectUser } from "./RedirectUser";

export const MemberList: React.FC<MemberListProps> = ({ title }) => {
    const [users, setUsers] = useState<Member[]>([]);
    const [search, setSearch] = useState("");
    const {user} = useUser();
    const [showDeactivateModal,setShowDeactivateModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<Member | null>(null);
    const [view, setView] = useState<ViewMode>("cards");
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [isActivating,setIsActivating] = useState(false);
    const [roleFilter, setRoleFilter] = useState<AppRole | "ALL">("ALL");
    const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
    const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);
    const [isDowngradingRole, setIsDowngradingRole] = useState(false);
    let tempObj:any = {enabled:true,email:null};
    const loaderRef = useRef<HTMLDivElement>(null);
    const openDetails = (record: Member) => {
        setSelectedRecord(record);
        setSelectedRoles(record.roles);
    };
    const closeDetails = () => setSelectedRecord(null);

    const handleUpdateRole = async () => {
        if (!selectedRecord) return;

        setIsUpdatingRole(true);

        try {
            const res = await fetch(`${API}/users/role/${selectedRecord.email}/upgrade`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to update role");
            }

            setUsers(prev => prev.map(member => member.email === selectedRecord.email ? { ...member, roles: selectedRoles } : member));

            setSelectedRecord(prev => prev ? { ...prev, roles: selectedRoles } : null);

        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdatingRole(false);
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
                },
            });

            if (!res.ok) {
                throw new Error("Failed to downgrade role");
            }

            setUsers(prev => prev.map(member => member.email === selectedRecord.email ? { ...member, roles: selectedRoles } : member));

            setSelectedRecord(prev => prev ? { ...prev, roles: selectedRoles } : null);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDowngradingRole(false);
        }
    };

    const handleDeactivate = async () => {

        if (!selectedRecord) return;
        try {
            const response = await fetch(`${API}/users/${tempObj.email}/deactivate`, {
                method: "PUT",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to deactivate account");
            }

            setUsers(prev => prev.map(user => user.email === selectedRecord.email ? {...user, enabled: false}: user)
        );
        tempObj.enabled = true;
        } catch (err) {
            console.error(err);
        } finally{
            setIsDeactivating(false);
        }
    };

    const handleActivate = async () => {
        if (!selectedRecord) return;
        try {
            const response = await fetch(`${API}/users/${tempObj.email}/activate`, {
                method: "PUT",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to activate account");
            }
            setUsers(prev => prev.map(user => user.email === selectedRecord.email ? {...user, enabled: true}: user))

            tempObj.enabled = false;
        } catch (err) {
            console.error(err);
        } finally{
            setIsActivating(false);
        }
    }

    const findAllMembers = async (pageNumber: number) => {
        try {

            if (loading || !hasMore) return;

            setLoading(true);

            const res = await fetch(`${API}/users?page=${pageNumber}&size=100`, {
                method: "GET",
                credentials: "include",
                headers: { 'content-type': 'application/json' }
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        findAllMembers(0);
    }, []);

    console.log(selectedRecord)
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
    if(!user) return <RedirectUser/>

    const isAdmin = validAdmin(user.roles);

    return (
        <>
            <Modal isOpen={!!selectedRecord} onClose={closeDetails} title={selectedRecord ? `${selectedRecord.name} Details` : "Member Details"}>
                {selectedRecord && (
                    <div className={styles.modalContent}>
                        {selectedRecord.profileImageUrl ? (
                            <img src={selectedRecord.profileImageUrl} className={styles.modalImage} alt={selectedRecord.name}/>
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

                                <button className={styles.saveBtn} disabled={isUpdatingRole} onClick={handleUpdateRole}>{isUpdatingRole ? "Updating..." : "Update Role"}</button>
                                <button className={styles.saveBtn} disabled={isDowngradingRole || selectedRecord.roles.length <= 1} onClick={handleDowngradeRole}>{isDowngradingRole ? "Downgrading..." : "Downgrade Role"}</button>
                                {selectedRecord.enabled !== false ? 
                                (<button className={styles.deactivateBtn} disabled={isDeactivating} onClick={() => {setShowDeactivateModal(true);closeDetails();tempObj.enabled=true}}>{isDeactivating ? "Deactivating..." : "Deactivate Member"}</button>) 
                                : 
                                (<button className={styles.activateBtn} disabled={isActivating} onClick={() => {setShowDeactivateModal(true);closeDetails();tempObj.enabled=false}}>{isActivating ? "Activating..." : "Activate Member"}</button>)
                                }
                            </div>)}
                        </div>
                    </div>
                )}
            </Modal>

            <div className={styles.pageWrapper}>
                <h1 className={styles.title}>{title}</h1>

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
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{formatRoles(user.roles)}</td>
                                                <td>{formatDate(user.dateOfBirth)}</td>
                                                <td><span className={user.enabled ? styles.activeStatus : styles.inactiveStatus}>{user.enabled ? "● Active" : "● Inactive"}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div ref={loaderRef}/>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showDeactivateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>{tempObj.enabled ? "Deactivate Account" : "Activate Account"}</h2>
                        <p>
                            Are you sure you want to {tempObj.enabled ? "deactivate":"activate"} your account?
                        </p>
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelBtn} onClick={() => setShowDeactivateModal(false)}>Cancel</button>
                            <button className={styles.confirmDeactivateBtn} onClick={() => {tempObj.enabled ?  handleDeactivate:handleActivate}}>Yes, {tempObj.enabled ? "deactivate":"activate"}</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};