'use client';

import { useState } from 'react';

interface FloatingDateBarProps {
  onDatesSelected?: (start: string, end: string) => void;
}

export default function FloatingDateBar({ onDatesSelected }: FloatingDateBarProps) {
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-17');
  const [datesChosen, setDatesChosen] = useState(false);

  const handleApply = () => {
    setDatesChosen(true);
    setShowModal(false);
    if (onDatesSelected) onDatesSelected(startDate, endDate);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-30 hidden -translate-x-1/2 md:block">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2.5 rounded-full border-2 border-[#9EFF00] bg-[#0A1128]/95 px-5 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#0A1128] active:scale-95 sm:text-sm"
        >
          <svg className="h-4 w-4 text-[#9EFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>
            {datesChosen ? `Rental: ${startDate} to ${endDate}` : 'Select rental dates to view prices'}
          </span>
        </button>
      </div>

      {/* Date Picker Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-neutral-900">Select Rental Dates</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  Delivery / Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 p-2.5 text-sm focus:border-[#4C187C] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                  Pickup / Return Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 p-2.5 text-sm focus:border-[#4C187C] focus:outline-none"
                />
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-1/2 rounded-full border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="w-1/2 rounded-full bg-[#4C187C] py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#3d1264]"
                >
                  Confirm Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
