import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Client } from "@stomp/stompjs";
import { connectionTypeArray, type ConnectionType } from '../utils/types';
import styles from '../modules/PerformanceDashboard.module.css';
import type { Member } from './MemberCard';
import { API } from '../utils/API';

// The raw event coming from the websocket
interface RawEvent {
    connectionType: ConnectionType;
    userId: number;
    message: string;
    timestamp: string | number;
}

type MoreUser = Member & {
    isOnline: boolean;
}
// The processed event mapped for the chart
interface ChartEvent extends RawEvent {
    time: string;
    typeValue: number;
}

export const PerformanceDashboard: React.FC = () => {
    const [events, setEvents] = useState<ChartEvent[]>([]);
    const clientRef = useRef<Client | null>(null);
    const [users, setUsers] = useState<MoreUser[]>([]);
    const loadMembers = async () => {
        try {
            const res = await fetch(API + "/users", {
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);

                setUsers(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    useEffect(() => {
        const client = new Client({
            brokerURL: "ws://localhost:8080/admin-ws",
            reconnectDelay: 5000,

            onConnect: () => {
                client.subscribe("/admin/events", (message) => {
                    const event: RawEvent = JSON.parse(message.body);

                    setEvents(prev => {
                        const newPoint: ChartEvent = {
                            ...event,
                            time: new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                            typeValue: connectionTypeArray.indexOf(event.connectionType)
                        };

                        return [...prev, newPoint].slice(-20);
                    });
                });
            },
            onStompError: frame => {
                console.error("STOMP Error:", frame);
            }
        });

        clientRef.current = client;
        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    const addTestEvent = () => {
    const fakeEvent: RawEvent = {
        connectionType: "CONNECT",
        userId: Math.floor(Math.random() * 100),
        message: "Manual test event",
        timestamp: Date.now()
    };

    setEvents(prev => {
        const newPoint: ChartEvent = {
            ...fakeEvent,
            time: new Date(fakeEvent.timestamp).toLocaleTimeString(),
            typeValue: connectionTypeArray.indexOf(fakeEvent.connectionType)
        };

        return [...prev, newPoint].slice(-20);
    });
};
    if (!users) return null;

    const onlineUsers = users.reduce((count, user) => { return user.isOnline ? 1 + count : count }, 0)
    return (
        <div className={styles.dashboardWrapper}>
            <header className={styles.dashboardHeader}>
                <h2>System Performance</h2>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

                    <div className={styles.liveIndicator}>
                        <span className={styles.pulseDot}></span> Live
                    </div>

                    <div className={styles.onlineBadge}>
                        Online Users: {onlineUsers}
                    </div>

                </div>
            </header>

            <div className={styles.dashboardGrid}>
                {/* Real-time Event Stream Card */}
                <div className={styles.dashboardCard}>
                    <h4 className={styles.cardTitle}>Event Traffic</h4>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={events} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#d1d5db' }}
                                />
                                <YAxis
                                    domain={[0, Math.max(connectionTypeArray.length - 1, 4)]}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                                />
                                <Line
                                    type="stepAfter"
                                    dataKey="typeValue"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                                    activeDot={{ r: 6, stroke: '#047857', strokeWidth: 2 }}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Event Summary Table/Log Card */}
                <div className={styles.dashboardCard}>
                    <h4 className={styles.cardTitle}>Recent Logs</h4>
                    <div className={styles.logsContainer}>
                        {events.length === 0 ? (
                            <div className={styles.emptyState}>Waiting for events...</div>
                        ) : (
                            events.slice().reverse().map((e, i) => (
                                <div key={i} className={styles.logItem}>
                                    <div className={styles.logHeader}>
                                        <span className={`log-badge badge-${e.connectionType.toLowerCase()}`}>
                                            {e.connectionType}
                                        </span>
                                        <span className={styles.logTime}>{e.time}</span>
                                    </div>
                                    <div className={styles.logBody}>
                                        <span className={styles.logUser}>User {e.userId}:</span>
                                        <span className={styles.logMessage}>{e.message}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <button onClick={addTestEvent}>Add Test Event</button>
        </div>
    );
};

export default PerformanceDashboard;