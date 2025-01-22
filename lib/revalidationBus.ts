// lib/revalidationBus.ts
import { EventEmitter } from 'events';

// Create a singleton event bus for revalidation events
class RevalidationBus extends EventEmitter {
    private static instance: RevalidationBus;

    private constructor() {
        super();
    }

    public static getInstance(): RevalidationBus {
        if (!RevalidationBus.instance) {
            RevalidationBus.instance = new RevalidationBus();
        }
        return RevalidationBus.instance;
    }
}

export const revalidationBus = RevalidationBus.getInstance();