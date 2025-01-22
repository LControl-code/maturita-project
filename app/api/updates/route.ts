// app/api/updates/route.ts
export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { TransformStream } from 'web-streams-polyfill/ponyfill';
import { getDbUpdatesEmitter, DBEventType } from '@/lib/dbUpdatesEmitter';

export async function GET(req: NextRequest) {
    console.log('[DEBUG] SSE GET /api/updates invoked');

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Initial message (non-blocking)
    writer.write(encoder.encode('data: hello\n\n'));

    const emitter = getDbUpdatesEmitter();

    // This fires only once the emitter's debounce finishes
    const onUpdate = (payload: unknown) => {
        console.log('[DEBUG] onTestDataUpdate AFTER DEBOUNCE:', payload);
        writer.write(
            encoder.encode(`event: update\ndata: ${JSON.stringify({ updated: true })}\n\n`)
        );
    };

    emitter.on(DBEventType.TEST_DATA_UPDATE, onUpdate);
    console.log('[DEBUG] Subscribed to test_data updates (debounced in the emitter)');

    req.signal.addEventListener(
        'abort',
        () => {
            console.log('[DEBUG] SSE /api/updates connection closing');
            try {
                // writer.close();
            } catch (err) {
                console.warn('[DEBUG] Already closed:', err);
            }
        },
        { once: true }
    );

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    });
}
