import styles from '../modules/PasswordRequirements.module.css'
import type { PasswordRequirementsProps, RuleProps } from '../utils/types'

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({passwordValue}) => {
    const rules:RuleProps[] = [
        {label:'At least 8 characters',met:passwordValue.length >= 8},
        {label:'At least one uppercase letter',met:/[A-Z]/.test(passwordValue)},
        {label:'At least one lowercase letter',met:/[a-z]/.test(passwordValue)},
        {label:'At least one number',met:/[0-9]/.test(passwordValue)},
        {label:'At least one special character',met:/[^A-Za-z0-9]/.test(passwordValue)}
    ];

    return (
        <div className={styles.requirementsContainer}>
            <p className={styles.requirementsTitle}>Password must contain:</p>
            <ul className={styles.rulesList}>
                {rules.map((rule, index) => (
                    <li key={index} className={`${styles.ruleItem} ${rule.met ? styles.met : styles.unmet}`}>
                        {rule.met ? (
                            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>
                        )}
                        <span className={styles.ruleText}>{rule.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}