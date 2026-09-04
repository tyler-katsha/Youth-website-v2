import React, { useEffect, useState, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Client } from "@stomp/stompjs";
import { connectionTypeArray, type ChartEvent, type ConnectionType, type RawEvent, type TrafficPayload } from '../utils/types';
import styles from '../modules/PerformanceDashboard.module.css';
import { getToken } from '../utils/Utils';
import { RedirectUser } from './RedirectUser';
import { API, WEBSOCKET_API } from '../utils/API';

export const PerformanceDashboard: React.FC = () => {
    const [events, setEvents] = useState<ChartEvent[]>([]);
    const [bufferSize, setBufferSize] = useState<number>(0);
    const [maxBufferSize, setMaxBufferSize] = useState<number>(0);
    const [hasAuthError, setHasAuthError] = useState<boolean>(false);
    const clientRef = useRef<Client | null>(null);

    const formatTime = (timestamp: number | string): string => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    };

    const mapRawToChartEvent = useCallback((event: RawEvent): ChartEvent => {
        const connType: ConnectionType = event.connectionType;
        return {
            ...event,
            connectionType: connType,
            time: formatTime(event.timestamp),
            typeValue: connectionTypeArray.indexOf(connType)
        };
    }, []);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            setHasAuthError(true);
            return;
        }

        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        fetch(`${API}/dashboard/stats`, { headers })
            .then(res => {
                if (res.status === 401 || res.status === 403) throw new Error("AUTH_ERROR");
                return res.ok ? res.json() : null;
            })
            .then(data => {
                if (data) {
                    if (typeof data.currentSize === 'number') setBufferSize(data.currentSize);
                    if (typeof data.maxSize === 'number') setMaxBufferSize(data.maxSize);
                }
            })
            .catch(err => {
                if (err.message === "AUTH_ERROR") setHasAuthError(true);
            });

        fetch(`${API}/dashboard/recent`, { headers })
            .then(res => {
                if (res.status === 401 || res.status === 403) throw new Error("AUTH_ERROR");
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then((history: RawEvent[]) => {
                if (Array.isArray(history)) {
                    setEvents(history.map(mapRawToChartEvent).slice(-20));
                }
            })
            .catch(err => {
                if (err.message === "AUTH_ERROR") setHasAuthError(true);
                else console.error("Failed to load historical events:", err);
            });

        // STOMP Real-Time Stream
        const client = new Client({
            brokerURL: `${WEBSOCKET_API}/admin-ws`,
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                client.subscribe("/admin/events", (message) => {
                    try {
                        const traffic: TrafficPayload = JSON.parse(message.body);

                        console.log(traffic)
                        if (typeof traffic.currentSize === 'number') {
                            setBufferSize(traffic.currentSize);
                        }
                        if (typeof traffic.maxSize === 'number') {
                            setMaxBufferSize(traffic.maxSize);
                        }
                        if (traffic.event) {
                            const chartEvent = mapRawToChartEvent(traffic.event);
                            setEvents(prev => [...prev, chartEvent].slice(-20));
                        }
                    } catch (e) {
                        console.error("Failed to parse incoming WebSocket message:", e);
                    }
                });
            },
            onStompError: frame => {
                console.error("STOMP protocol error:", frame.headers['message'], frame.body);
            },
            onWebSocketClose: () => {
                console.warn("STOMP connection closed");
            }
        });

        clientRef.current = client;
        client.activate();

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [mapRawToChartEvent]);

    if (hasAuthError) {
        return <RedirectUser />;
    }

    const percentFull = maxBufferSize > 0 ? Math.min(100, Math.round((bufferSize / maxBufferSize) * 100)) : 0;

    return (
        <div className={styles.dashboardWrapper}>
            <header className={styles.dashboardHeader}>
                <h2>System Performance</h2>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className={styles.liveIndicator}>
                        <span className={styles.pulseDot}></span> Live
                    </div>
                    <div className={styles.onlineBadge}>
                        Online Users: {bufferSize}
                    </div>
                    <div className={styles.onlineBadge}>
                        Percent full: {percentFull}%
                    </div>
                </div>
            </header>

            <div className={styles.dashboardGrid}>
                <div className={styles.dashboardCard}>
                    <h4 className={styles.cardTitle}>Event Traffic</h4>
                    <div className={styles.chartContainer} style={{ minHeight: '300px', width: '100%' }}>
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

                <div className={styles.dashboardCard}>
                    <h4 className={styles.cardTitle}>Recent Logs</h4>
                    <div className={styles.logsContainer}>
                        {events.length === 0 ? (
                            <div className={styles.emptyState}>Waiting for events...</div>
                        ) : (
                            events.slice().reverse().map((e, idx) => (
                                <div key={`${e.email}-${e.timestamp}-${events.length - idx}`} className={styles.logItem}>
                                    <div className={styles.logHeader}>
                                        <span>{e.connectionType}</span>
                                        <span className={styles.logTime}>{e.time}</span>
                                    </div>
                                    <div className={styles.logBody}>
                                        <span className={styles.logUser}>User: {e.email}:</span>
                                        <span className={styles.logMessage}>{e.message}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};