import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CloudRain,
  Sun,
  TrendingUp,
  Clock,
  Car,
  Fuel,
  Activity,
  Droplets,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { neuraxEngine } from '../../services/neuraxService';
import type { WeeklyMacroDay } from '../../types/neurax';

export const WeeklyView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Friday');
  const [weatherCondition, setWeatherCondition] = useState<'dry' | 'light_rain' | 'heavy_rain'>('dry');

  const weeklyData = useMemo(() => neuraxEngine.getWeeklyMacroProfile(), []);

  // Compute hourly curve for selected day with weather factor
  const weatherMultiplier = weatherCondition === 'dry' ? 1.0 : weatherCondition === 'light_rain' ? 1.2 : 1.45;

  const hourlyChartData = useMemo(() => {
    const hours = [
      '00:00', '02:00', '04:00', '06:00', '08:00', '09:00',
      '10:00', '12:00', '14:00', '16:00', '18:00', '19:00',
      '20:00', '22:00'
    ];
    const isWeekend = selectedDay === 'Saturday' || selectedDay === 'Sunday';

    return hours.map((h, i) => {
      let baseCongestion = 20;
      if (isWeekend) {
        if (i >= 5 && i <= 10) baseCongestion = 45;
        if (i >= 9 && i <= 11) baseCongestion = 60;
      } else {
        // AM Peak: 8-10am
        if (h === '08:00' || h === '09:00' || h === '10:00') baseCongestion = 75;
        // Midday: 12-14
        else if (h === '12:00' || h === '14:00') baseCongestion = 40;
        // PM Peak: 17-20
        else if (h === '18:00' || h === '19:00' || h === '20:00') baseCongestion = 88;
        else if (h === '16:00') baseCongestion = 55;
      }

      const adjusted = Math.min(100, Math.round(baseCongestion * weatherMultiplier));
      const speed = Math.max(12, Math.round(52 * (1 - (adjusted / 120))));

      return {
        hour: h,
        congestion: adjusted,
        avg_speed: speed
      };
    });
  }, [selectedDay, weatherMultiplier]);

  return (
    <div id="weekly-view" className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Weekly Macro Patterns & Weather Sensitivity Profiler</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Analysis of recurrent weekly commuter travel cycles, diurnal peak surges, and rainfall delay multipliers.
          </p>
        </div>

        {/* Weather condition selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Simulate Weather:</span>
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setWeatherCondition('dry')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                weatherCondition === 'dry'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Dry (1.0x)</span>
            </button>
            <button
              onClick={() => setWeatherCondition('light_rain')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                weatherCondition === 'light_rain'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>Light Rain (+20%)</span>
            </button>
            <button
              onClick={() => setWeatherCondition('heavy_rain')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                weatherCondition === 'heavy_rain'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-indigo-500" />
              <span>Monsoon (+45%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 Days Pills Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {weeklyData.days.map((d: WeeklyMacroDay) => {
          const isSelected = d.day_name === selectedDay;
          return (
            <div
              key={d.day_name}
              onClick={() => setSelectedDay(d.day_name)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold">{d.day_name.slice(0, 3)}</span>
                <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {d.peak_hours}
                </span>
              </div>
              <div className="text-lg font-extrabold tracking-tight">
                {Math.round(d.avg_congestion * weatherMultiplier)}%
              </div>
              <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                {d.total_trips_k}k daily trips
              </div>
            </div>
          );
        })}
      </div>

      {/* Diurnal Hourly Profile for Selected Day */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Diurnal Flow & Congestion Curve for {selectedDay}
            </h3>
            <p className="text-xs text-slate-500">
              Condition: {weatherCondition.replace('_', ' ').toUpperCase()} • Recurrent commuter distribution
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
              Congestion Index (%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              Avg Speed (km/h)
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="congestion" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Congestion (%)" />
              <Bar dataKey="avg_speed" fill="#10b981" radius={[4, 4, 0, 0]} name="Speed (km/h)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Aggregate Network Impact Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Weekly Vehicle Distance</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">14.2M VKT</div>
            <div className="text-[11px] text-slate-400">Vehicle-kilometers traveled</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Lost Commuter Time</div>
            <div className="text-xl font-bold text-amber-600 mt-0.5">246,000 hrs</div>
            <div className="text-[11px] text-slate-400">Due to bottleneck delay</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Idling Fuel Inefficiency</div>
            <div className="text-xl font-bold text-rose-600 mt-0.5">380,000 Liters</div>
            <div className="text-[11px] text-slate-400">Excess carbon emission waste</div>
          </div>
        </div>
      </div>
    </div>
  );
};
