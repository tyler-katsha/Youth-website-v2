import styles from '../modules/PolicyPage.module.css';

export const PolicyPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.meta}>
            Effective Date: September 2026 &bull; Last Updated: September 2026 (v3.0 Architecture)
          </p>
          <p className={styles.intro}>
            Youth Engedi ("we," "our," or "us") is dedicated to safeguarding your privacy. 
            This Privacy Policy explains how our platform collects, stores, and handles your 
            information when using our services, including our defensive network layers.
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

              <h3 className={styles.subTitle}>Network, Diagnostics & Defensive Telemetry</h3>
              <ul className={styles.list}>
                <li>
                  <strong>Network Identifiers & IP Addresses:</strong> Captured at ingress to enforce rate limits, prevent brute-force abuse, and protect API availability.
                </li>
                <li>
                  <strong>TLS Handshake Fingerprints (JA3):</strong> Cryptographic signature data derived from incoming connection headers to detect User-Agent spoofing and block automated bots.
                </li>
                <li>
                  <strong>Real-Time Session Signals:</strong> Ephemeral WebSocket connection states, active login/logout broadcasts, and connection health metrics.
                </li>
                <li>
                  <strong>Audit Trails & Metrics:</strong> System activity entries (`performedBy`, timestamps, audit statuses) and method-level execution timings.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <ul className={styles.list}>
              <li>Facilitating authentication, account verification, and role-based permissions (Member, Youth Leader, Admin).</li>
              <li>Maintaining live event streaming and interactive performance dashboards via secure WebSockets.</li>
              <li>Enforcing granular traffic quotas and rate limits using token-bucket mechanisms to prevent denial-of-service scenarios.</li>
              <li>Caching read-heavy operations in volatile Redis storage to optimize request speed and minimize database overhead.</li>
              <li>Monitoring system health and fault tolerance via runtime actuator metrics and circuit breaker policies.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Caching & Ephemeral Data Retention</h2>
            <p className={styles.paragraph}>
              In addition to persistent relational databases, our platform operates a distributed Redis caching layer:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Rate-Limit Windows:</strong> IP addresses, token-bucket balances, and JA3 hashes are stored in temporary memory and purged once throttling windows reset.
              </li>
              <li>
                <strong>Cache Eviction:</strong> Cached application data is assigned explicit time-to-live (TTL) limits and does not persist as long-term customer records.
              </li>
              <li>
                <strong>Real-Time Streams:</strong> Live user presence data broadcasted over WebSockets operates in-memory for active dashboards and is not preserved once connections terminate.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Retention and Account Status</h2>
            <p className={styles.paragraph}>
              We apply strict security measures, including cryptographic hashing on passwords 
              prior to persistence.
            </p>
            <div className={styles.callout}>
              <strong>Soft Deletion Notice:</strong> When you deactivate your account, your profile is marked as deleted (<code className={styles.code}>is_deleted = true</code>). This immediately suspends active access, purges warm Redis caches related to your profile, and removes your visibility across public lists while retaining underlying audit associations for security compliance.
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Data Sharing</h2>
            <p className={styles.paragraph}>
              We do not monetize or sell your personal data. Data is shared internally based strictly 
              on member role authorizations, with cloud storage infrastructure providers for media hosting, 
              or when mandated by governing legal processes.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Minors and Youth Privacy</h2>
            <p className={styles.paragraph}>
              As a youth ministry platform, we require users below digital age thresholds 
              (such as COPPA or regional equivalents) to obtain permission or coordination from 
              a designated parent, guardian, or ministry leader prior to active account verification.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Your Rights & Contact Information</h2>
            <p className={styles.paragraph}>
              You maintain the right to review, update, or request soft-deletion/permanent removal 
              of your profile records.
            </p>
            <p className={styles.paragraph}>
              For any privacy inquiries or record requests, reach our administration team at:{' '}
              <a href="mailto:privacy@youthengedi.org" className={styles.link}>
                privacy@youthengedi.org
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};