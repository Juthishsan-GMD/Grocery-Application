import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import '../styles/CustomSelect.css';

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
    <div className="custom-select-container" ref={dropdownRef} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
      <div className={`custom-select-trigger ${isOpen ? 'active' : ''}`}>
        <span className="truncate">{selectedDisplay}</span>
        <FiChevronDown className={`select-chevron ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="custom-select-menu">
          {options.map((opt, idx) => (
            <div 
              key={idx} 
              className={`custom-select-option ${value === opt.value ? 'selected' : ''}`}
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
