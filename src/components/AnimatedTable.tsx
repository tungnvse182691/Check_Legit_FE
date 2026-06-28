import React, { useState, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronRight, 
  SlidersHorizontal, 
  ChevronLeft, 
  Check, 
  Info,
  X
} from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  header: ReactNode | ((column: ColumnDef<T>) => ReactNode);
  cell: (item: T) => ReactNode;
  sortable?: boolean;
  sortAccessor?: (item: T) => any;
  className?: string;
}

export interface BulkAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (selectedItems: T[]) => void;
  variant?: "primary" | "danger" | "warning" | "success";
}

export interface AnimatedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchKeys?: string[]; // keys of T or dot notation path
  expandableRender?: (item: T) => ReactNode;
  bulkActions?: BulkAction<T>[];
  defaultSort?: { key: string; direction: "asc" | "desc" };
  rowKey: (item: T) => string | number;
}

export function AnimatedTable<T>({
  data,
  columns,
  searchPlaceholder = "Tìm kiếm...",
  searchKeys = [],
  expandableRender,
  bulkActions = [],
  defaultSort,
  rowKey
}: AnimatedTableProps<T>) {
  // 1. Search State
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Sorting State
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(defaultSort || null);

  // 3. Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // 4. Expanded Rows State
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(new Set());

  // 5. Column Visibility State
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<string>>(
    new Set(columns.map(c => c.key))
  );
  const [showColMenu, setShowColMenu] = useState(false);

  // 6. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- Process Data: Filter, Sort, Paginate ---

  // Helper to get nested properties
  const getNestedValue = (obj: any, path: string): string => {
    return path.split(".").reduce((acc, part) => {
      if (acc && acc[part] !== undefined) {
        return acc[part];
      }
      return "";
    }, obj)?.toString() || "";
  };

  // A. Filtered Data
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();

    return data.filter(item => {
      // If no keys specified, search all fields
      const keysToSearch = searchKeys.length > 0 ? searchKeys : Object.keys(item as any);
      return keysToSearch.some(key => {
        const val = getNestedValue(item, key);
        return val.toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchKeys]);

  // B. Sorted Data
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (!sortConfig) return sortableItems;

    const column = columns.find(c => c.key === sortConfig.key);
    if (!column) return sortableItems;

    sortableItems.sort((a, b) => {
      let aVal = column.sortAccessor ? column.sortAccessor(a) : (a as any)[sortConfig.key];
      let bVal = column.sortAccessor ? column.sortAccessor(b) : (b as any)[sortConfig.key];

      if (aVal === undefined || aVal === null) aVal = "";
      if (bVal === undefined || bVal === null) bVal = "";

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortableItems;
  }, [filteredData, sortConfig, columns]);

  // Reset pagination on filter/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // C. Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  // --- Handlers ---

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedData.map(item => rowKey(item));
      setSelectedIds(prev => {
        const next = new Set(prev);
        pageIds.forEach(id => next.add(id));
        return next;
      });
    } else {
      const pageIds = paginatedData.map(item => rowKey(item));
      setSelectedIds(prev => {
        const next = new Set(prev);
        pageIds.forEach(id => next.delete(id));
        return next;
      });
    }
  };

  const handleSelectRow = (id: string | number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleExpand = (id: string | number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleColumn = (key: string) => {
    setVisibleColumnKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Prevent hiding the last column
        if (next.size > 1) {
          next.delete(key);
        }
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Get active items currently selected
  const selectedItems = useMemo(() => {
    return data.filter(item => selectedIds.has(rowKey(item)));
  }, [data, selectedIds, rowKey]);

  const isAllPageSelected = useMemo(() => {
    if (paginatedData.length === 0) return false;
    return paginatedData.every(item => selectedIds.has(rowKey(item)));
  }, [paginatedData, selectedIds, rowKey]);

  return (
    <div className="w-full flex flex-col gap-4 font-sans text-slate-800">
      
      {/* Top Action Bar (Search, Columns toggle, Bulk action overview) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none shadow-sm transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Column Visibility Menu */}
        <div className="relative self-end sm:self-auto">
          <button
            onClick={() => setShowColMenu(!showColMenu)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer select-none"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-550" />
            <span>Cột hiển thị</span>
          </button>

          <AnimatePresence>
            {showColMenu && (
              <>
                {/* Backdrop to close */}
                <div className="fixed inset-0 z-20" onClick={() => setShowColMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-3 flex flex-col gap-1.5"
                >
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider px-2 py-1 mb-1">Ẩn / Hiện Cột</h4>
                  <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                    {columns.map(col => {
                      const isVisible = visibleColumnKeys.has(col.key);
                      return (
                        <label 
                          key={col.key} 
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-xs font-semibold text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={isVisible}
                            disabled={isVisible && visibleColumnKeys.size === 1}
                            onChange={() => handleToggleColumn(col.key)}
                            className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 w-3.5 h-3.5"
                          />
                          <span>{typeof col.header === "string" ? col.header : col.key}</span>
                        </label>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Main Table Wrapper */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left text-sm">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider select-none">
                
                {/* Selection Checkbox Header */}
                {bulkActions.length > 0 && (
                  <th className="py-3 px-3.5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={handleSelectAll}
                      className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 w-4 h-4 cursor-pointer"
                    />
                  </th>
                )}

                {/* Expand Chevron Placeholder */}
                {expandableRender && <th className="py-3 px-2 w-10"></th>}

                {/* Main Column Headers */}
                {columns.map(col => {
                  if (!visibleColumnKeys.has(col.key)) return null;

                  const isSorted = sortConfig?.key === col.key;
                  const isSortable = col.sortable;

                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key, col.sortable)}
                      className={`py-3 px-3.5 font-bold text-slate-600 ${col.className || ""} ${
                        isSortable ? "cursor-pointer hover:bg-slate-100/50 hover:text-slate-900 transition-colors" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span>
                          {typeof col.header === "function" ? col.header(col) : col.header}
                        </span>
                        {isSortable && (
                          <span className="text-slate-450 transition-colors">
                            {isSorted ? (
                              sortConfig?.direction === "asc" ? (
                                <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                              )
                            ) : (
                              <div className="flex flex-col opacity-30 group-hover:opacity-100 scale-75">
                                <ChevronUp className="w-2.5 h-2.5 -mb-1" />
                                <ChevronDown className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-150">
              <AnimatePresence initial={false}>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={
                        columns.filter(c => visibleColumnKeys.has(c.key)).length + 
                        (bulkActions.length > 0 ? 1 : 0) + 
                        (expandableRender ? 1 : 0)
                      }
                      className="p-16 text-center text-slate-500 font-medium text-sm"
                    >
                      <Info className="w-8 h-8 text-slate-350 mx-auto mb-2.5" />
                      Không tìm thấy bản ghi phù hợp.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => {
                    const id = rowKey(item);
                    const isSelected = selectedIds.has(id);
                    const isExpanded = expandedIds.has(id);

                    return (
                      <React.Fragment key={id}>
                        {/* Table Row */}
                        <motion.tr
                          layoutId={`row-${id}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                          className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                            isSelected ? "bg-emerald-50/20" : ""
                          } ${isExpanded ? "bg-slate-50/40" : ""}`}
                          onClick={() => expandableRender && handleToggleExpand(id)}
                        >
                          {/* Row Checkbox */}
                          {bulkActions.length > 0 && (
                            <td 
                              className="py-3 px-3.5 w-12 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectRow(id)}
                                className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 w-4 h-4 cursor-pointer"
                              />
                            </td>
                          )}

                          {/* Row Expand Chevron */}
                          {expandableRender && (
                            <td className="py-3 px-2 w-10 text-center">
                              <motion.div
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-center"
                              >
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </motion.div>
                            </td>
                          )}

                          {/* Column Cells */}
                          {columns.map(col => {
                            if (!visibleColumnKeys.has(col.key)) return null;
                            return (
                              <td key={col.key} className={`py-3 px-3.5 align-middle text-xs ${col.className || ""}`}>
                                {col.cell(item)}
                              </td>
                            );
                          })}
                        </motion.tr>

                        {/* Expanded Drawer Row */}
                        {expandableRender && (
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <tr className="bg-slate-50/40 border-t border-slate-100">
                                <td 
                                  colSpan={
                                    columns.filter(c => visibleColumnKeys.has(c.key)).length + 
                                    (bulkActions.length > 0 ? 1 : 0) + 
                                    (expandableRender ? 1 : 0)
                                  }
                                  className="p-0 border-0"
                                >
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-6 pl-14 pr-6 border-b border-slate-200">
                                      {expandableRender(item)}
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>

          </table>
        </div>

        {/* Bottom Pagination Control */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-semibold text-slate-500">
          
          {/* Item Count Indicator */}
          <div className="flex items-center gap-4">
            <span>
              Hiển thị {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} đến{" "}
              {Math.min(currentPage * pageSize, sortedData.length)} trong số{" "}
              <span className="font-extrabold text-slate-800">{sortedData.length}</span> kết quả
            </span>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span>Số hàng:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-850 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 bg-white border border-slate-250 text-slate-700 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:hover:bg-white cursor-pointer select-none disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white border border-slate-250 text-slate-700 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:hover:bg-white cursor-pointer select-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Buttons (Limit shown pages to max 5) */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => {
                return Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages;
              })
              .map((page, index, array) => {
                const isSelected = page === currentPage;
                const showEllipsis = index > 0 && page - array[index - 1] > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg border font-bold text-xs select-none cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#2e7d32] border-[#2e7d32] text-white shadow-sm"
                          : "bg-white border-slate-250 text-slate-750 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white border border-slate-250 text-slate-700 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:hover:bg-white cursor-pointer select-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white border border-slate-250 text-slate-700 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:hover:bg-white cursor-pointer select-none disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>

        </div>

      </div>

      {/* Floating Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 transform bg-slate-900 border border-slate-800 text-white rounded-2xl px-6 py-4 shadow-2xl z-40 flex items-center gap-6 max-w-xl w-[90%] md:w-auto"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center bg-emerald-600 text-white font-extrabold text-[11px] rounded-full w-5 h-5">
                {selectedIds.size}
              </span>
              <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Đang chọn</span>
            </div>

            <div className="w-px h-6 bg-slate-800" />

            <div className="flex items-center gap-2 flex-wrap">
              {bulkActions.map((act, idx) => {
                const btnStyles = {
                  primary: "bg-[#2e7d32] hover:bg-[#205c22] text-white",
                  danger: "bg-red-650 hover:bg-red-700 text-white",
                  warning: "bg-amber-600 hover:bg-amber-700 text-white",
                  success: "bg-emerald-600 hover:bg-emerald-700 text-white"
                }[act.variant || "primary"];

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      act.onClick(selectedItems);
                      setSelectedIds(new Set()); // Reset selections
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer select-none ${btnStyles}`}
                  >
                    {act.icon && <span className="inline-block shrink-0">{act.icon}</span>}
                    <span>{act.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => setSelectedIds(new Set())}
                className="flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
