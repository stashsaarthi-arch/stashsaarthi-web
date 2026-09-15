import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  FileSpreadsheet,
  Layers,
} from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import {
  getDataTableErgonomicsTokens,
  DATA_TABLE_ERGONOMICS_TOKENS,
} from "@/lib/designTokens";
import { playClick, playPop, playSuccessChime } from "@/lib/audio";

export interface ColumnSpec<T> {
  id: string;
  header: string | React.ReactNode;
  accessor?: (row: T) => any;
  field?: keyof T;
  sortable?: boolean;
  sortKey?: (row: T) => string | number | Date | boolean;
  cell?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
}

export interface DataTableErgonomicsProps<T> {
  data: T[];
  columns: ColumnSpec<T>[];
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchableKeys?: (keyof T)[];
  exportFilename?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  emptyIcon?: React.ElementType;
  emptyTitle?: string;
  emptySubtitle?: string;
  actions?: React.ReactNode;
  onRowClick?: (row: T) => void;
  maxHeight?: string;
  showSearch?: boolean;
  showExport?: boolean;
  showPagination?: boolean;
  showStats?: boolean;
}

export function exportToCsv<T>(
  data: T[],
  columns: ColumnSpec<T>[],
  filename: string = DATA_TABLE_ERGONOMICS_TOKENS.csvExportConfig.defaultFilename
) {
  if (!data || data.length === 0) return;

  const validColumns = columns.filter((col) => typeof col.header === "string");
  const headers = validColumns.map((col) => `"${(col.header as string).replace(/"/g, '""')}"`);

  const rows = data.map((row) =>
    validColumns
      .map((col) => {
        let val: any = "";
        if (col.accessor) {
          val = col.accessor(row);
        } else if (col.field) {
          val = row[col.field];
        }

        if (val === null || val === undefined) {
          val = "";
        } else if (typeof val === "object") {
          val = JSON.stringify(val);
        } else {
          val = String(val);
        }

        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], {
    type: DATA_TABLE_ERGONOMICS_TOKENS.csvExportConfig.mimeType,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}${
    DATA_TABLE_ERGONOMICS_TOKENS.csvExportConfig.fileExtension
  }`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function DataTableErgonomics<T extends Record<string, any>>({
  data,
  columns,
  title,
  subtitle,
  searchPlaceholder = "Search in records...",
  searchableKeys,
  exportFilename = DATA_TABLE_ERGONOMICS_TOKENS.csvExportConfig.defaultFilename,
  pageSizeOptions = [...DATA_TABLE_ERGONOMICS_TOKENS.paginationOptions],
  defaultPageSize = DATA_TABLE_ERGONOMICS_TOKENS.defaultPageSize,
  emptyIcon: EmptyIcon = Layers,
  emptyTitle = "No records found",
  emptySubtitle = "No matching entries found for your query or filter.",
  actions,
  onRowClick,
  maxHeight = "580px",
  showSearch = true,
  showExport = true,
  showPagination = true,
  showStats = true,
}: DataTableErgonomicsProps<T>) {
  const { role } = usePersona();
  const tokens = useMemo(
    () => getDataTableErgonomicsTokens(role as "student" | "host"),
    [role]
  );

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumnId, setSortColumnId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filtered data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();

    return data.filter((row) => {
      if (searchableKeys && searchableKeys.length > 0) {
        return searchableKeys.some((key) => {
          const val = row[key];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(query);
        });
      }

      // Default search across all stringifiable values or columns
      return columns.some((col) => {
        let val: any;
        if (col.accessor) {
          val = col.accessor(row);
        } else if (col.field) {
          val = row[col.field];
        }

        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchableKeys, columns]);

  // Sorted data based on column sort
  const sortedData = useMemo(() => {
    if (!sortColumnId || sortDirection === "none") return filteredData;

    const col = columns.find((c) => c.id === sortColumnId);
    if (!col) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (col.sortKey) {
        valA = col.sortKey(a);
        valB = col.sortKey(b);
      } else if (col.accessor) {
        valA = col.accessor(a);
        valB = col.accessor(b);
      } else if (col.field) {
        valA = a[col.field];
        valB = b[col.field];
      }

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let result = 0;
      if (typeof valA === "number" && typeof valB === "number") {
        result = valA - valB;
      } else if (valA instanceof Date && valB instanceof Date) {
        result = valA.getTime() - valB.getTime();
      } else {
        result = String(valA).localeCompare(String(valB));
      }

      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredData, sortColumnId, sortDirection, columns]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, safeCurrentPage, pageSize, showPagination]);

  // Reset page when search or sort changes
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortToggle = (col: ColumnSpec<T>) => {
    if (!col.sortable && !col.sortKey) return;

    playPop();
    if (sortColumnId !== col.id) {
      setSortColumnId(col.id);
      setSortDirection("asc");
    } else {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumnId(null);
        setSortDirection("none");
      } else {
        setSortDirection("asc");
      }
    }
  };

  const handleExport = () => {
    playSuccessChime();
    exportToCsv(sortedData, columns, exportFilename);
  };

  const startIndex = (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(sortedData.length, safeCurrentPage * pageSize);

  return (
    <div className="space-y-3 w-full">
      {/* Table Toolbar Header */}
      {(title || showSearch || showExport || actions) && (
        <div className="flex items-center justify-between gap-3 flex-wrap bg-white/[0.02] border border-white/10 rounded-2xl p-3.5 backdrop-blur-xl">
          {/* Title & Subtitle */}
          {title && (
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileSpreadsheet className={`h-4 w-4 ${tokens.accent.activeText}`} />
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-muted-foreground font-medium">{subtitle}</p>
              )}
            </div>
          )}

          {/* Controls Right */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {/* Search Input */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-8 pl-8 pr-8 w-44 sm:w-60 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      playClick();
                      handleSearchChange("");
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    title="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Custom Actions */}
            {actions}

            {/* Export CSV Button */}
            {showExport && sortedData.length > 0 && (
              <button
                onClick={handleExport}
                className="h-8 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1.5 transition-colors"
                title="Export table data to CSV"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Sticky Table Box */}
      <div
        className="admin-data-table-container relative overflow-x-auto overflow-y-auto"
        style={{ maxHeight: maxHeight }}
      >
        <table className="w-full text-sm text-left border-collapse">
          {/* Sticky Table Header */}
          <thead className="admin-sticky-table-header">
            <tr>
              {columns.map((col) => {
                const isSorted = sortColumnId === col.id && sortDirection !== "none";
                const canSort = col.sortable || Boolean(col.sortKey);
                const alignClass =
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : "text-left";

                return (
                  <th
                    key={col.id}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap ${alignClass} ${
                      col.headerClassName || ""
                    }`}
                  >
                    {canSort ? (
                      <button
                        onClick={() => handleSortToggle(col)}
                        className={`data-table-sort-button ${alignClass} ${
                          isSorted ? tokens.accent.activeText : ""
                        }`}
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3 shrink-0" />
                          ) : (
                            <ArrowDown className="h-3 w-3 shrink-0" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40 shrink-0" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-white/[0.05]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <EmptyIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs font-semibold text-foreground mb-1">{emptyTitle}</p>
                    <p className="text-[11px] text-muted-foreground max-w-xs">{emptySubtitle}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={String(row["id"] ?? `row-${idx}`)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`data-table-row-hover transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => {
                    const alignClass =
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left";

                    let cellValue: React.ReactNode = null;
                    if (col.cell) {
                      cellValue = col.cell(row, idx);
                    } else if (col.accessor) {
                      cellValue = String(col.accessor(row) ?? "—");
                    } else if (col.field) {
                      cellValue = String(row[col.field] ?? "—");
                    }

                    return (
                      <td
                        key={col.id}
                        className={`px-4 py-3 text-xs text-foreground font-normal ${alignClass} ${
                          col.className || ""
                        }`}
                      >
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {/* Footer Ergonomic Pagination & Stats Bar */}
      {showPagination && sortedData.length > 0 && (
        <div className="data-table-pagination-bar rounded-2xl">
          {/* Info Stats */}
          {showStats && (
            <div className="text-xs text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{startIndex}</span> to{" "}
              <span className="font-semibold text-foreground">{endIndex}</span> of{" "}
              <span className="font-semibold text-foreground">{sortedData.length}</span> entries
              {data.length !== sortedData.length && (
                <span className="ml-1 text-[10px] text-emerald-400">
                  (filtered from {data.length} total)
                </span>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  playPop();
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 px-2 rounded-lg bg-white/5 border border-white/10 text-xs text-foreground focus:outline-none focus:border-emerald-500/40"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900 text-foreground">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  playClick();
                  setCurrentPage(1);
                }}
                disabled={safeCurrentPage === 1}
                className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => {
                  playClick();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                disabled={safeCurrentPage === 1}
                className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <span className="px-2 text-xs font-semibold text-foreground">
                Page {safeCurrentPage} of {totalPages}
              </span>

              <button
                onClick={() => {
                  playClick();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
                disabled={safeCurrentPage === totalPages}
                className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Next Page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => {
                  playClick();
                  setCurrentPage(totalPages);
                }}
                disabled={safeCurrentPage === totalPages}
                className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
