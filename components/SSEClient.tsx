'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SSEClient() {
    const router = useRouter();
    let es: EventSource | null = null;

    useEffect(() => {
        console.log('[DEBUG] SSEClient mounted');

        es = new EventSource('/api/updates');
        es.addEventListener('message', (event) => {
            console.log('[DEBUG] SSE "message" event:', event.data);
        });

        es.addEventListener('update', (event) => {
            console.log('[DEBUG] SSE "update" event:', event.data);
            router.refresh();
        });

        es.onerror = (err) => {
            console.error('[DEBUG] SSE error:', err);
        };

        // Listen for the user leaving the page (reload, close tab, etc.)
        const handleBeforeUnload = () => {
            console.log('[DEBUG] Page unloading, closing SSE first');
            if (es) {
                es.close();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            console.log('[DEBUG] SSEClient unmounting, removing listeners and closing SSE');
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (es) {
                es.close();
            }
        };
    }, [router]);

    return null;
}
