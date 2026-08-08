import styles from '../modules/Requests.module.css';
import type { Requests, TableProps } from '../utils/types';
import { TableRow } from './TableRow';

export const handleRemoveRow = async (roleReqId:number, setRequests: React.Dispatch<React.SetStateAction<Requests[]>>) => {
        setRequests(prev => prev.filter(req => req.roleReqId !== roleReqId));
}

export const Table: React.FC<TableProps> = ({requests,setRequests}) => {
    return (
        <div className={styles.container}>
            <h1>User Requests</h1>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Role ID</th>
                            <th>User ID</th>
                            <th>Requested Role</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!requests || requests.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={styles.emptyState}>No logs found.</td>
                           </tr> 
                        ) : (requests.map((req) => (
                            <TableRow key={req.roleReqId} userId={req.userId} requestedRole={req.requestedRole} email={req.email} roleReqId={req.roleReqId} wasReviewed={req.wasReviewed} setRequests={setRequests}/>
                        )))}
                    </tbody>
                </table>
        </div>
    );
}