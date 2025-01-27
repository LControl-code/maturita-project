// app/api/updates/route.ts
export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { TransformStream } from 'node:stream/web';
import { getDbUpdatesEmitter, DBEventType } from '@/lib/dbUpdatesEmitter';

export async function GET(req: NextRequest) {
    // console.log('[DEBUG] SSE GET /api/updates invoked');

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    writer.write(encoder.encode('data: hello\n\n'));

    const emitter = getDbUpdatesEmitter();
    // console.log('[DEBUG] Subscribed to test_data updates (debounced in the emitter)');

    let isClosed = false;

    // 1) The callback for DB updates
    function onUpdate(payload: unknown) {
        if (isClosed) return;
        // console.log('[DEBUG] onTestDataUpdate AFTER DEBOUNCE');
        try {
            writer.write(
                encoder.encode(`event: update\ndata: ${JSON.stringify({ updated: true })}\n\n`)
            );
        } catch (err) {
            // console.warn('[DEBUG] Could not write (already closed?):', err);
        }
    }

    emitter.on(DBEventType.TEST_DATA_UPDATE, onUpdate);

    // 2) Keep-alive interval
    const keepAliveInterval = setInterval(() => {
        if (!isClosed) {
            try {
                writer.write(encoder.encode('data: ping\n\n'));
            } catch (err) {
                // console.warn('[DEBUG] Keep-alive write error:', err);
            }
        }
    }, 25000);

    // 3) When the client disconnects:
    req.signal.addEventListener(
        'abort',
        () => {
            // console.log('[DEBUG] SSE /api/updates connection closing');
            isClosed = true;

            // a) Unsubscribe from DB updates
            emitter.off(DBEventType.TEST_DATA_UPDATE, onUpdate);

            // b) Stop the keep-alive
            clearInterval(keepAliveInterval);

            // c) Try closing the writer
            try {
                // writer.close();
            } catch (err) {
                // console.warn('[DEBUG] SSE close error:', err);
            }
        },
        { once: true }
    );

    // @ts-ignore
    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    });
}
