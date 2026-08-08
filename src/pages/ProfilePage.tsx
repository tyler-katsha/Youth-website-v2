import { useState } from 'react';
import styles from '../modules/Profile.module.css';
import { EditProfileModal, type EditProfileFormData } from '../modals/EditModal';
// import darkModeIcon from '../assets/dark-mode-icon.png';
// import lightModeIcon from '../assets/light-mode-icon.png';
import { useUser } from '../contexts/UserContext';
import { API } from '../utils/API';
import { ProfileSkeleton } from '../skeletons/pages/ProfileSkeleton';
import { RedirectUser } from '../components/RedirectUser';
import { ColorUtil, formatRoles, getAge, getToken, isLocal } from '../utils/Utils';
import { Profile } from '../components/Profile';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../modals/Toast';
import type { PartialToast } from '../utils/types';
// import { useTheme } from '../contexts/ThemeContext';

export const ProfilePage = () => {
    const { user, isLoading, updateUser } = useUser();
    // const { isDark, toggleTheme } = useTheme();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [toast, setToast] = useState<PartialToast | null>(null)
    const navigate = useNavigate();

    const handleSaveProfile = async (formData: EditProfileFormData) => {
        try {
            const dataToSubmit = new FormData();
            dataToSubmit.append("name", formData.name);
            dataToSubmit.append("bio", formData.bio);

            if (formData.image) {
                dataToSubmit.append("image", formData.image);
            }

            const response = await fetch(`${API}/users/update-me`, {
                method: "PUT",
                credentials: "include",
                body: dataToSubmit,
                headers: { 
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                setToast({
                    type: 'error',
                    message: await response.text() ?? "Update failed"
                })
                return;
            }

            const data = await response.json();

            updateUser(data);
            
        } catch (error) {
            setToast({
                type: 'error',
                message: 'Something went wrong Please try again'
            })
        } finally{
            setIsEditModalOpen(false);
        }
    };

    // const handleDeactivate = async () => {
    //     try {
    //         const response = await fetch(`${API}/users`, {
    //             method: "DELETE",
    //             credentials: "include",
    //             headers: {
    //                 'Authorization':`Bearer ${getToken()}`
    //             }
    //         });

    //         if (!response.ok) {
    //             setToast({
    //                 type: 'error',
    //                 message: await response.text() ?? 'Failed to deactivate account'
    //             })
    //             return;
    //         }

    //         const data = await response.json();

    //         updateUser(data);
    //         setToast({
    //             type: 'success',
    //             message: await response.text() ?? 'Successfully deactivated account.'
    //         })
    //     } catch (err) {
    //         setToast({
    //             type: 'error',
    //             message: 'Something went wrong Please try again'
    //         })
    //     } finally {
    //         setShowDeactivateModal(false);
    //         removeAll();
    //     }
    // };

    if (isLoading) return <ProfileSkeleton />;
    if (!user) return <RedirectUser />;

    return (
        <div className={styles.pageContainer}>

            <div className={styles.pageWrapper}>
                <div className={styles.profileCard}>

                    <div className={styles.coverPhoto}>
                        <div className={styles.avatarContainer} style={{ backgroundColor: ColorUtil(), fontSize: '1rem' }}>
                            <div className={styles.avatarImage}>
                                <Profile name={user.name} profileImageUrl={user.profileImageUrl} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.headerInfo}>
                        <div className={styles.nameSection}>
                            <h1>{user.name}</h1>
                            <span className={styles.roleBadge}>{formatRoles(user.roles)}</span>
                        </div>
                        <div className={styles.actionButtons}>
                            <button className={styles.editBtn} onClick={() => setIsEditModalOpen(true)}>
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className={styles.contentLayout}>

                        <div className={styles.detailsGrid}>
                            <div className={styles.infoBlock}>
                                <h3 className={styles.sectionTitle}>About Me</h3>
                                <p className={styles.bioText}>{user.bio || "No bio available."}</p>
                            </div>

                            <div className={styles.infoBlock}>
                                <h3 className={styles.sectionTitle}>Details</h3>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Age</span>
                                    <span className={styles.statValue}>
                                        {getAge(user.dateOfBirth) ? `${getAge(user.dateOfBirth)} years old` : "Not provided"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* <hr className={styles.sectionDivider} /> */}

                        {/* <div className={styles.profileSection}>
                            <h3 className={styles.sectionTitle}>Appearance</h3>

                            <div className={styles.settingRow}>
                                <div className={styles.settingMeta}>
                                    <h4>Theme</h4>
                                    <p>
                                        Choose between light and dark mode. Your preference will be
                                        applied throughout the application.
                                    </p>
                                </div>

                                <button className={`${styles.themeToggleBtn} ${isDark ? styles.darkActive : styles.lightActive}`} onClick={toggleTheme}>
                                    <span className={styles.themeIcon}><img src={isDark ? darkModeIcon:lightModeIcon} alt={isDark ? 'Dark mode' : 'Light mode'}/></span>

                                    <span>
                                        {isDark ? "Dark Mode" : "Light Mode"}
                                    </span>
                                </button>
                            </div>
                        </div> */}

                        {isLocal(user.authProvider) && (
                           <>
                            <hr className={styles.sectionDivider} />

                        <div className={styles.profileSection}>
                            <h3 className={styles.sectionTitle}>Security</h3>
                            <div className={styles.settingRow}>
                                <div className={styles.settingMeta}>
                                    <h4>Account Password</h4>
                                    <p>Update your password regularly to maintain a secure account environment.</p>
                                </div>
                                <button className={styles.passwordBtn} onClick={() => navigate("/reset-password")}>
                                    Change Password
                                </button>
                            </div>
                        </div>
                        </> )}
                            
                        <hr className={styles.sectionDivider} />

                        {/* {user.enabled && (<div className={`${styles.profileSection} ${styles.dangerZoneSection}`}>
                            <h3 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>Danger Zone</h3>
                            <div className={styles.settingRow}>
                                <div className={styles.settingMeta}>
                                    <h4>Deactivate Account</h4>
                                    <p>Once you deactivate your account, your data will be permanently cleared. This process cannot be undone.</p>
                                </div>
                                <button className={styles.deactivateBtn} onClick={() => setShowDeactivateModal(true)}>
                                    Deactivate Account
                                </button>
                            </div>
                        </div>)} */}



                    </div>
                </div>
            </div>

            {/* {showDeactivateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Deactivate Account</h2>
                        <p>
                            Are you sure you want to deactivate your account?
                            This action cannot be undone.
                        </p>
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelBtn} onClick={() => setShowDeactivateModal(false)}>Cancel</button>
                            <button className={styles.confirmDeactivateBtn} onClick={handleDeactivate}>Yes, Deactivate</button>
                        </div>
                    </div>
                </div>
            )} */}

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onSave={handleSaveProfile}
            />

            {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}

        </div>
    );
};