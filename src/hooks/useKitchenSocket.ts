'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export type KitchenStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED';

export interface KitchenOrderItem {
  name: string;
  quantity: number;
  size?: string;
  addons?: string[];
  notes?: string;
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  orderType: 'QR_TABLE' | 'VOICE' | 'AI_CHAT' | 'DELIVERY' | 'COLLECTION';
  status: KitchenStatus;
  items: KitchenOrderItem[];
  tableNumber?: string;
  specialInstructions?: string;
  createdAt: number;
}

export function useKitchenSocket(restaurantId: string) {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Sound alert using Web Audio API
  const playAlertSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext may be blocked before first user interaction
    }
  }, []);

  useEffect(() => {
    // Initial sample orders for kitchen terminal preview
    setOrders([
      {
        id: 'ord_k1',
        orderNumber: '#K201',
        orderType: 'VOICE',
        status: 'PENDING',
        createdAt: Date.now() - 60000 * 2, // 2 mins ago
        items: [
          { name: 'Margherita D.O.P.', quantity: 2, notes: 'Extra crispy base' },
          { name: 'Garlic Rosemary Sourdough', quantity: 1 },
        ],
      },
      {
        id: 'ord_k2',
        orderNumber: '#K202',
        orderType: 'QR_TABLE',
        tableNumber: '7',
        status: 'ACCEPTED',
        createdAt: Date.now() - 60000 * 7,
        items: [
          { name: 'Diavola Hot Honey', quantity: 1 },
          { name: 'Truffle & Wild Mushroom', quantity: 1 },
        ],
      },
      {
        id: 'ord_k3',
        orderNumber: '#K203',
        orderType: 'DELIVERY',
        status: 'PREPARING',
        createdAt: Date.now() - 60000 * 14,
        specialInstructions: 'Pack cutlery and extra napkins',
        items: [
          { name: 'Slow-Cooked Beef Shin Ragu', quantity: 2 },
          { name: 'Cacio e Pepe Rigatoni', quantity: 1 },
        ],
      },
      {
        id: 'ord_k4',
        orderNumber: '#K204',
        orderType: 'AI_CHAT',
        status: 'READY',
        createdAt: Date.now() - 60000 * 22,
        items: [{ name: 'House Tiramisu Classico', quantity: 2 }],
      },
    ]);

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join:kitchen', { restaurantId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('order:new', (newOrder: KitchenOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      playAlertSound();
    });

    socket.on('order:update', (payload: { id: string; status: KitchenStatus }) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === payload.id ? { ...o, status: payload.status } : o))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [restaurantId, playAlertSound]);

  const updateOrderStatus = useCallback(
    async (orderId: string, nextStatus: KitchenStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );

      // Auto-remove completed orders after 30 seconds
      if (nextStatus === 'COMPLETED') {
        setTimeout(() => {
          setOrders((prev) => prev.filter((o) => o.id !== orderId));
        }, 30000);
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await fetch(`${apiUrl}/api/v1/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        });
      } catch {
        // Optimistic UI
      }
    },
    []
  );

  return { orders, updateOrderStatus, isConnected };
}
