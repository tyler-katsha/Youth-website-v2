import { useState } from 'react';
import { EditProfileModal } from '../modals/EditModal';
import styles from '../modules/Profile.module.css';
// import darkModeIcon from '../assets/dark-mode-icon.png';
// import lightModeIcon from '../assets/light-mode-icon.png';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../components/Profile';
import { RedirectUser } from '../components/RedirectUser';
import { useUser } from '../contexts/UserContext';
import { Toast } from '../modals/Toast';
import { ProfileSkeleton } from '../skeletons/pages/ProfileSkeleton';
import type { EditProfileFormData } from '../types/user';
import { API } from '../utils/API';
import { getProfileColor, formatRoles, getAge, getToken, isLocal, mapProfilePayloadToProfile } from '../utils/Utils';
import type { PartialToast } from '../types/modal';

export const ProfilePage = () => {

    const { user, isLoading, updateUser, setUser } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [toast, setToast] = useState<PartialToast | null>(null)
    const navigate = useNavigate();

    const handleSaveProfile = async (formData: EditProfileFormData) => {
        try {


            if (user == null) {
                throw new Error('User is unauthorized');
            }

            const dataToSubmit = new FormData();
            dataToSubmit.append("name", formData.name);
            dataToSubmit.append("bio", formData.bio);

            if (formData.previewUrl) {
                dataToSubmit.append('previewUrl', formData.previewUrl);
            }
            if (formData.image) {
                dataToSubmit.append("image", formData.image);
            }

            const response = await fetch(`${API}/users/update-me`, {
                method: "PUT",
                credentials: "include",
                body: dataToSubmit,
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                setToast({
                    type: 'error',
                    message: errorMessage.message ?? "Update failed"
                })
                return;
            }

            const data = await response.json();

            const saved = updateUser(mapProfilePayloadToProfile(data, user));

            setUser(saved);

            setToast({
                type: 'success',
                message: 'Profile updated'
            })

        } catch (error) {
            setToast({
                type: 'error',
                message: 'Something went wrong Please try again'
            })
        } finally {
            setIsEditModalOpen(false);
        }
    };

    if (isLoading) return <ProfileSkeleton />;
    if (!user) return <RedirectUser />;

    return (
        <div className={styles.pageContainer}>

            <div className={styles.pageWrapper}>
                <div className={styles.profileCard}>

                    <div className={styles.coverPhoto}>
                        <div className={styles.avatarContainer} style={{ backgroundColor: getProfileColor(user.email), fontSize: '1rem' }}>
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

                        {/* <hr className={styles.sectionDivider} />

                        <div className={styles.profileSection}>
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
                                        <button className={styles.passwordBtn} onClick={() => navigate(`/reset-password?email=${user.email}`)}>
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </>)}

                        <hr className={styles.sectionDivider} />
                    </div>
                </div>
            </div>

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