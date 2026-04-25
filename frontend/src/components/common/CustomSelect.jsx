import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const CustomSelect = ({ options, value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the popup when clicking entirely outside of the component area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDisplay = options.find(opt => opt.value === value)?.label || placeholder;

  const handleSelect = (val, e) => {
    e.stopPropagation();
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative select-none min-w-[160px] w-full" ref={dropdownRef} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
      <div className={`flex items-center justify-between bg-white border rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 text-[0.85rem] font-semibold text-slate-800 h-full ${isOpen ? 'border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]' : 'border-slate-200 hover:border-emerald-500'}`}>
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{selectedDisplay}</span>
        <FiChevronDown className={`text-slate-500 transition-transform duration-300 ml-2 shrink-0 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-200 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.08)] z-[100] overflow-hidden animate-[dropdownFadeIn_0.2s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]" style={{ transformOrigin: 'top center' }}>
          <style>{`
            @keyframes dropdownFadeIn {
              from { opacity: 0; transform: translateY(-5px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {options.map((opt, idx) => (
            <div 
              key={idx} 
              className={`px-4 py-[0.7rem] cursor-pointer transition-all duration-200 text-[0.85rem] font-medium whitespace-nowrap overflow-hidden text-ellipsis ${value === opt.value ? 'bg-emerald-500/10 text-emerald-500 font-bold border-l-[3px] border-emerald-500' : 'text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-500 border-l-[3px] border-transparent'}`}
              onClick={(e) => handleSelect(opt.value, e)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
