'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeDateModal, setRentalDates } from '@/store/rentalSlice';
import { addToCart } from '@/store/cartSlice';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Helper to format Date to YYYY-MM-DD string
function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to parse YYYY-MM-DD string to local Date
function parseDateString(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Helper to get ordinal suffix (e.g. 1st, 2nd, 3rd, 4th, 15th)
function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Format for display e.g. "15th Oct"
export function formatFriendlyDate(dateStr: string | null): string {
  if (!dateStr) return 'Select Date';
  const d = parseDateString(dateStr);
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  return `${getOrdinal(d.getDate())} ${month}`;
}

export function formatFullFriendlyDate(dateStr: string | null): string {
  if (!dateStr) return 'Select Date';
  const d = parseDateString(dateStr);
  const day = getOrdinal(d.getDate());
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function RentalDateModal() {
  const dispatch = useAppDispatch();
  const { isDateModalOpen, activeProduct, startDate, endDate, days } = useAppSelector(
    (state) => state.rental
  );

  const [mounted, setMounted] = useState(false);
  const [todayStr, setTodayStr] = useState<string>('');
  const [todayYear, setTodayYear] = useState<number>(2026);
  const [todayMonth, setTodayMonth] = useState<number>(9);
  const [tempStart, setTempStart] = useState<string>('');
  const [tempEnd, setTempEnd] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9);

  // Initialize dates safely in client effect
  useEffect(() => {
    setMounted(true);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const tStr = toDateString(t);
    setTodayStr(tStr);
    setTodayYear(t.getFullYear());
    setTodayMonth(t.getMonth());

    if (startDate && endDate) {
      setTempStart(startDate);
      setTempEnd(endDate);
      const parsed = parseDateString(startDate);
      setCurrentYear(parsed.getFullYear());
      setCurrentMonth(parsed.getMonth());
    } else {
      const s = new Date(t);
      s.setDate(t.getDate() + 1);
      const e = new Date(t);
      e.setDate(t.getDate() + 5);
      const sStr = toDateString(s);
      const eStr = toDateString(e);
      setTempStart(sStr);
      setTempEnd(eStr);
      setCurrentYear(s.getFullYear());
      setCurrentMonth(s.getMonth());
    }
  }, [startDate, endDate]);

  // Synchronize state whenever modal opens
  useEffect(() => {
    if (isDateModalOpen) {
      if (startDate && endDate) {
        setTempStart(startDate);
        setTempEnd(endDate);
        const parsed = parseDateString(startDate);
        setCurrentYear(parsed.getFullYear());
        setCurrentMonth(parsed.getMonth());
      }
    }
  }, [isDateModalOpen, startDate, endDate]);

  // ESC to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDateModalOpen) {
        dispatch(closeDateModal());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDateModalOpen, dispatch]);

  // Lock background scroll when open
  useEffect(() => {
    if (isDateModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDateModalOpen]);

  // Calculate days between tempStart and tempEnd
  const calculatedDays = useMemo(() => {
    if (!tempStart || !tempEnd) return 0;
    const start = parseDateString(tempStart);
    const end = parseDateString(tempEnd);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [tempStart, tempEnd]);

  // Calendar dates matrix
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentYear === todayYear && currentMonth <= todayMonth) {
      return;
    }
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Date cell click logic
  const handleDateClick = (dateStr: string) => {
    if (dateStr < todayStr) return;

    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(dateStr);
      setTempEnd('');
    } else if (tempStart && !tempEnd) {
      if (dateStr < tempStart) {
        setTempStart(dateStr);
      } else if (dateStr === tempStart) {
        return;
      } else {
        setTempEnd(dateStr);
      }
    }
  };

  // Preset button logic (e.g. 2, 3, 4, 7 days)
  const applyPresetDays = (presetDays: number) => {
    const baseStart =
      tempStart && tempStart >= todayStr
        ? parseDateString(tempStart)
        : todayStr
        ? parseDateString(todayStr)
        : new Date();
    if (!tempStart || tempStart < todayStr) {
      baseStart.setDate(baseStart.getDate() + 1);
    }
    const end = new Date(baseStart);
    end.setDate(baseStart.getDate() + presetDays);

    const newStartStr = toDateString(baseStart);
    const newEndStr = toDateString(end);

    setTempStart(newStartStr);
    setTempEnd(newEndStr);
  };

  // Confirm dates and apply globally
  const handleConfirmDates = () => {
    if (!tempStart || !tempEnd || calculatedDays <= 0) return;

    dispatch(
      setRentalDates({
        startDate: tempStart,
        endDate: tempEnd,
        days: calculatedDays,
      })
    );

    // If an active product was opened and user wants to add it directly
    if (activeProduct) {
      dispatch(
        addToCart({
          id: activeProduct.id,
          name: activeProduct.name,
          image: activeProduct.image,
          per_day_rent: activeProduct.per_day_rent,
          tag: activeProduct.tag,
        })
      );
    }

    dispatch(closeDateModal());
  };

  if (!isDateModalOpen || !mounted) return null;

  const isPrevDisabled = currentYear === todayYear && currentMonth <= todayMonth;

  // Price calculations
  const perDay = activeProduct?.per_day_rent || 0;
  const totalPrice = perDay * (calculatedDays || 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs transition-opacity duration-300"
      onClick={() => dispatch(closeDateModal())}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 max-h-[92vh] border border-neutral-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-[#4C187C] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs">
              <svg className="h-5 w-5 text-[#9EFF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h2 id="calendar-modal-title" className="text-base font-bold sm:text-lg">
                Select Rental Dates
              </h2>
              <p className="text-xs text-white/80">
                Choose delivery & return dates to calculate price
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch(closeDateModal())}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-4">
          {/* Active Product Banner if opened for a product */}
          {activeProduct && (
            <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-150 bg-neutral-50/70 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-xs font-bold text-neutral-900 sm:text-sm">
                    {activeProduct.name}
                  </h3>
                  {activeProduct.tag && (
                    <span className="shrink-0 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-[#4C187C]">
                      {activeProduct.tag}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-neutral-500">
                    Base Rate: <strong className="text-neutral-900">₹{activeProduct.per_day_rent}</strong>/day
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Date Range Summary Pill */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`flex flex-col rounded-2xl border p-2.5 sm:p-3 transition-colors ${
              tempStart ? 'border-[#4C187C]/30 bg-purple-50/50' : 'border-neutral-200 bg-neutral-50'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Delivery Date
              </span>
              <span className="text-xs font-extrabold text-neutral-900 sm:text-sm">
                {tempStart ? formatFriendlyDate(tempStart) : 'Select Start'}
              </span>
            </div>

            <div className={`flex flex-col rounded-2xl border p-2.5 sm:p-3 transition-colors ${
              tempEnd ? 'border-[#4C187C]/30 bg-purple-50/50' : 'border-neutral-200 bg-neutral-50'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Pickup Date
              </span>
              <span className="text-xs font-extrabold text-neutral-900 sm:text-sm">
                {tempEnd ? formatFriendlyDate(tempEnd) : 'Select End'}
              </span>
            </div>
          </div>

          {/* Quick Presets for Days */}
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-neutral-600">
              <span>Quick Rental Durations:</span>
              {calculatedDays > 0 && (
                <span className="rounded-full bg-[#9EFF00]/30 px-2 py-0.5 text-[11px] font-bold text-neutral-900">
                  {calculatedDays} Days Selected
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 7].map((num) => {
                const isSelected = calculatedDays === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => applyPresetDays(num)}
                    className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#4C187C] text-white shadow-sm ring-2 ring-[#4C187C]/20 scale-102'
                        : 'border border-neutral-200 bg-white text-neutral-700 hover:border-[#4C187C]/40 hover:bg-neutral-50'
                    }`}
                  >
                    {num} Days {num === 4 ? '⭐' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Calendar Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs">
            {/* Calendar Month Navigation Header */}
            <div className="mb-3 flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isPrevDisabled}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                  isPrevDisabled
                    ? 'border-neutral-100 text-neutral-300 cursor-not-allowed'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
                aria-label="Previous month"
              >
                ‹
              </button>

              <span className="text-sm font-bold text-neutral-900 select-none">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Next month"
              >
                ›
              </button>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-neutral-400 mb-1">
              {DAY_NAMES.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Matrix */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9 w-full" />
              ))}

              {/* Month day numbers */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateObj = new Date(currentYear, currentMonth, dayNum);
                const dateStr = toDateString(dateObj);

                const isPast = dateStr < todayStr;
                const isStart = dateStr === tempStart;
                const isEnd = dateStr === tempEnd;
                const isInRange =
                  tempStart && tempEnd && dateStr > tempStart && dateStr < tempEnd;
                const isToday = dateStr === todayStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleDateClick(dateStr)}
                    className={`relative flex h-9 w-full items-center justify-center text-xs font-semibold transition-all ${
                      isPast
                        ? 'text-neutral-300 cursor-not-allowed'
                        : isStart || isEnd
                        ? 'bg-[#4C187C] text-white font-bold rounded-xl shadow-sm z-10 scale-105'
                        : isInRange
                        ? 'bg-purple-100 text-[#4C187C] font-semibold rounded-md'
                        : 'text-neutral-700 hover:bg-neutral-100 rounded-xl'
                    }`}
                  >
                    {dayNum}
                    {isToday && !isStart && !isEnd && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#4C187C]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculated Price Showcase Box */}
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/60 p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
                  Calculated Rental Price
                </span>
                <p className="text-xs text-neutral-600">
                  {calculatedDays > 0 ? (
                    <>
                      Duration: <strong className="text-neutral-900">{calculatedDays} Days</strong>
                      {activeProduct ? ` (₹${activeProduct.per_day_rent}/day)` : ''}
                    </>
                  ) : (
                    'Please select start and return dates'
                  )}
                </p>
              </div>

              <div className="text-right">
                {activeProduct ? (
                  <div>
                    <div className="text-lg sm:text-xl font-black text-neutral-950">
                      ₹ {totalPrice}
                    </div>
                    <span className="text-[11px] font-bold text-[#4C187C]">
                      for {calculatedDays} days
                    </span>
                  </div>
                ) : (
                  <div className="text-sm font-extrabold text-[#4C187C]">
                    {calculatedDays > 0 ? `${calculatedDays} Days Rental` : 'Select Range'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3.5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => dispatch(closeDateModal())}
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!tempStart || !tempEnd || calculatedDays <= 0}
            onClick={handleConfirmDates}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-black shadow-md transition-all ${
              !tempStart || !tempEnd || calculatedDays <= 0
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-[#9EFF00] text-neutral-950 hover:bg-[#8ee600] hover:scale-102 active:scale-98'
            }`}
          >
            {activeProduct ? (
              <span>Add to Cart ({calculatedDays} Days • ₹{totalPrice})</span>
            ) : (
              <span>Confirm {calculatedDays} Days Rental</span>
            )}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
