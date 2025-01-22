'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SSEClient() {
    const router = useRouter();

    useEffect(() => {
        console.log('[DEBUG] SSEClient mounted');

        const es = new EventSource('/api/updates');
        es.addEventListener('message', (event) => {
            console.log('[DEBUG] SSE "message" event:', event.data);
        });

        // Called AFTER the server-side debounce
        es.addEventListener('update', (event) => {
            console.log('[DEBUG] SSE "update" event:', event.data);
            router.refresh(); // Re-fetch server components
        });

        es.onerror = (err) => {
            console.error('[DEBUG] SSE error:', err);
        };

        return () => {
            console.log('[DEBUG] SSEClient unmounting');
            es.close();
        };
    }, [router]);

    return null;
}
