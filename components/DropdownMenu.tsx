
import React, { useState, useEffect, useRef } from 'react';
import { DropdownItem } from '../types';

interface DropdownMenuProps {
  triggerElement: React.ReactElement<React.HTMLProps<HTMLElement>>;
  items: DropdownItem[];
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ triggerElement, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {React.cloneElement(triggerElement, { onClick: toggleMenu })}
      <div
        className={`
          absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg z-10
          transition-all transform-gpu origin-top-right
          ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="p-1">
          {items.map((item, index) => {
            if (item.type === 'separator') {
              return <div key={index} className="h-px bg-gray-200 dark:bg-gray-700 my-1 mx-1" />;
            }
            return (
              <button
                key={index}
                onClick={() => handleItemClick(item.onClick!)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  item.isDestructive
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};