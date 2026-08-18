import { useEffect } from 'react';
import { FilterSidebar } from './FilterSidebar';

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filteredCount,
  ...sidebarProps
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mobile-filter-overlay" onClick={onClose}>
      <div className="mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Filter Mattresses</h2>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        </div>

        <div className="drawer-body">
          <FilterSidebar {...sidebarProps} />
        </div>

        <div className="drawer-footer">
          <button
            type="button"
            className="drawer-clear-btn"
            onClick={() => {
              sidebarProps.clearAllFilters();
            }}
          >
            CLEAR ALL
          </button>
          <button type="button" className="drawer-apply-btn" onClick={onClose}>
            SHOW {filteredCount} {filteredCount === 1 ? 'PRODUCT' : 'PRODUCTS'}
          </button>
        </div>
      </div>
    </div>
  );
}
