"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { MultiSelect } from "./MultiSelect";
import { FormatType, TableConfig, PivotTableConfig } from "./PivotTable";
import { PivotTable } from "./PivotTable";

const formatTypes: FormatType[] = ["number", "currency", "percent", "eur"];

const formatTypeLabels: Record<FormatType, string> = {
  number: "Number",
  currency: "Currency (USD)",
  percent: "Percentage",
  eur: "Currency (EUR)",
};

interface TableConfigPanelProps {
  config: TableConfig;
  index: number;
  dimensionOptions: string[];
  numericOptions: string[];
  onUpdate: (config: TableConfig) => void;
  onRemove: () => void;
  showRemove: boolean;
}

const TableConfigPanel = ({
  config,
  index,
  dimensionOptions,
  numericOptions,
  onUpdate,
  onRemove,
  showRemove,
}: TableConfigPanelProps) => {
  const handleFormatTypeChange = (value: FormatType) => {
    onUpdate({ ...config, formatType: value });
  };

  return (
    <div className="p-4 border border-gray-800 rounded-lg bg-[#0B0B0F]/50 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-400">Table {index + 1}</h3>
        {showRemove && (
          <button
            onClick={onRemove}
            className="text-gray-500 hover:text-gray-300 text-lg p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Column Dimensions
          </label>
          <MultiSelect
            options={dimensionOptions}
            value={config.colDimensions}
            onChange={(values) =>
              onUpdate({ ...config, colDimensions: values })
            }
            placeholder="Select column dimensions"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Value Dimension
          </label>
          <MultiSelect
            options={numericOptions}
            value={[config.valueDimension]}
            onChange={(values) =>
              onUpdate({ ...config, valueDimension: values[0] })
            }
            placeholder="Select value dimension"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Format Type
          </label>
          <select
            value={config.formatType}
            onChange={(e) =>
              handleFormatTypeChange(e.target.value as FormatType)
            }
            className="w-full p-2 rounded-lg bg-[#0B0B0F] text-gray-300 border border-gray-800 
              focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            {formatTypes.map((type) => (
              <option key={type} value={type}>
                {formatTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.showColumnTotal}
              onChange={(e) =>
                onUpdate({
                  ...config,
                  showColumnTotal: e.target.checked,
                })
              }
              className="rounded bg-gray-900 border-gray-700"
            />
            <span className="text-sm">Show Column Total</span>
          </label>
        </div>
      </div>
    </div>
  );
};

interface RowData {
  id: string;
  content: string;
  path: string[];
  depth: number;
  children?: RowData[];
  values: Array<{
    content: string;
    isNumber?: boolean;
    isTotal?: boolean;
    isPositive?: boolean;
    isNegative?: boolean;
  }>;
  isExpanded: boolean;
  displayType: string;
  displayClass: string;
}

interface PivotTableUIProps {
  data: any[];
  config?: Partial<PivotTableConfig>;
  configureable?: boolean;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
  </div>
);

export function PivotTableUI({
  data,
  config: initialConfig,
  configureable = false,
}: PivotTableUIProps) {
  // 1. All useState hooks
  const [isHydrated, setIsHydrated] = useState(false);
  const [clientData, setClientData] = useState<typeof data | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [dimensionValues, setDimensionValues] = useState<
    Record<string, string[]>
  >({});
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [numericDimensions, setNumericDimensions] = useState<string[]>([]);
  const [headers, setHeaders] = useState<any[][]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [showConfig, setShowConfig] = useState(configureable);

  // Initialize config state
  const [config, setConfig] = useState<PivotTableConfig>(() => {
    const defaultConfig: PivotTableConfig = {
      rowDimensions: [],
      tableConfigs: [],
      showRowTotal: true,
      filters: {},
    };

    if (!initialConfig) {
      return defaultConfig;
    }

    return {
      rowDimensions: initialConfig.rowDimensions || defaultConfig.rowDimensions,
      tableConfigs: initialConfig.tableConfigs || defaultConfig.tableConfigs,
      showRowTotal: initialConfig.showRowTotal ?? defaultConfig.showRowTotal,
      filters: initialConfig.filters || defaultConfig.filters,
    };
  });

  // Initialize tableConfigs state
  const [tableConfigs, setTableConfigs] = useState<TableConfig[]>(() => {
    if (!initialConfig?.tableConfigs) {
      return [];
    }

    return initialConfig.tableConfigs.map((tc, index) => ({
      id: tc.id || `table-${index + 1}`,
      colDimensions: tc.colDimensions || [],
      valueDimension: tc.valueDimension || "",
      formatType: tc.formatType || ("number" as FormatType),
      showColumnTotal: tc.showColumnTotal ?? true,
    }));
  });

  // 2. useRef hooks
  const pivotTableRef = useRef<PivotTable | null>(null);

  // 3. All useCallback hooks
  const getStableId = useCallback((index: number) => `table-${index + 1}`, []);

  const updateTableConfigAndState = useCallback(
    (newTableConfig: TableConfig) => {
      const updatedConfig: TableConfig = {
        id: tableConfigs[0]?.id || getStableId(0),
        colDimensions: newTableConfig.colDimensions,
        valueDimension: newTableConfig.valueDimension,
        formatType: newTableConfig.formatType,
        showColumnTotal: newTableConfig.showColumnTotal,
      };

      setTableConfigs((prev) =>
        prev.map((tc, i) => (i === 0 ? updatedConfig : tc))
      );

      setConfig((prev) => ({
        ...prev,
        tableConfigs: prev.tableConfigs.map((tc, i) =>
          i === 0 ? updatedConfig : tc
        ),
      }));
    },
    [tableConfigs, getStableId]
  );

  const loadDimensionValues = useCallback(async () => {
    if (!pivotTableRef.current || !mounted || !config.rowDimensions) return;

    try {
      const values: Record<string, string[]> = {};
      for (const dimension of config.rowDimensions) {
        values[dimension] = await pivotTableRef.current.getDimensionValues(
          dimension
        );
      }
      setDimensionValues(values);
    } catch (err) {
      console.error("Error loading dimension values:", err);
      throw err;
    }
  }, [mounted, config.rowDimensions]);

  const loadVirtualizedRows = useCallback(async () => {
    if (!pivotTableRef.current || !mounted) return;

    try {
      setIsLoadingRows(true);
      const hierarchicalRows =
        await pivotTableRef.current.getHierarchicalRows();
      const headers = await pivotTableRef.current.getHeaders();
      setHeaders(headers);
      setRows(hierarchicalRows);
    } catch (err) {
      console.error("Error loading virtualized rows:", err);
      throw err;
    } finally {
      setIsLoadingRows(false);
    }
  }, [mounted]);

  const loadInitialData = useCallback(async () => {
    if (!pivotTableRef.current || !mounted) return;

    try {
      setLoading(true);
      setError(null);

      if (data && data.length > 0) {
        const allDimensions = Object.keys(data[0]);
        setDimensions(allDimensions);
        // Detect numeric dimensions
        const numeric = allDimensions.filter(
          (dim) =>
            !isNaN(Number(data[0][dim])) && typeof data[0][dim] !== "boolean"
        );
        setNumericDimensions(numeric);
      }

      if (config.rowDimensions && config.rowDimensions.length > 0) {
        await loadDimensionValues();
      }

      await loadVirtualizedRows();
    } catch (err) {
      console.error("Error loading initial data:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [
    mounted,
    data,
    config.rowDimensions,
    loadDimensionValues,
    loadVirtualizedRows,
  ]);

  // 4. All useEffect hooks
  useEffect(() => {
    setMounted(true);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || !data) return;
    setClientData(data);
  }, [isHydrated, data]);

  useEffect(() => {
    if (!mounted || !clientData) return;
    const initializeTable = async () => {
      try {
        pivotTableRef.current = new PivotTable(clientData, config);
        await loadInitialData();
      } catch (err) {
        console.error("Error initializing PivotTable:", err);
        setError((err as Error).message);
      }
    };
    initializeTable();
  }, [mounted, clientData, config, loadInitialData]);

  // Return a skeleton during SSR
  if (typeof window === "undefined" || !isHydrated) {
    return (
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-900 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Loading...
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  Loading...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (loading || !rows.length) {
    return <LoadingSpinner />;
  }

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  return (
    <div className="w-full">
      {/* Config Panel */}
      {showConfig && tableConfigs.length > 0 && (
        <div className="mb-4 p-4 border border-gray-800 rounded-lg bg-gray-900">
          <TableConfigPanel
            config={tableConfigs[0]}
            index={0}
            dimensionOptions={dimensions}
            numericOptions={numericDimensions}
            onUpdate={updateTableConfigAndState}
            onRemove={() => {}}
            showRemove={false}
          />
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900">
            {headers.map((headerRow, i) => (
              <tr key={i}>
                {headerRow.map((header, j) => (
                  <th
                    key={j}
                    className={`
                      px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider
                      ${
                        header.isRowHeader
                          ? "sticky left-0 z-10 bg-gray-900"
                          : ""
                      }
                      ${header.isTotal ? "bg-gray-800" : ""}
                    `}
                    colSpan={header.colSpan}
                    rowSpan={header.rowSpan}
                  >
                    {header.content}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {rows.map((row) => {
              const isExpanded = expandedRows.has(row.id);
              return (
                <React.Fragment key={row.id}>
                  <tr className="group hover:bg-gray-700/30">
                    <td className="sticky left-0 bg-gray-800 group-hover:bg-gray-700/30 z-10 font-medium border-r border-gray-700 px-4 py-2 text-sm">
                      <div className="flex items-center">
                        <span style={{ marginLeft: `${row.depth * 1.5}rem` }} />
                        {row.children && (
                          <button
                            onClick={() => toggleRowExpansion(row.id)}
                            className="mr-2 p-1 hover:bg-gray-600 rounded-full"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        )}
                        <span className="text-gray-300">{row.content}</span>
                      </div>
                    </td>
                    {row.values.map((value, j) => (
                      <td
                        key={j}
                        className={`
                          px-4 py-2 text-sm text-right border-l border-gray-700
                          ${value.isTotal ? "bg-gray-700/50 font-medium" : ""}
                          ${value.isPositive ? "text-green-400" : ""}
                          ${value.isNegative ? "text-red-400" : ""}
                          ${
                            !value.isPositive && !value.isNegative
                              ? "text-gray-300"
                              : ""
                          }
                        `}
                      >
                        {value.content}
                      </td>
                    ))}
                  </tr>
                  {isExpanded &&
                    row.children &&
                    row.children.map((child) => (
                      <tr key={child.id} className="group hover:bg-gray-700/30">
                        <td className="sticky left-0 bg-gray-800 group-hover:bg-gray-700/30 z-10 font-medium border-r border-gray-700 px-4 py-2 text-sm">
                          <div className="flex items-center">
                            <span
                              style={{ marginLeft: `${child.depth * 1.5}rem` }}
                            />
                            <span className="text-gray-300">
                              {child.content}
                            </span>
                          </div>
                        </td>
                        {child.values.map((value, j) => (
                          <td
                            key={j}
                            className={`
                            px-4 py-2 text-sm text-right border-l border-gray-700
                            ${value.isTotal ? "bg-gray-700/50 font-medium" : ""}
                            ${value.isPositive ? "text-green-400" : ""}
                            ${value.isNegative ? "text-red-400" : ""}
                            ${
                              !value.isPositive && !value.isNegative
                                ? "text-gray-300"
                                : ""
                            }
                          `}
                          >
                            {value.content}
                          </td>
                        ))}
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PivotTableUI;
