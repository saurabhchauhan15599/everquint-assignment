export interface BuildingType {
  symbol: string;
  name: string;
  buildTime: number;
  earningRate: number;
}

export const BUILDINGS: BuildingType[] = [
  { symbol: 'T', name: 'Theatre', buildTime: 5, earningRate: 1500 },
  { symbol: 'P', name: 'Pub', buildTime: 4, earningRate: 1000 },
  { symbol: 'C', name: 'Commercial Park', buildTime: 10, earningRate: 2000 },
];

export interface MaxProfitResult {
  maxEarnings: number;
  solutions: Record<string, number>[];
}

export function solveMaxProfit(n: number): MaxProfitResult {
  const sorted = [...BUILDINGS].sort((a, b) => 
    (b.earningRate / b.buildTime) - (a.earningRate / a.buildTime)
  );

  const dp = new Array(n + 1).fill(-1);
  const path: Record<string, number>[][] = new Array(n + 1).fill(null).map(() => []);

  dp[0] = 0;
  path[0] = [{ T: 0, P: 0, C: 0 }];

  for (const b of sorted) {
    for (let t = b.buildTime; t <= n; t++) {
      if (dp[t - b.buildTime] !== -1) {
        const earnings = dp[t - b.buildTime] + b.earningRate * (n - t);
        
        if (earnings > dp[t]) {
          dp[t] = earnings;
          path[t] = path[t - b.buildTime].map(p => ({
            ...p,
            [b.symbol]: (p[b.symbol] || 0) + 1
          }));
        } else if (earnings === dp[t] && earnings > 0) {
          const newPaths = path[t - b.buildTime].map(p => ({
            ...p,
            [b.symbol]: (p[b.symbol] || 0) + 1
          }));
          
          for (const np of newPaths) {
            const isDuplicate = path[t].some(ext => 
              ext.T === np.T && ext.P === np.P && ext.C === np.C
            );
            if (!isDuplicate) path[t].push(np);
          }
        }
      }
    }
  }

  let maxProfit = 0;
  for (let t = 0; t <= n; t++) {
    if (dp[t] > maxProfit) maxProfit = dp[t];
  }

  const results: Record<string, number>[] = [];
  const seen = new Set<string>();

  for (let t = 0; t <= n; t++) {
    if (dp[t] === maxProfit) {
      for (const sol of path[t]) {
        const key = `T:${sol.T} P:${sol.P} C:${sol.C}`;
        if (!seen.has(key)) {
          results.push(sol);
          seen.add(key);
        }
      }
    }
  }

  return {
    maxEarnings: maxProfit,
    solutions: results,
  };
}

export function solveWaterTank(heights: number[]) {
  const n = heights.length;
  if (n === 0) return { total: 0, distribution: [] };

  const leftMax = new Array(n).fill(0);
  const rightMax = new Array(n).fill(0);
  const distribution = new Array(n).fill(0);

  leftMax[0] = heights[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
  }

  rightMax[n - 1] = heights[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
  }

  let total = 0;
  for (let i = 0; i < n; i++) {
    const water = Math.min(leftMax[i], rightMax[i]) - heights[i];
    distribution[i] = water;
    total += water;
  }

  return { total, distribution };
}
