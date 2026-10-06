import React from 'react';

function Pulse({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Pulse className="w-9 h-9 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Pulse className="h-4 w-3/4" />
          <Pulse className="h-3 w-1/2" />
          <Pulse className="h-3 w-2/3" />
        </div>
        <Pulse className="w-[72px] h-[72px] rounded-full flex-shrink-0" />
      </div>
      <Pulse className="h-2 w-full rounded-full" />
      <div className="flex gap-2 flex-wrap">
        <Pulse className="h-5 w-20 rounded-full" />
        <Pulse className="h-5 w-24 rounded-full" />
        <Pulse className="h-5 w-16 rounded-full" />
      </div>
      <Pulse className="h-14 w-full rounded-lg" />
      <div className="flex justify-between items-center pt-1 border-t border-slate-100">
        <Pulse className="h-6 w-28 rounded-lg" />
        <Pulse className="h-7 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export default function SkeletonLoading({ message = 'AI กำลังวิเคราะห์...' }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <span className="text-xs font-semibold text-indigo-700">{message}</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
