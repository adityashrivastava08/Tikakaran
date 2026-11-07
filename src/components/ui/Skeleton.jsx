import React from 'react';

export function Skeleton({ className = '', variant = 'rect' }) {
  const baseClasses = "animate-pulse bg-[#E5EFEA] rounded-xl";
  const variantClasses = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'h-3 rounded-md' : 'rounded-xl';

  return <div className={`${baseClasses} ${variantClasses} ${className}`} />;
}

export function TableRowSkeleton({ columns = 7 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-[#E5EFEA] rounded-md w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E1ECE9] shadow-soft-sm animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 rounded-xl bg-[#E5EFEA]" />
        <div className="w-16 h-5 rounded-full bg-[#E5EFEA]" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-[#E5EFEA] rounded w-2/3" />
        <div className="h-7 bg-[#E5EFEA] rounded w-1/2" />
      </div>
      <div className="h-3 bg-[#E5EFEA] rounded w-full" />
    </div>
  );
}

