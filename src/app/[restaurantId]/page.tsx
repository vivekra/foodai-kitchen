'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChefHat, Wifi, WifiOff, Volume2, LogOut, Clock } from 'lucide-react';
import { OrderCard } from '@/components/OrderCard';
import { useKitchenSocket, KitchenStatus } from '@/hooks/useKitchenSocket';

export default function KitchenDisplayScreen({ params }: { params: Promise<{ restaurantId: string }> }) {
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.restaurantId;
  const { orders, updateOrderStatus, isConnected } = useKitchenSocket(restaurantId);
  const [filter, setFilter] = useState<'ALL' | KitchenStatus>('ALL');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayedOrders = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const cookingCount = orders.filter((o) => o.status === 'PREPARING' || o.status === 'ACCEPTED').length;
  const readyCount = orders.filter((o) => o.status === 'READY').length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top Bar for Tablet/Kitchen Display */}
      <header className="h-18 px-6 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-black text-lg text-white tracking-wider flex items-center gap-2">
                KITCHEN DISPLAY TERMINAL
                <span className="text-xs font-mono font-normal text-neutral-400">({restaurantId})</span>
              </h1>
              <div className="flex items-center gap-2 text-xs">
                {isConnected ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Wifi className="h-3.5 w-3.5" /> LIVE WEBSOCKET
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 font-bold">
                    <WifiOff className="h-3.5 w-3.5" /> RECONNECTING...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center Filter Buttons */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'ALL' ? 'bg-orange-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ALL ACTIVE ({orders.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'PENDING' ? 'bg-yellow-500 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            PENDING ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('PREPARING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'PREPARING' ? 'bg-orange-500 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            COOKING ({cookingCount})
          </button>
          <button
            onClick={() => setFilter('READY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'READY' ? 'bg-green-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            READY ({readyCount})
          </button>
        </div>

        {/* Right Info: Clock & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-base font-bold text-neutral-200 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>{currentTime}</span>
          </div>

          <Link href="/">
            <button
              className="h-10 w-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors"
              title="Logout / Change Terminal"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </header>

      {/* Main KDS Grid: 3-4 columns */}
      <main className="flex-1 p-6 overflow-y-auto">
        {displayedOrders.length === 0 ? (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-neutral-500 space-y-4">
            <ChefHat className="h-20 w-20 opacity-30 animate-pulse" />
            <h2 className="text-2xl font-black text-neutral-400">NO ACTIVE TICKETS</h2>
            <p className="text-sm">New orders from AI Voice, QR Table, or Online will chime automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
