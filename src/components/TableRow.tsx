
import { useState } from 'react';
import styles from '../modules/Requests.module.css'
import { Toast } from '../modals/Toast';
import { API } from '../utils/API';
import { formatRole } from '../utils/Utils';

export interface Requests {
    roleReqId: number;
    userId: number;
    wasReviewed: boolean;
    requestedRole: string;
    email: string;
}

export interface RequestAdminDetails extends Requests {
    adminComment: string;
    review_by: number;
    adminEmail: string;
}
type TableRowProps = Requests & {
    setRequests: React.Dispatch<React.SetStateAction<Requests[]>>;
};

export const TableRow: React.FC<TableRowProps> = ({ roleReqId, userId, requestedRole, email, setRequests }) => {
    const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);

    const openAction = (type: "accept" | "reject") => {
        setActionType(type);
        setShowCommentBox(true);
    };

    const submitAction = async () => {
        if (!actionType || submitting) return;

        setSubmitting(true);

        try {


            const response = await fetch(`${API}/upgrade-request`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roleReqId,
                    requestStatus: actionType === "accept" ? "APPROVED" : "REJECTED",
                    adminComment: comment
                })
            });

            if (!response.ok) {
                throw new Error('Unable to send request');
            }

            setTimeout(() => {
                setRequests(prev =>
                    prev.filter(r => r.roleReqId !== roleReqId)
                );
            }, 300);

            setShowCommentBox(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <>
            <tr className={styles.row}>
                <td>{roleReqId ?? 'Unknown role id'}</td>
                <td>{userId ?? 'Unknown user id'}</td>
                <td>{formatRole(requestedRole) ?? 'Unknown role requested'}</td>
                <td>{email ?? 'Unknown email'}</td>
                <td>
                    <button className={`${styles.btn} ${styles.accept}`} onClick={() => openAction('accept')}>Accept</button>
                    <button className={`${styles.btn} ${styles.deny}`} onClick={() => openAction('reject')}>Deny</button>
                </td>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </tr>
            {showCommentBox && (
                <div className={styles.commentBox}>
                    <textarea
                        placeholder={`Add comment for ${actionType}`}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className={styles.textarea}
                    />

                    <div className={styles.commentActions}>
                        <button onClick={submitAction} className={styles.confirmBtn}>
                            {submitting ? "Proccessing..." :"Confirm"}
                        </button>

                        <button onClick={() => setShowCommentBox(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}