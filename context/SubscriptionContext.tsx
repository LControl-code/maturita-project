"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase_connect';

interface SubscriptionContextType {
  [key: string]: Date | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType>({});

export const COLLECTIONS = ['station_a20', 'station_a25', 'station_a26', 'station_s02', 'station_nvh', 'station_r23'];

type FilterType = 'all' | 'failed' | 'non-failed';

interface SubscriptionProviderProps {
  children: React.ReactNode;
  filter: FilterType;
}

export function SubscriptionProvider({ children, filter }: SubscriptionProviderProps) {
  const [lastUpdates, setLastUpdates] = useState<SubscriptionContextType>({});

  useEffect(() => {
    const subscriptions = COLLECTIONS.map(collection =>
      pb.collection(collection).subscribe('*', (e) => {
        const shouldUpdate =
          (filter === 'all') ||
          (filter === 'failed' && e.record.test_fail) ||
          (filter === 'non-failed' && !e.record.test_fail);

        if (shouldUpdate) {
          setLastUpdates(prev => ({
            ...prev,
            [collection]: new Date()
          }));
        }
      }).catch(error => {
        console.error(`Context: Failed to subscribe to ${collection}:`, error);
      })
    );

    return () => {
      subscriptions.forEach((subscription, index) => {
        pb.collection(COLLECTIONS[index]).unsubscribe('*').catch(error => {
          console.error(`Context: Failed to unsubscribe from ${COLLECTIONS[index]}:`, error);
        });
      });
    };
  }, [filter]);

  return (
    <SubscriptionContext.Provider value={lastUpdates}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(collectionName?: string) {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  if (collectionName) {
    return context[collectionName];
  }
  return context;
}