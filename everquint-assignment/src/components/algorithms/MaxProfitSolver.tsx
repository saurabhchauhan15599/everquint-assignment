import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { solveMaxProfit, BUILDINGS } from '@/lib/algorithms';
import { Calculator, TrendingUp, Building2, Clock, DollarSign } from 'lucide-react';

export function MaxProfitSolver() {
  const [time, setTime] = useState<number>(13);
  const [result, setResult] = useState(solveMaxProfit(13));

  const handleCalculate = () => {
    setResult(solveMaxProfit(time));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Max Profit Optimization</CardTitle>
        </div>
        <CardDescription>
          Find the optimal mix of properties for maximum earnings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="time-unit" className="text-sm font-medium">
              Time Units (n)
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="time-unit"
                type="number"
                min="0"
                value={time}
                onChange={(e) => setTime(parseInt(e.target.value) || 0)}
                className="pl-9"
              />
            </div>
          </div>
          <Button onClick={handleCalculate} className="gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BUILDINGS.map((b) => (
            <div
              key={b.symbol}
              className="p-3 rounded-lg border bg-slate-50/50 flex flex-col gap-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{b.name}</span>
                <Badge variant="secondary">{b.symbol}</Badge>
              </div>
              <div className="text-xs text-slate-500">
                {b.buildTime} units | ${b.earningRate}/unit
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-2 border-t">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-700">Results</h3>
            <div className="flex items-center gap-1.5 text-green-600 font-bold">
              <DollarSign className="h-4 w-4" />
              {result.maxEarnings.toLocaleString()}
            </div>
          </div>

          {result.solutions.length > 0 ? (
            <div className="space-y-2">
              {result.solutions.map((sol, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-md bg-white border shadow-sm group hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-slate-400">#{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      {sol.T > 0 && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-sm font-medium">T: {sol.T}</span>
                        </div>
                      )}
                      {sol.P > 0 && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-purple-500" />
                          <span className="text-sm font-medium">P: {sol.P}</span>
                        </div>
                      )}
                      {sol.C > 0 && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-sm font-medium">C: {sol.C}</span>
                        </div>
                      )}
                      {sol.T === 0 && sol.P === 0 && sol.C === 0 && (
                        <span className="text-sm text-slate-400 italic">No buildings developed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm italic">
              No solutions for this input.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
