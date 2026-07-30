import { Table } from '../components/Table'
import { Navigation } from '../components/Navigation';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { API } from '../utils/API';
import type { Requests } from '../components/TableRow';
import { RequestsSkeleton } from '../skeletons/pages/RequestsSkeleton';

export const RequestsPage = () => {

    const { user } = useUser();
    const [requests, setRequests] = useState<Requests[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const loaderRef = useRef<HTMLDivElement>(null);

    const fetchRequests = async (pageNumber: number) => {

        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(`${API}/requests?page=${pageNumber}&size=100`, {
                method: "GET",
                credentials: 'include',
                headers: { "content-type": "application/json" }
            })

           
            if (!response.ok) {
                throw new Error("Unable to fetch requests")
            }

            const temp = await response.json();

            const data: Requests[] = temp.content;

            setRequests(prev => {
                const map = new Map(prev.map(r => [r.roleReqId, r]));
                data.forEach(r => map.set(r.roleReqId, r));
                return Array.from(map.values());
            });

            setHasMore(!temp.last);

            setPage(pageNumber);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRequests(0);
    }, [])

    useEffect(() => {

        const observer = new IntersectionObserver(entries => {

            if (entries[0].isIntersecting && hasMore && !loading) {
                fetchRequests(page + 1);
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect()
    }, [page, hasMore, loading])

    if (!user) {
        return <RequestsSkeleton />;
    }
    if (!requests) return <RequestsSkeleton />;

    return (
        <>
            <Navigation title='Admin' />
            <Table requests={requests} setRequests={setRequests} />
            <div ref={loaderRef}></div>
        </>
    )
}