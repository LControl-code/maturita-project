// lib/pocketbase.ts
import PocketBase from 'pocketbase';
import { EventSource } from 'eventsource';

if (!globalThis.EventSource) {
    globalThis.EventSource = EventSource;
}

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
export default pb;
