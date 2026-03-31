import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { solveWaterTank } from '@/lib/algorithms';
import { Droplets, Ruler, Play, Info } from 'lucide-react';
import { toast } from 'sonner';

export function WaterTankVisualizer() {
  const [inputStr, setInputStr] = useState('0,4,0,0,0,6,0,6,4,0');
  const [heights, setHeights] = useState<number[]>([0, 4, 0, 0, 0, 6, 0, 6, 4, 0]);

  const { total, distribution } = useMemo(() => solveWaterTank(heights), [heights]);

  const handleUpdate = () => {
    try {
      const parsed = inputStr
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .map((num) => {
          const n = parseInt(num);
          if (isNaN(n) || n < 0) throw new Error('Invalid height');
          return n;
        });
      
      if (parsed.length === 0) throw new Error('Array cannot be empty');
      setHeights(parsed);
    } catch (e) {
      toast.error('Invalid input. List positive integers separated by commas.');
    }
  };

  const maxVal = Math.max(...heights, 1);
  const barWidth = 40;
  const gap = 4;
  const heightScale = 20;
  const svgWidth = heights.length * (barWidth + gap);
  const svgHeight = maxVal * heightScale + 40;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <CardTitle>Water Tank</CardTitle>
        </div>
        <CardDescription>
          Visualize the water trapped between blocks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="height-array" className="text-sm font-medium">
              Heights (comma separated)
            </Label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="height-array"
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                placeholder="e.g. 0,4,0,0,0,6,0,6,4,0"
                className="pl-9"
              />
            </div>
          </div>
          <Button onClick={handleUpdate} className="gap-2">
            <Play className="h-4 w-4" />
            Visualize
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 text-sm">
            <Info className="h-4 w-4" />
            <span>Trapped Water:</span>
            <span className="font-bold text-base">{total} Units</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-slate-700 rounded-sm" />
              <span className="text-[10px] uppercase font-bold text-slate-500">Block</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-blue-300 rounded-sm" />
              <span className="text-[10px] uppercase font-bold text-blue-500">Water</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[300px] bg-slate-50 border rounded-xl relative overflow-auto p-8 flex items-center justify-center">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          >
            {heights.map((h, i) => {
              const x = i * (barWidth + gap);
              const waterH = distribution[i];
              const blockY = svgHeight - h * heightScale - 20;
              const waterY = blockY - waterH * heightScale;
              
              return (
                <g key={i}>
                  <line 
                    x1={0} 
                    y1={svgHeight - 19} 
                    x2={svgWidth} 
                    y2={svgHeight - 19} 
                    stroke="#e2e8f0" 
                    strokeWidth="2" 
                  />
                  
                  {waterH > 0 && (
                    <rect
                      x={x}
                      y={waterY}
                      width={barWidth}
                      height={waterH * heightScale}
                      fill="#93c5fd"
                      rx="2"
                    />
                  )}

                  <rect
                    x={x}
                    y={blockY}
                    width={barWidth}
                    height={h * heightScale}
                    fill="#334155"
                    rx="2"
                  />

                  <text
                    x={x + barWidth / 2}
                    y={svgHeight}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-medium"
                  >
                    {h}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
