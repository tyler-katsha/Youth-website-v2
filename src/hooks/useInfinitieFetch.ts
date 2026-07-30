import { useEffect, useRef, useState } from "react";

interface PageResponse<T> {
    content: T[];
    last: boolean;
}

interface UserInfiniteFetchProps {
    url: string;
    pageSize?: number;
}

export function useInfiniteFetch<T>({ url, pageSize = 20 }: UserInfiniteFetchProps) {
    const [data, setData] = useState<T[]>([]);
    const [_page, setPage] = useState(0);
    const pageRef = useRef(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loaderRef = useRef<HTMLDivElement>(null);
    const fetchingRef = useRef(false);
    const fetchData = async (pageNumber: number) => {

        if (fetchingRef.current || !hasMore) return;

        fetchingRef.current = true;
        setLoading(true);

        try {

            const response = await fetch(
                `${url}?page=${pageNumber}&size=${pageSize}`,
                {
                    credentials: "include"
                }
            );

            if (!response.ok)
                throw new Error("Failed to fetch");

            const result: PageResponse<T> = await response.json();

            setData((prev: T[]) => [...prev, ...result.content]);
            setHasMore(!result.last);
            setPage(pageNumber);

        } finally {
            fetchingRef.current = false;
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchData(0);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (
                entries[0].isIntersecting &&
                hasMore &&
                !fetchingRef.current
            ) {
                fetchData(pageRef.current + 1);
            }
        });

        if (loaderRef.current)
            observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, []);

    return {
        data,
        loading,
        hasMore,
        loaderRef
    };
}