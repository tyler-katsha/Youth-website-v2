export interface AuditLog {
    id: number;
    now: string;
    value: string;
    performedBy: string;
    status: 'SUCCESSFUL' | 'FAILED';
}