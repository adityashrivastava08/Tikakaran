import React from 'react';
import { SearchX, Inbox, RefreshCw, Plus } from 'lucide-react';

export default function EmptyState({
  icon: Icon = SearchX,
  title = "No Records Found",
  description = "No entries matching your current search or filters.",
  actionLabel,
  onAction
}) {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#E6F4F1] text-[#075E54] flex items-center justify-center mb-3.5 shadow-sm">
        <Icon className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="text-base font-bold text-[#173B38]">{title}</h3>
      <p className="text-xs text-[#718783] max-w-sm mt-1 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

