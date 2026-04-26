"use client";

import React, { useState } from 'react';
import { TrendingUp, Award, ExternalLink, Filter, Users, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function TrendChart() {
  const data = [
    { year: '2022', int: 5, nas: 12, wil: 8 },
    { year: '2023', int: 8, nas: 18, wil: 12 },
    { year: '2024', int: 12, nas: 24, wil: 16 },
    { year: '2025', int: 18, nas: 35, wil: 20 },
    { year: '2026', int: 22, nas: 45, wil: 25 },
  ];
  const padL = 36, padR = 16, padT = 16, padB = 36;
  const maxVal = 60;
  const W = 800, H = 240;
  const xStep = (W - padL - padR) / (data.length - 1);
  const toX = (i: number) => padL + i * xStep;
  const toY = (v: number) => padT + (H - padT - padB) * (1 - v / maxVal);

  const line = (vals: number[], color: string) => {
    const pts = vals.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
    return (
      <g key={color}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        {vals.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="4" fill="white" stroke={color} strokeWidth="2" />)}
      </g>
    );
  };

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none" style={{ minHeight: 200 }}>
        {[0, 15, 30, 45, 60].map(t => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={toY(t)} y2={toY(t)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={padL - 6} y={toY(t) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{t}</text>
          </g>
        ))}
        {data.map((d, i) => (
          <text key={i} x={toX(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#94a3b8">{d.year}</text>
        ))}
        {line(data.map(d => d.int), '#50c878')}
        {line(data.map(d => d.nas), '#22c55e')}
        {line(data.map(d => d.wil), '#86efac')}
      </svg>
    </div>
  );
}

function BarChart() {
  const data = [
    { label: 'Akademik', value: 65 },
    { label: 'Non-Akademik', value: 85 }
  ];
  const padL = 36, padR = 16, padT = 16, padB = 36;
  const maxVal = 100;
  const W = 800, H = 240;
  
  const toY = (v: number) => padT + (H - padT - padB) * (1 - v / maxVal);
  const chartHeight = H - padT - padB;
  
  const barWidth = 140; 
  const gap = (W - padL - padR - (barWidth * 2)) / 3;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" style={{ minHeight: 200 }}>
         {[0, 25, 50, 75, 100].map(t => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={toY(t)} y2={toY(t)} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <text x={padL - 6} y={toY(t) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{t}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + gap + (i * (barWidth + gap));
          const y = toY(d.value);
          const h = chartHeight - (y - padT);
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={h} fill="#50c878" rx="4" className="hover:opacity-80 cursor-pointer transition-opacity" />
              <text x={x + barWidth/2} y={H - 8} textAnchor="middle" fontSize="11" fill="#94a3b8">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const scorecardData = [
  { key: 'NI', label: 'NI - Prestasi Nasional Akademik', value: '38', color: 'bg-[#eafaf1] text-[#22c55e]' },
  { key: 'NN', label: 'NN - Prestasi Nasional Non-Akademik', value: '45', color: 'bg-[#eafaf1] text-[#22c55e]' },
  { key: 'NW', label: 'NW - Prestasi Wilayah Akademik', value: '25', color: 'bg-amber-50 text-amber-500' },
  { key: 'RI', label: 'RI - Rasio Internasional Akademik', value: '0.049', color: 'bg-[#eafaf1] text-[#22c55e]' },
  { key: 'RN', label: 'RN - Rasio Internasional Non-Akademik', value: '0.027', color: 'bg-amber-50 text-amber-500' },
  { key: 'RW', label: 'RW - Rasio Wilayah Non-Akademik', value: '0.067', color: 'bg-[#eafaf1] text-[#22c55e]' },
];

export default function WdDashboardPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'custom'>('all');
  const [rentang, setRentang] = useState('2022-2026');

  return (
    <div className="flex flex-col gap-6 pb-8 font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">Executive Dashboard</h1>
        <p className="text-gray-500 text-[15px] mt-1">Ringkasan prestasi mahasiswa S1 Teknik Industri</p>
      </div>

      {/* Hero Card */}
      <div className="bg-[#50c878] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-lg shadow-[#50c878]/20">
        <div className="relative z-10 text-white">
          <p className="text-white/80 font-medium text-[14px]">Total Prestasi Mahasiswa</p>
          <div className="flex items-end gap-3 mt-1">
            <h2 className="text-4xl font-bold tracking-tight">152 Prestasi</h2>
          </div>
          <p className="text-white/80 text-[13px] mt-2">Periode 5 Tahun Terakhir (2022–{rentang === '2022-2026' ? '2026' : rentang})</p>
        </div>
        <Button onClick={() => setFilterOpen(true)} className="relative z-10 bg-white/20 hover:bg-white/30 text-white border-0 h-10 px-4 rounded-xl text-[14px] font-medium backdrop-blur-sm shadow-none transition-colors">
          Filter Rentang Waktu
        </Button>
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[14px] font-medium text-gray-500">Total Prestasi Valid</p>
            <div className="h-10 w-10 rounded-xl bg-[#eafaf1] text-[#50c878] flex justify-center items-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-auto">152</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[14px] font-medium text-gray-500">Mahasiswa Berprestasi</p>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex justify-center items-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-auto">124</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[14px] font-medium text-gray-500">Pencapaian Target</p>
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-500 flex justify-center items-center">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-auto">87%</p>
        </div>
      </div>

      {/* Sub Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { title: "Prestasi Internasional", val: 22, pct: "+22%" },
          { title: "Prestasi Nasional", val: 45, pct: "+18%" },
          { title: "Prestasi Wilayah", val: 30, pct: "+20%" }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
             <p className="text-[13px] font-medium text-gray-500">{stat.title}</p>
             <div className="flex items-end gap-2 mt-1">
               <span className="text-2xl font-bold text-gray-900 leading-none">{stat.val}</span>
               <span className="text-[13px] font-medium text-[#50c878] bg-[#eafaf1] px-1.5 py-0.5 rounded leading-none">{stat.pct}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#50c878]" />Tren Prestasi 5 Tahun
          </h2>
          <TrendChart />
          <div className="flex flex-wrap gap-5 mt-4 justify-center">
            {([['#50c878','Internasional'],['#22c55e','Nasional'],['#86efac','Wilayah']] as [string, string][]).map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: c }}></span>
                <span className="text-[12px] font-medium text-gray-500">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-6 flex items-center gap-2">
            Distribusi Kategori
          </h2>
          <BarChart />
        </div>
      </div>

      {/* Scorecard */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
         <h2 className="text-[16px] font-semibold text-gray-900 mb-6">Scorecard Indikator Akreditasi</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {scorecardData.map((item, i) => {
             // Extract bg class
             const bgMatch = item.color.match(/bg-\S+/);
             const textMatch = item.color.match(/text-\S+/);
             const bg = bgMatch ? bgMatch[0] : '';
             const textcolor = textMatch ? textMatch[0] : '';
             
             return (
               <div key={i} className={`rounded-xl p-5 border border-transparent hover:border-gray-200 transition-colors ${bg}`}>
                 <p className="text-[13px] font-medium text-gray-600 mb-3">{item.label}</p>
                 <span className={`text-[32px] tracking-tight font-light ${textcolor}`}>{item.value}</span>
               </div>
             );
           })}
         </div>
      </div>

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[420px] p-6 bg-white rounded-2xl gap-0 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-[18px] font-semibold text-gray-900">Filter Rentang Waktu</DialogTitle>
              <DialogDescription className="text-[14px] text-gray-500">Pilih rentang tahun untuk melihat data spesifik</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
               <div className="space-y-1.5 flex flex-col">
                 <label className="text-[14px] font-medium text-gray-900">Rentang Tahun</label>
                 <Select value={rentang} onValueChange={v => { if(v) setRentang(v); }}>
                   <SelectTrigger className="bg-white rounded-lg h-11 border-gray-200 text-[14px] w-full focus:ring-2 focus:ring-[#50c878]/20 focus:border-[#50c878]">
                     <SelectValue placeholder="Pilih rentang tahun" />
                   </SelectTrigger>
                   <SelectContent>
                     {['2022-2026', '2023-2026', '2024-2026', '2026', '2025'].map(y => (
                       <SelectItem key={y} value={y}>{y}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="outline" onClick={() => setFilterOpen(false)} className="flex-1 rounded-xl h-11 text-[14px] border-gray-200 font-medium">Batal</Button>
              <Button onClick={() => setFilterOpen(false)} className="flex-1 bg-[#006400] hover:bg-[#004d00] text-white rounded-xl h-11 text-[14px] font-semibold flex items-center justify-center">
                 Terapkan Filter
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
