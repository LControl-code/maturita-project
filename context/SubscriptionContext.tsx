"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase_connect';

interface SubscriptionContextType {
  lastUpdate: Date | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType>({ lastUpdate: undefined });

interface SubscriptionProviderProps {
  children: React.ReactNode;
  debug?: boolean; // Add debug prop
}

export function SubscriptionProvider({ children, debug = false }: SubscriptionProviderProps) {
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const subscribeToUpdates = async () => {
      try {
        if (debug) console.log("Context: Subscribing to 'station_updates'");
        await pb.collection('station_updates').subscribe('*', (e) => {
          if (debug) console.log("Context: New update received", e);
          setLastUpdate(new Date());
        });
      } catch (error) {
        if (debug) console.error("Context: Failed to subscribe to 'station_updates':", error);
      }
    };

    subscribeToUpdates();

    return () => {
      pb.collection('station_updates').unsubscribe('*').catch(error => {
        if (debug) console.error("Context: Failed to unsubscribe from 'station_updates':", error);
      });
      if (debug) console.log("Context: Unsubscribed from 'station_updates'");
    };
  }, [debug]);

  return (
    <SubscriptionContext.Provider value={{ lastUpdate }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context.lastUpdate;
}