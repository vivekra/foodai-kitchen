'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, PhoneCall, QrCode, Sparkles, Bike, AlertCircle, CheckCircle2 } from 'lucide-react';
import { KitchenOrder, KitchenStatus } from '../hooks/useKitchenSocket';

interface OrderCardProps {
  order: KitchenOrder;
  onUpdateStatus: (orderId: string, status: KitchenStatus) => void;
}

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const elapsedMinutes = Math.floor((Date.now() - order.createdAt) / 60000);

  // Border & status chip colors
  const statusConfig = {
    PENDING: {
      border: 'border-yellow-500',
      badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      label: 'PENDING',
    },
    ACCEPTED: {
      border: 'border-blue-500',
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      label: 'ACCEPTED',
    },
    PREPARING: {
      border: 'border-orange-500',
      badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      label: 'PREPARING',
    },
    READY: {
      border: 'border-green-500',
      badge: 'bg-green-500/20 text-green-400 border-green-500/40',
      label: 'READY',
    },
    COMPLETED: {
      border: 'border-neutral-700',
      badge: 'bg-neutral-800 text-neutral-400 border-neutral-700',
      label: 'COMPLETED',
    },
  }[order.status] || {
    border: 'border-neutral-700',
    badge: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    label: order.status,
  };

  const getChannelBadge = () => {
    switch (order.orderType) {
      case 'VOICE':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 text-xs font-bold">
            <PhoneCall className="h-3.5 w-3.5" /> AI VOICE
          </span>
        );
      case 'QR_TABLE':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 text-xs font-bold">
            <QrCode className="h-3.5 w-3.5" /> TABLE {order.tableNumber || '#'}
          </span>
        );
      case 'AI_CHAT':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" /> AI CHAT
          </span>
        );
      case 'DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold">
            <Bike className="h-3.5 w-3.5" /> DELIVERY
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col justify-between bg-neutral-900 rounded-3xl border-2 ${statusConfig.border} p-5 shadow-2xl overflow-hidden min-h-[380px]`}
    >
      <div className="space-y-4">
        {/* Ticket Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-wider">{order.orderNumber}</span>
            {getChannelBadge()}
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl border ${
              elapsedMinutes > 15 ? 'bg-red-950/80 text-red-400 border-red-500' : 'bg-neutral-800 text-neutral-300 border-neutral-700'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{elapsedMinutes}m ago</span>
          </div>
        </div>

        {/* Status chip */}
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase border ${statusConfig.badge}`}>
            {statusConfig.label}
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            {order.items.reduce((s, i) => s + i.quantity, 0)} Items
          </span>
        </div>

        {/* Items List */}
        <div className="space-y-2.5 pt-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80 space-y-1">
              <div className="flex items-baseline justify-between text-base">
                <span className="font-extrabold text-white">
                  <span className="text-orange-500 text-lg mr-2 font-black">{item.quantity}x</span>
                  {item.name}
                </span>
                {item.size && <span className="text-xs text-neutral-400 font-bold uppercase">{item.size}</span>}
              </div>
              {item.notes && (
                <p className="text-xs text-amber-300/90 font-medium pl-6 italic">
                  Note: {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-600/30 text-amber-300 text-xs flex items-start gap-1.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
            <span className="font-semibold">{order.specialInstructions}</span>
          </div>
        )}
      </div>

      {/* Touch Action Buttons (56px min height per Apple HIG) */}
      <div className="pt-4 mt-4 border-t border-neutral-800">
        {order.status === 'PENDING' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'ACCEPTED')}
            className="w-full h-14 min-h-[56px] rounded-2xl bg-yellow-500 hover:bg-yellow-400 active:scale-[0.98] text-neutral-950 text-base font-black tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            ACCEPT ORDER
          </button>
        )}

        {order.status === 'ACCEPTED' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'PREPARING')}
            className="w-full h-14 min-h-[56px] rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-base font-black tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            START COOKING
          </button>
        )}

        {order.status === 'PREPARING' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full h-14 min-h-[56px] rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-base font-black tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            MARK AS READY
          </button>
        )}

        {order.status === 'READY' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            className="w-full h-14 min-h-[56px] rounded-2xl bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white text-base font-black tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <CheckCircle2 className="h-5 w-5" /> BUMP / DELIVERED
          </button>
        )}
      </div>
    </motion.div>
  );
}
