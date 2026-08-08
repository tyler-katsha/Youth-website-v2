import { useState } from "react"
import { API } from "../utils/API"
import styles from '../modules/TestEmail.module.css'
import type { EmailTestTypes, PartialToast } from "../utils/types"
import { getToken } from "../utils/Utils"
import { Toast } from "../modals/Toast"
export const TestEmail = () => {
    const [toast, setToast] = useState<PartialToast | null>(null)

    const testEmail = async (type: EmailTestTypes) => {
        try {
            const res = await fetch(`${API}/admin/test-email/${type}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "content-type": "application/json",
                    'Authorization': `Bearer ${getToken()}`
                }
            })

            let msg;
            if (!res.ok) {
                msg = await res.json();

                setToast({
                    message: msg.message ?? 'Something went wrong. Please try again',
                    type: 'error'
                })
                return;
            }

            msg = await res.json();

            setToast({
                message: msg.message ?? 'Email sent successfully!',
                type: 'success'
            })
        } catch (err) {
            console.error(err)
            setToast({
                message: 'Something went wrong. Please try again',
                type: 'error'
            })
        }
    }
    return (
        <>

            <div className={styles.emailTestPanel}>
                <div className={styles.panelHeader}>
                    <h2>Email Template Testing</h2>
                    <p>Click a template below to trigger a test email.</p>
                </div>

                <div className={styles.buttonGrid}>
                    <button className={styles.testBtn} onClick={() => testEmail('verify')}>Email Verification</button>
                    <button className={styles.testBtn} onClick={() => testEmail('role-submitted')}>Role Request Submission</button>
                    <button className={styles.testBtn} onClick={() => testEmail('role-request')}>Admin Role Request Notification</button>
                    <button className={styles.testBtn} onClick={() => testEmail('role-approved')}>Role Approval Notification</button>
                    <button className={styles.testBtn} onClick={() => testEmail('role-rejected')}>Role Rejection Notification</button>
                    <button className={styles.testBtn} onClick={() => testEmail('event-created')}>Event Creation Notification</button>
                    <button className={styles.testBtn} onClick={() => testEmail('event-cancelled')}>Event Cancellation Notification</button>
                    <button className={styles.testBtn} onClick={() => testEmail('contact')}>Contact Form Notification</button>
                </div>
            </div>

            {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
        </>

    )
}