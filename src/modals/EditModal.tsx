import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import styles from "../modules/EditModal.module.css";
import { acceptArray, type YouthProfileProps } from "../utils/types";
import { FileUpload, type FileUploadRef } from "../components/FileUpload";
import { formatDate, formatRoles } from "../utils/Utils";
// import { API } from "../utils/API";
import { CustomPopup } from "../popups/CustomPopup";

export interface EditProfileFormData {
    name: string;
    bio: string;
    previewUrl: string | null;
    image: File | null;
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: YouthProfileProps;
    onSave: (data: EditProfileFormData) => Promise<void>;
}

export const EditProfileModal = ({ isOpen, onClose, user, onSave }: EditProfileModalProps) => {
    const [loading, setLoading] = useState(false);
    // const [sent, SetSent] = useState(false);
    const [formData, setFormData] = useState<EditProfileFormData>({
        name: "",
        bio: "",
        image: null,
        previewUrl: null
    });
    const [popupConfig, setPopupConfig] = useState({
        isOpen: false,
        type: 'success' as 'success' | 'error',
        message: ''
    });
    const closePopup = () => setPopupConfig(prev => ({ ...prev, isOpen: false }))
    const fileUploadRef = useRef<FileUploadRef>(null);
    const handleFileSelect = (files: File[]) => {
        const file = files[0];

        if (!file) {
            setFormData(prev => ({
                ...prev,
                image: null,
                previewUrl: null
            }));
            return;
        }

        if (formData.previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(formData.previewUrl);
        }

        const newPreviewUrl = URL.createObjectURL(file);

        setFormData(prev => ({
            ...prev,
            image: file,
            previewUrl: newPreviewUrl
        }));
    };

    const handleRemoveImage = () => {
        if (formData.previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(formData.previewUrl);
        }

        fileUploadRef.current?.clear();

        setFormData(prev => ({
            ...prev,
            image: null,
            previewUrl: null
        }));
    };

    useEffect(() => {
        if (!isOpen || !user) return;

        setFormData({
            name: user.name,
            bio: user.bio ?? "",
            image: null,
            previewUrl: user.profileImageUrl || null
        });
    }, [
        isOpen,
        user.name,
        user.bio,
        user.profileImageUrl
    ]);
    useEffect(() => {

        return () => {
            if (formData.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(formData.previewUrl);
            }
        }
    }, [formData.previewUrl])

    // const sendRequest = async () => {
    //     try {
    //         SetSent(true);
    //         const response = await fetch(`${API}/send-request`, {
    //             method: "GET",
    //             credentials: 'include',
    //             headers: { 'content-type': 'application/json' }
    //         })

    //         if (!response.ok) {

    //             const text = await response.text();
    //             setPopupConfig({
    //                 isOpen: true,
    //                 type: 'error',
    //                 message: text ?? 'Failed to send request'
    //             });
    //             throw new Error('Failed to send request');
    //         }

    //         setPopupConfig({
    //             isOpen: true,
    //             type: 'success',
    //             message: 'Request sent.'
    //         });

    //     } catch (err) {
    //         setPopupConfig({
    //             isOpen: true,
    //             type: 'error',
    //             message: 'Something went wrong. Please try again'
    //         });
    //     } finally {
    //         SetSent(false);
    //     }
    // }
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;
    return (
        <Modal
            isOpen={isOpen}
            title="Edit Profile"
            onClose={onClose}
            footer={
                <>
                    <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>Cancel</button>
                    <button form="edit-profile-form" type="submit" className={styles.saveBtn} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
                </>
            }
        >
            <CustomPopup
                isOpen={popupConfig.isOpen}
                type={popupConfig.type}
                message={popupConfig.message}
                onClose={closePopup}
            />
            <form id="edit-profile-form" className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Display Name</label>
                    <div className={styles.readOnlyBox}>{user.name}</div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="name">Email</label>
                    <div className={styles.readOnlyBox}>{user.email}</div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Date of Birth</label>
                    <div className={styles.readOnlyBox}>{formatDate(user.dateOfBirth)}</div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Roles</label>
                    <div className={styles.readOnlyBox}>{formatRoles(user.roles)}</div>
                    {/* <button type='button' onClick={sendRequest} disabled={sent}>{sent ? "Sending..." : "Request role upgrade"}</button> */}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        className={styles.textareaField}
                        value={formData.bio}
                        maxLength={250}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={5}
                    />
                    <div className={styles.bioFooter}>
                        <div className={styles.progressTrack}>
                            <div className={`${styles.progressFill} ${formData.bio.length === 250 ? styles.danger : formData.bio.length >= 225 ? styles.warning : ""}`} style={{width : `${(formData.bio.length / 250) * 100}%`}}/>
                        </div>

                         <span className={`${styles.charCount} ${formData.bio.length >= 225 ? styles.warningText : ""} ${formData.bio.length === 250 ? styles.dangerText : ""}`}>{formData.bio.length}/250</span>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Profile Picture</label>

                    {formData.previewUrl ? (
                        <div className={styles.previewWrapper}>
                            <img src={formData.previewUrl} alt="Profile Preview" className={styles.previewImage} />
                            <button type="button" className={styles.removeBtn} onClick={handleRemoveImage}>Remove</button>
                        </div>
                    ) : <FileUpload ref={fileUploadRef} accept={acceptArray.join(", ")} maxFiles={1} multiple={false} onFileSelect={handleFileSelect} />}


                </div>
            </form>
        </Modal>
    );
};
