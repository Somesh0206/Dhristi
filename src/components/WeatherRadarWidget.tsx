'use client';

import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, Thermometer, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function WeatherRadarWidget() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/weather/open-meteo?lat=11.545&lon=76.135');
      const data = await res.json();
      setWeatherData(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-500/20 text-blue-500 rounded-xl">
            <CloudRain className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Open-Meteo Multi-Depth Soil & Climate Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              Live hydrological feeds (0-7cm, 7-28cm, 28-100cm moisture) for geotechnical pore pressure
            </p>
          </div>
        </div>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Refresh Weather Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {weatherData && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-semibold mb-1">Precipitation</div>
              <div className="text-lg font-black text-blue-500 font-mono">
                {weatherData.current?.precipitationMmHr ?? 0} <span className="text-xs font-normal">mm/hr</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-semibold mb-1">Top Soil (0-7cm)</div>
              <div className="text-lg font-black text-amber-500 font-mono">
                {weatherData.current?.soilMoisture0_7cmPct ?? 0}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-semibold mb-1">Sub-Soil (7-28cm)</div>
              <div className="text-lg font-black text-orange-500 font-mono">
                {weatherData.current?.soilMoisture7_28cmPct ?? 0}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-semibold mb-1">Deep Strata (28-100cm)</div>
              <div className="text-lg font-black text-red-500 font-mono">
                {weatherData.current?.soilMoisture28_100cmPct ?? 0}%
              </div>
            </div>
          </div>

          {/* Daily 7-day snippet */}
          <div className="text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>16-Day Forecast Landslide Risk Trend</span>
              <span className="text-slate-400 font-mono text-[10px]">Source: Open-Meteo Reanalysis Model</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {(weatherData.dailyForecast || []).slice(0, 7).map((day: any) => (
                <div
                  key={day.date}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-center space-y-1"
                >
                  <div className="text-[10px] font-bold text-slate-400">{day.dayLabel}</div>
                  <div className="text-xs font-mono font-bold text-blue-500">{day.precipitationSumMm}mm</div>
                  <div
                    className={`text-[10px] font-black px-1 py-0.5 rounded ${
                      day.landslideRiskPct > 80
                        ? 'bg-red-500/20 text-red-500'
                        : day.landslideRiskPct > 60
                        ? 'bg-amber-500/20 text-amber-500'
                        : 'bg-emerald-500/20 text-emerald-500'
                    }`}
                  >
                    {day.landslideRiskPct}% Risk
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
