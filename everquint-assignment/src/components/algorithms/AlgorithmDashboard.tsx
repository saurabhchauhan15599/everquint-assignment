import React, { useState } from 'react';
import { MaxProfitSolver } from './MaxProfitSolver';
import { WaterTankVisualizer } from './WaterTankVisualizer';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Droplets, ArrowLeft } from 'lucide-react';

export function AlgorithmDashboard({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'profit' | 'water'>('profit');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Solutions</h1>
            <p className="text-sm text-slate-500 font-medium">Assignment Results</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setTab('profit')}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              tab === 'profit'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Max Profit
          </button>
          <button
            onClick={() => setTab('water')}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              tab === 'water'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Droplets className="h-4 w-4" />
            Water Tank
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tab === 'profit' ? <MaxProfitSolver /> : <WaterTankVisualizer />}
      </div>
    </div>
  );
}
