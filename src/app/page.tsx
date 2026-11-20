'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Lock, ArrowRight, Delete } from 'lucide-react';

export default function KitchenLoginPage() {
  const router = useRouter();
  const [restaurantId, setRestaurantId] = useState('res_1');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleKeypadPress = (val: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId.trim()) {
      setError('Please provide a restaurant ID');
      return;
    }
    if (pin.length < 4) {
      setError('Enter at least 4-digit PIN');
      return;
    }
    router.push(`/${encodeURIComponent(restaurantId.trim())}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/30">
            <ChefHat className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">FoodAI KDS</h1>
          <p className="text-sm text-neutral-400">Kitchen Display Terminal Login</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Restaurant Terminal ID
            </label>
            <input
              type="text"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="w-full h-14 rounded-2xl bg-neutral-950 border border-neutral-800 px-4 text-center text-lg font-mono font-bold text-white focus:outline-none focus:border-orange-500"
              placeholder="e.g. res_1"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block text-center">
              Staff Passcode PIN
            </label>
            {/* PIN Dots */}
            <div className="flex justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`h-5 w-5 rounded-full border-2 transition-all ${
                    pin.length > idx
                      ? 'bg-orange-500 border-orange-500 scale-110 shadow-md shadow-orange-500/50'
                      : 'border-neutral-700 bg-neutral-950'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Touch-Friendly On-screen Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                type="button"
                key={digit}
                onClick={() => handleKeypadPress(digit)}
                className="h-14 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-xl font-bold text-white transition-all shadow"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPin('')}
              className="h-14 rounded-2xl bg-neutral-950 text-neutral-400 hover:bg-neutral-800 active:scale-95 text-xs font-bold transition-all"
            >
              CLEAR
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="h-14 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-xl font-bold text-white transition-all shadow"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-14 rounded-2xl bg-neutral-950 text-neutral-400 hover:bg-neutral-800 active:scale-95 flex items-center justify-center transition-all"
            >
              <Delete className="h-6 w-6" />
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-16 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 transition-all"
          >
            Enter Kitchen <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
