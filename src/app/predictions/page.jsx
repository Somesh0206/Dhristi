'use client';

import React, { useState } from 'react';
import WeatherRadarWidget from '@/components/WeatherRadarWidget';
import { useApp } from '@/context/AppContext';
import {
  mock50YearDisasters,
  mockPrediction7Days,
  mockPrediction30Days,
  calculateSimulatedRisk } from
'@/data/predictionsData';
import {

  Line,
  AreaChart,
  Area,


  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer } from
'recharts';
import {
  TrendingUp,
  History,
  Sliders,
  AlertTriangle,
  BrainCircuit,
  CloudRain,
  Activity,
  Layers,

  CheckCircle2 } from
'lucide-react';

export default function PredictionsPage() {
  const { language, t } = useApp();
  const [forecastHorizon, setForecastHorizon] = useState('7days');

  // Simulation Sandbox State
  const [simRainfall, setSimRainfall] = useState(45);
  const [simSeismic, setSimSeismic] = useState(1.8);
  const [simSoilSaturation, setSimSoilSaturation] = useState(85);
  const [simSlopeAngle, setSimSlopeAngle] = useState(38);

  const simResult = calculateSimulatedRisk(simRainfall, simSeismic, simSoilSaturation, simSlopeAngle);

  const forecastData = forecastHorizon === '7days' ? mockPrediction7Days : mockPrediction30Days;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'एआई जोखिम पूर्वानुमान एवं 50-वर्षीय जलवायु टेलीमेट्री' : 'AI Risk Forecasting & 50-Year Climate Telemetry'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('predictions.title', 'AI Predictive Hazard Analytics & Early Warning')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t(
              'predictions.subtitle',
              'Machine learning ensemble models forecasting landslide susceptibility, slope pore pressure, and 72-hour rainfall thresholds.'
            )}
          </p>
        </div>
      </div>

      {/* Live Open-Meteo Weather & Soil Moisture Feed */}
      <WeatherRadarWidget />

      {/* Section 1: ML Predictive Forecast Charts */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>{language === 'hi' ? 'बहु-आपदा संभाव्यता पूर्वानुमान (ML Models)' : 'Multi-Hazard Probability Forecasting'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi' ?
              'उपग्रह मौसम विज्ञान मॉडल और मृदा छिद्र-जल दबाव सेंसर पर आधारित विफलता संभाव्यता' :
              'Projected failure probabilities based on satellite meteorological models and pore-water pressure sensors'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setForecastHorizon('7days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
              forecastHorizon === '7days' ?
              'bg-amber-500 text-white shadow' :
              'text-slate-600 dark:text-slate-300 hover:text-white'}`
              }>
              
              {language === 'hi' ? '7-दिवसीय उच्च-रिज़ॉल्यूशन' : '7-Day High-Resolution Horizon'}
            </button>
            <button
              onClick={() => setForecastHorizon('30days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
              forecastHorizon === '30days' ?
              'bg-amber-500 text-white shadow' :
              'text-slate-600 dark:text-slate-300 hover:text-white'}`
              }>
              
              {language === 'hi' ? '30-दिवसीय दीर्घकालिक अनुमान' : '30-Day Multi-Week Projection'}
            </button>
          </div>
        </div>

        {/* Forecast Area Chart */}
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="landslideGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="floodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="compositeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px'
                }} />
              
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="landslideRiskPct"
                name="Landslide Slope Failure Risk (%)"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#landslideGrad)" />
              
              <Area
                type="monotone"
                dataKey="floodRiskPct"
                name="Flash Flood Inundation Risk (%)"
                stroke="#0EA5E9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#floodGrad)" />
              
              <Line
                type="monotone"
                dataKey="compositeThreatIndex"
                name="Composite Threat Index"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ r: 4 }} />
              
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
              {language === 'hi' ? 'भूस्खलन चरम जोखिम बिंदु' : 'Landslide Danger Peak'}
            </span>
            <div className="text-xl font-black text-red-600 dark:text-red-400 mt-1 font-mono">
              {language === 'hi' ? 'दिन 2: 95% संभाव्यता' : 'Day 2: 95% Probability'}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {language === 'hi' ?
              'वायनाड ग्रेनाइट ढलानों पर अनुमानित 84 मिमी अत्यधिक मानसूनी वर्षा द्वारा प्रेरित।' :
              'Driven by projected 84mm peak monsoonal downpour over saturated Wayanad granite escarpments.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
              {language === 'hi' ? 'बाढ़ जलभराव जोखिम' : 'Flood Surge Risk'}
            </span>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">
              {language === 'hi' ? 'दिन 2: 91% जलमग्नता' : 'Day 2: 91% Inundation'}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {language === 'hi' ?
              'यदि वर्षा 50 मिमी/घंटा से अधिक होती है, तो नदी का जलस्तर खतरे के निशान से +1.4 मीटर ऊपर जा सकता है।' :
              'River spillways projected to surpass danger mark by +1.4m if rainfall exceeds 50mm/hr.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
              {language === 'hi' ? 'सुरक्षित राहत एवं पुनर्वास विंडो' : 'Safe Recovery Window'}
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              {language === 'hi' ? 'दिन 6-7: <30% खतरा' : 'Day 6-7: <30% Threat'}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {language === 'hi' ?
              'मृदा नमी का स्तर 60% से नीचे गिर जाता है; पुनर्वास व क्षति आकलन के लिए सुरक्षित।' :
              'Soil moisture levels drop below 60% saturation; safe for rehabilitation and damage assessments.'}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Risk Simulation Sandbox */}
      <div id="simulation" className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-purple-500" />
            <span>{language === 'hi' ? 'इंटरएक्टिव आपदा सिमुलेशन सैंडबॉक्स' : 'Interactive Disaster Simulation Sandbox'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi' ?
            'ढलान सुरक्षा गुणांक (Factor of Safety - FS) और रेड-ज़ोन थ्रेशोल्ड सक्रियता का लाइव परीक्षण करें।' :
            'Simulate live environmental triggers to evaluate instantaneous slope Factor of Safety (FS) and Red-Zone threshold activations.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Slider 1: Rainfall */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  <span>{language === 'hi' ? 'वर्षा की तीव्रता (Rainfall)' : 'Rainfall Intensity'}</span>
                </span>
                <span className="font-mono font-bold text-blue-500">{simRainfall} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simRainfall}
                onChange={(e) => setSimRainfall(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 mm/hr ({language === 'hi' ? 'शुष्क' : 'Dry'})</span>
                <span>40 mm/hr ({language === 'hi' ? 'भारी' : 'Heavy'})</span>
                <span>100 mm/hr ({language === 'hi' ? 'बादल फटना' : 'Cloudburst'})</span>
              </div>
            </div>

            {/* Slider 2: Soil Saturation */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{language === 'hi' ? 'मृदा नमी संतृप्ति (Soil Saturation)' : 'Soil Moisture Saturation'}</span>
                </span>
                <span className="font-mono font-bold text-emerald-500">{simSoilSaturation}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={simSoilSaturation}
                onChange={(e) => setSimSoilSaturation(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>20% ({language === 'hi' ? 'स्थिर' : 'Stable'})</span>
                <span>65% ({language === 'hi' ? 'नम' : 'Damp'})</span>
                <span>100% ({language === 'hi' ? 'अति-संतृप्त द्रव' : 'Liquefied'})</span>
              </div>
            </div>

            {/* Slider 3: Seismic Tremor */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-500" />
                  <span>{language === 'hi' ? 'भूकंपीय कंपन (Seismic Tremor)' : 'Seismic Micro-Tremor'}</span>
                </span>
                <span className="font-mono font-bold text-purple-500">{simSeismic} Richter (M)</span>
              </div>
              <input
                type="range"
                min="0"
                max="6.5"
                step="0.1"
                value={simSeismic}
                onChange={(e) => setSimSeismic(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
              
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.0 M ({language === 'hi' ? 'शांत' : 'Dormant'})</span>
                <span>3.0 M ({language === 'hi' ? 'मध्यम' : 'Moderate'})</span>
                <span>6.5 M ({language === 'hi' ? 'विनाशकारी' : 'Catastrophic'})</span>
              </div>
            </div>

            {/* Slider 4: Slope Angle */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'hi' ? 'ढलान प्रवणता (Slope Gradient)' : 'Terrain Slope Gradient'}</span>
                </span>
                <span className="font-mono font-bold text-amber-500">{simSlopeAngle}° {language === 'hi' ? 'ढलान' : 'Slope'}</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={simSlopeAngle}
                onChange={(e) => setSimSlopeAngle(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>5° ({language === 'hi' ? 'सपाट मैदान' : 'Flat Lowland'})</span>
                <span>30° ({language === 'hi' ? 'मध्यम पहाड़ी' : 'Moderate Hill'})</span>
                <span>60° ({language === 'hi' ? 'खड़ी चट्टान' : 'Steep Cliff'})</span>
              </div>
            </div>
          </div>

          {/* Real-time Computed Simulation Results (Right 5 Cols) */}
          <div className="lg:col-span-5">
            <div
              className={`p-6 rounded-2xl border-2 transition-all ${
              simResult.riskTier === 'RED' ?
              'bg-red-500/10 border-red-500' :
              simResult.riskTier === 'ORANGE' ?
              'bg-amber-500/10 border-amber-500' :
              'bg-emerald-500/10 border-emerald-500'}`
              }>
              
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'सिम्युलेटेड भू-तकनीकी जोखिम स्तर:' : 'Simulated Geotechnical Risk Tier:'}
              </div>

              <div className="flex items-baseline space-x-3 my-2">
                <span
                  className={`text-4xl font-black font-mono ${
                  simResult.riskTier === 'RED' ?
                  'text-red-500' :
                  simResult.riskTier === 'ORANGE' ?
                  'text-amber-500' :
                  'text-emerald-500'}`
                  }>
                  
                  {simResult.riskScore} / 100
                </span>
                <span
                  className={`text-sm font-black px-2.5 py-0.5 rounded uppercase ${
                  simResult.riskTier === 'RED' ?
                  'bg-red-600 text-white animate-pulse' :
                  simResult.riskTier === 'ORANGE' ?
                  'bg-amber-600 text-white' :
                  'bg-emerald-600 text-white'}`
                  }>
                  
                  {simResult.riskTier === 'RED' ?
                  language === 'hi' ? 'रेड (अति-गंभीर)' : 'RED TIER' :
                  simResult.riskTier === 'ORANGE' ?
                  language === 'hi' ? 'ऑरेंज (मध्यम)' : 'ORANGE TIER' :
                  language === 'hi' ? 'ग्रीन (सुरक्षित)' : 'GREEN TIER'}
                </span>
              </div>

              {/* Factor of Safety Gauge */}
              <div className="bg-slate-900/40 p-3.5 rounded-xl space-y-2 mt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    {language === 'hi' ? 'सुरक्षा कारक (Factor of Safety - FS):' : 'Factor of Safety (FS):'}
                  </span>
                  <span
                    className={`font-mono font-black ${
                    simResult.factorOfSafety < 1.0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`
                    }>
                    
                    {simResult.factorOfSafety}{' '}
                    {simResult.factorOfSafety < 1.0 ?
                    language === 'hi' ? '(अस्थिर - ढहने का खतरा)' : '(UNSTABLE)' :
                    language === 'hi' ? '(संतुलित - सुरक्षित)' : '(EQUILIBRIUM)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    {language === 'hi' ? 'भूस्खलन संभावना:' : 'Landslide Probability:'}
                  </span>
                  <span className="font-mono font-bold text-red-400">{simResult.landslideProbPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">
                    {language === 'hi' ? 'बाढ़ जलभराव संभावना:' : 'Flood Inundation Probability:'}
                  </span>
                  <span className="font-mono font-bold text-blue-400">{simResult.floodProbPct}%</span>
                </div>
              </div>

              {/* Directive Advice */}
              <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs">
                {simResult.recommendedImmediateEvacuation ?
                <div className="text-red-500 dark:text-red-300 font-bold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                    <span>
                      {language === 'hi' ?
                    'अति-महत्वपूर्ण: सिमुलेशन तत्काल अनिवार्य रेड-ज़ोन निकासी प्रोटोकॉल को सक्रिय करता है!' :
                    'CRITICAL: Simulation triggers mandatory zone evacuation protocol!'}
                    </span>
                  </div> :

                <div className="text-emerald-500 dark:text-emerald-300 font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {language === 'hi' ?
                    'मापदंड अनुमेय संरचनात्मक सुरक्षा सीमाओं के भीतर हैं।' :
                    'Parameters remain within permissible structural thresholds.'}
                    </span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: 50-Year Historical Disaster Benchmarks */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-500" />
            <span>{language === 'hi' ? '50-वर्षीय ऐतिहासिक आपदा डेटासेट (1975 – 2025)' : '50-Year Historical Disaster Dataset (1975 – 2025)'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi' ?
            'भारत की प्रमुख ऐतिहासिक आपदाओं से सांख्यिकीय जनहानि, विस्थापन और इंजीनियरिंग सीख।' :
            'Empirical casualty, displacement, and engineering learnings from major historical disasters in India.'}
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mock50YearDisasters.map((disaster) =>
          <div
            key={disaster.id}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-3">
            
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                    {disaster.year} • {disaster.type.toUpperCase()}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {disaster.eventName}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{disaster.region}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    {language === 'hi' ? 'मृत्यु' : 'Fatalities'}
                  </span>
                  <span className="font-bold text-red-500">{disaster.casualties.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    {language === 'hi' ? 'विस्थापित' : 'Displaced'}
                  </span>
                  <span className="font-bold text-amber-500">
                    {disaster.displacedPeople.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    {language === 'hi' ? 'हानि ($)' : 'Loss (USD)'}
                  </span>
                  <span className="font-bold text-purple-400">
                    ${disaster.economicDamageMillionUSD}M
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/40 p-2.5 rounded-xl">
                <strong className="text-slate-900 dark:text-white block mb-0.5">
                  {language === 'hi' ? 'इंजीनियरिंग एवं नीतिगत सीख:' : 'Engineering & Policy Takeaway:'}
                </strong>
                {disaster.keyLearning}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}