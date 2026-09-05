import styles from '../modules/PolicyPage.module.css';

export const PolicyPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.meta}>
            Effective Date: September 2026 &bull; Last Updated: September 2026
          </p>
          <p className={styles.intro}>
            Youth Engedi ("we," "our," or "us") is dedicated to safeguarding your privacy. 
            This Privacy Policy explains how our platform collects, stores, and handles your 
            information when using our services.
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <div className={styles.subGroup}>
              <h3 className={styles.subTitle}>Personal Information You Provide</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Account Credentials:</strong> Email address and hashed passwords (or OAuth authorization tokens).
                </li>
                <li>
                  <strong>Profile Details:</strong> Full name, date of birth, bio, and profile picture cloud links.
                </li>
                <li>
                  <strong>Community Contributions:</strong> Uploaded images, captions, and youth event plans (titles, times, descriptions).
                </li>
              </ul>

              <h3 className={styles.subTitle}>System Diagnostics & Logs</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Audit Trails:</strong> Action values, executed user IDs, timestamps, and status outcomes.
                </li>
                <li>
                  <strong>Application Performance:</strong> Method names, execution runtimes, and system metric records.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <ul className={styles.list}>
              <li>Facilitating authentication, account verification, and role-based permissions (Member, Youth Leader, Admin).</li>
              <li>Rendering community profiles, media galleries, and youth ministry schedules.</li>
              <li>Monitoring security logs to prevent unauthorized access and operational errors.</li>
              <li>Analyzing service execution performance to optimize load times.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Data Retention and Account Status</h2>
            <p className={styles.paragraph}>
              We apply strict security measures, including cryptographic hashing on passwords 
              prior to persistence.
            </p>
            <div className={styles.callout}>
              <strong>Soft Deletion Notice:</strong> When you deactivate your account, your profile is marked as deleted (<code className={styles.code}>is_deleted = true</code>). This immediately suspends active access and removes your visibility across public lists while retaining underlying audit associations for security compliance.
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Sharing</h2>
            <p className={styles.paragraph}>
              We do not monetize or sell your personal data. Data is shared internally based strictly 
              on member role authorizations, with cloud storage infrastructure providers for media hosting, 
              or when mandated by governing legal processes.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Minors and Youth Privacy</h2>
            <p className={styles.paragraph}>
              As a youth ministry platform, we require users below digital age thresholds 
              (such as COPPA or regional equivalents) to obtain permission or coordination from 
              a designated parent, guardian, or ministry leader prior to active account verification.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Your Rights & Contact Information</h2>
            <p className={styles.paragraph}>
              You maintain the right to review, update, or request soft-deletion/permanent removal 
              of your profile records.
            </p>
            <p className={styles.paragraph}>
              For any privacy inquiries or record requests, reach our administration team at:{' '}
              <a href="mailto:tylerkatsha14@gmail.com" className={styles.link}>
                tylerkatsha14@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};