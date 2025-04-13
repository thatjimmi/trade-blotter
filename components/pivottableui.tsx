import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { PivotTable } from "./PivotTable";

export interface ColorTheme {
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  hover: string;
  positive: string;
  negative: string;
  buttonBackground: string;
  buttonHover: string;
  buttonText: string;
  divider: string;
}

const defaultTheme: ColorTheme = {
  background: "bg-[#0B0B0F]",
  backgroundSecondary: "bg-gray-900",
  backgroundTertiary: "bg-[#0B0B0F]/50",
  textPrimary: "text-gray-300",
  textSecondary: "text-gray-400",
  textTertiary: "text-gray-500",
  border: "border-gray-800",
  hover: "hover:bg-gray-800",
  positive: "text-green-400",
  negative: "text-red-400",
  buttonBackground: "bg-gray-800",
  buttonHover: "hover:bg-gray-700",
  buttonText: "text-gray-300",
  divider: "divide-gray-800",
};

const TableConfigPanel = ({
  config,
  index,
  dimensionOptions,
  numericOptions,
  onUpdate,
  onRemove,
  showRemove,
  theme = defaultTheme,
}) => (
  <div
    className={`p-4 border ${theme.border} rounded-lg ${theme.backgroundTertiary} space-y-4`}
  >
    <div className="flex justify-between items-center">
      <h3 className={`text-sm font-medium ${theme.textSecondary}`}>
        Table {index + 1}
      </h3>
      {showRemove && (
        <button
          onClick={() => onRemove(config.id)}
          className={`${theme.textTertiary} ${theme.hover} ${theme.textPrimary} text-lg p-1`}
        >
          x
        </button>
      )}
    </div>

    <div className="space-y-4">
      <div>
        <label className={`block text-xs mb-1 ${theme.textSecondary}`}>
          Column Dimensions
        </label>
        <MultiSelect
          options={dimensionOptions}
          value={config.colDimensions}
          onChange={(values) =>
            onUpdate(config.id, { ...config, colDimensions: values })
          }
          placeholder="Select column dimensions"
          theme={theme}
        />
      </div>

      <div>
        <label className={`block text-xs mb-1 ${theme.textSecondary}`}>
          Value Dimension
        </label>
        <MultiSelect
          options={numericOptions}
          value={[config.valueDimension]}
          onChange={(values) =>
            onUpdate(config.id, { ...config, valueDimension: values[0] })
          }
          placeholder="Select value dimension"
          theme={theme}
        />
      </div>

      <div>
        <label className={`block text-xs mb-1 ${theme.textSecondary}`}>
          Format Type
        </label>
        <select
          value={config.formatType}
          onChange={(e) =>
            onUpdate(config.id, { ...config, formatType: e.target.value })
          }
          className={`w-full p-2 rounded-lg ${theme.background} ${theme.textPrimary} border ${theme.border} 
            focus:outline-none focus:ring-2 focus:ring-gray-700`}
        >
          <option value="number">Number</option>
          <option value="currency">Currency (USD)</option>
          <option value="percent">Percentage</option>
          <option value="eur">Currency (EUR)</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className={`block text-xs ${theme.textSecondary}`}>
          Total Options
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={config.showColumnTotal}
              onChange={(e) =>
                onUpdate(config.id, {
                  ...config,
                  showColumnTotal: e.target.checked,
                })
              }
              className={`rounded ${theme.backgroundSecondary} ${theme.border}`}
            />
            Show Column Total
          </label>
        </div>
      </div>
    </div>
  </div>
);

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder,
  theme = defaultTheme,
}) => (
  <select
    multiple
    value={value}
    onChange={(e) =>
      onChange([...e.target.selectedOptions].map((opt) => opt.value))
    }
    className={`w-full p-2 rounded-lg ${theme.background} ${theme.textPrimary} border ${theme.border} 
      focus:outline-none focus:ring-2 focus:ring-gray-700`}
  >
    <option value="" disabled className={theme.background}>
      {placeholder}
    </option>
    {options.map((opt) => (
      <option
        key={opt}
        value={opt}
        className={`${theme.background} ${theme.textPrimary}`}
      >
        {opt}
      </option>
    ))}
  </select>
);

const PivotTableUI = ({
  data,
  initialConfig,
  configureable,
  theme = defaultTheme,
}: {
  data: any;
  initialConfig: any;
  configureable: boolean;
  theme?: ColorTheme;
}) => {
  const [pivotTable, setPivotTable] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showConfig, setShowConfig] = useState(configureable);
  const [config, setConfig] = useState({
    showRowTotal: true,
    expandedByDefault: false,
    ...initialConfig,
    tableConfigs:
      initialConfig?.tableConfigs.map((tc) => ({
        showColumnTotal: true,
        ...tc,
      })) || [],
  });
  const [tableConfigs, setTableConfigs] = useState(config.tableConfigs);

  useEffect(() => {
    if (data && config) {
      setPivotTable(new PivotTable(data, config));
    }
  }, [data, config]);

  useEffect(() => {
    if (pivotTable) {
      // If expandedByDefault is true, expand all rows initially
      if (config.expandedByDefault) {
        const allRows = getAllRowIds(getHierarchicalRows());
        setExpandedRows(new Set(allRows));
      } else {
        setExpandedRows(new Set());
      }
    }
  }, [config.expandedByDefault, pivotTable]);

  if (!pivotTable) return null;

  const dimensions = pivotTable.getDimensions();
  const numericDimensions = pivotTable.getNumericDimensions();
  const headers = pivotTable.getHeaders();

  const handleRowDimensionChange = (dimensions) => {
    setConfig((prev) => ({
      ...prev,
      rowDimensions: dimensions,
    }));
  };

  const handleFilterChange = (dimension, values) => {
    setConfig((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [dimension]: values,
      },
    }));
  };

  const clearAllFilters = () => {
    setConfig((prev) => ({
      ...prev,
      filters: {},
    }));
  };

  const addNewTable = () => {
    const newId = `table-${tableConfigs.length + 1}`;
    const newConfig = {
      id: newId,
      colDimensions: [],
      valueDimension: "",
      formatType: "number",
      showColumnTotal: true,
    };
    setTableConfigs([...tableConfigs, newConfig]);
    setConfig((prev) => ({
      ...prev,
      tableConfigs: [...prev.tableConfigs, newConfig],
    }));
  };

  const updateTableConfig = (id, newConfig) => {
    const updatedConfigs = tableConfigs.map((config) =>
      config.id === id ? newConfig : config
    );
    setTableConfigs(updatedConfigs);
    setConfig((prev) => ({
      ...prev,
      tableConfigs: updatedConfigs,
    }));
  };

  const removeTable = (id) => {
    const updatedConfigs = tableConfigs.filter((config) => config.id !== id);
    setTableConfigs(updatedConfigs);
    setConfig((prev) => ({
      ...prev,
      tableConfigs: updatedConfigs,
    }));
  };

  const handleRowTotalToggle = (checked) => {
    setConfig((prev) => ({
      ...prev,
      showRowTotal: checked,
    }));
  };

  const handleExpandedByDefaultToggle = (checked) => {
    setConfig((prev) => ({
      ...prev,
      expandedByDefault: checked,
    }));
  };

  // Helper function to get all row IDs
  const getAllRowIds = (rows) => {
    if (!rows) return [];
    return rows.flatMap((row) => {
      const ids = [row.id];
      if (row.children) {
        ids.push(...getAllRowIds(row.children));
      }
      return ids;
    });
  };

  // Get hierarchical rows data
  const getHierarchicalRows = () => {
    const filteredData = pivotTable.filterData();
    const { rowDimensions } = config;

    const buildRowHierarchy = (path = [], depth = 0) => {
      if (depth >= rowDimensions.length) return null;

      const currentDimension = rowDimensions[depth];
      const matchingRows = filteredData.filter((row) =>
        path.every((value, i) => String(row[rowDimensions[i]]) === value)
      );

      const dimensionValues = [
        ...new Set(matchingRows.map((row) => String(row[currentDimension]))),
      ].sort();

      return dimensionValues.map((value) => {
        const newPath = [...path, value];
        const children = buildRowHierarchy(newPath, depth + 1);

        const rowData = pivotTable.calculateRowValues(newPath);
        const rowId = `row-${newPath.join("-")}`;

        return {
          id: rowId,
          content: value,
          path: newPath,
          depth,
          children,
          values: rowData,
          isExpanded: expandedRows.has(rowId),
        };
      });
    };

    return buildRowHierarchy();
  };

  const toggleRowExpansion = (rowId) => {
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

  const renderRow = (row) => {
    const cells = [
      <td
        key="header"
        className={`sticky left-0 ${theme.background} font-medium border-r ${theme.border} px-4 py-2 text-sm z-40
          group-hover:${theme.backgroundSecondary} transition-colors`}
      >
        <div className="flex items-center">
          <span style={{ marginLeft: `${row.depth * 1.5}rem` }} />
          {row.children && (
            <button
              onClick={() => toggleRowExpansion(row.id)}
              className={`mr-2 p-1 ${theme.hover} rounded-full`}
            >
              {row.isExpanded ? (
                <ChevronDown className={`h-4 w-4 ${theme.textSecondary}`} />
              ) : (
                <ChevronRight className={`h-4 w-4 ${theme.textSecondary}`} />
              )}
            </button>
          )}
          <span
            className={`${theme.textSecondary} group-hover:${theme.textPrimary}`}
          >
            {row.content}
          </span>
        </div>
      </td>,
    ];

    // Add value cells
    row.values.forEach((value, index) => {
      cells.push(
        <td
          key={`value-${index}`}
          className={`
            px-4 py-2 text-sm text-right border-l ${theme.border} group-hover:${
            theme.backgroundSecondary
          }/30
            ${
              value.isTotal
                ? `${theme.backgroundSecondary} font-medium sticky right-0 z-30 group-hover:${theme.backgroundSecondary}`
                : ""
            }
            ${value.isPositive ? theme.positive : ""}
            ${value.isNegative ? theme.negative : ""}
          `}
        >
          {value.content}
        </td>
      );
    });

    return cells;
  };

  const renderRows = (rows, isRootLevel = true) => {
    if (!rows) return null;

    const result = rows.flatMap((row) => {
      const mainRow = [
        <tr key={row.id} className="group">
          {renderRow(row)}
        </tr>,
      ];

      if (row.isExpanded && row.children) {
        mainRow.push(...renderRows(row.children, false));
      }

      return mainRow;
    });

    if (isRootLevel && config.showRowTotal) {
      result.push(
        <tr
          key="grand-total"
          className={`${theme.backgroundSecondary} font-medium sticky bottom-0 z-40`}
        >
          <td
            className={`sticky left-0 ${theme.backgroundSecondary} z-40 px-4 py-2 text-sm border-r ${theme.border}`}
          >
            Total
          </td>
          {config.tableConfigs.flatMap((tableConfig) => {
            const values = pivotTable.calculateGrandTotalValues(tableConfig);
            return values.map((value, idx) => (
              <td
                key={`total-${idx}`}
                className={`
                  px-4 py-2 text-sm text-right font-medium border-l ${
                    theme.border
                  } ${theme.backgroundSecondary}
                  ${value.isTotal ? "sticky right-0 z-30" : ""}
                `}
              >
                {value.content}
              </td>
            ));
          })}
        </tr>
      );
    }

    return result;
  };

  return (
    <div
      className={`w-full space-y-6 ${theme.background} ${theme.textPrimary} ${
        configureable && "p-6"
      } rounded-xl border ${theme.border}`}
    >
      {/* Toggle Configuration Button */}
      {configureable && (
        <button
          onClick={() => setShowConfig(!showConfig)}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg ${theme.buttonBackground} ${theme.buttonHover} ${theme.buttonText} transition-colors`}
        >
          {showConfig ? "Hide Configuration" : "Show Configuration"}
        </button>
      )}

      {/* Configuration Section */}
      {showConfig && (
        <div className="space-y-6">
          {/* Row Dimensions */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}
            >
              Row Dimensions
            </label>
            <MultiSelect
              options={dimensions}
              value={config.rowDimensions}
              onChange={handleRowDimensionChange}
              placeholder="Select dimensions"
              theme={theme}
            />
          </div>

          {/* Table Configurations */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-sm font-medium ${theme.textSecondary}`}>
                Table Configurations
              </h3>
              <button
                onClick={addNewTable}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg ${theme.buttonBackground} ${theme.buttonHover} 
                  ${theme.buttonText} transition-colors`}
              >
                <Plus className="h-4 w-4" />
                Add Table
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tableConfigs.map((config, index) => (
                <TableConfigPanel
                  key={config.id}
                  config={config}
                  index={index}
                  dimensionOptions={dimensions}
                  numericOptions={numericDimensions}
                  onUpdate={updateTableConfig}
                  onRemove={removeTable}
                  showRemove={tableConfigs.length > 1}
                  theme={theme}
                />
              ))}
            </div>
          </div>

          {/* Total Configuration */}
          <div className="space-y-2">
            <h3 className={`text-sm font-medium ${theme.textSecondary}`}>
              Total Options
            </h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.showRowTotal}
                  onChange={(e) => handleRowTotalToggle(e.target.checked)}
                  className={`rounded ${theme.backgroundSecondary} ${theme.border}`}
                />
                <span className="text-sm">Show Grand Total Row</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.expandedByDefault}
                  onChange={(e) =>
                    handleExpandedByDefaultToggle(e.target.checked)
                  }
                  className={`rounded ${theme.backgroundSecondary} ${theme.border}`}
                />
                <span className="text-sm">Expand All Rows by Default</span>
              </label>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className={`text-sm font-medium ${theme.textSecondary}`}>
                Filters
              </h3>
              <button
                onClick={clearAllFilters}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg ${theme.buttonBackground} ${theme.buttonHover} ${theme.buttonText} transition-colors`}
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {dimensions.map((dimension) => (
                <div key={dimension}>
                  <label
                    className={`block text-xs mb-1 ${theme.textSecondary}`}
                  >
                    {dimension}
                  </label>
                  <MultiSelect
                    options={pivotTable.getDimensionValues(dimension)}
                    value={config.filters[dimension] || []}
                    onChange={(values) => handleFilterChange(dimension, values)}
                    placeholder={`Filter ${dimension}`}
                    theme={theme}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className={`overflow-x-auto border ${theme.border} rounded-lg max-h-[680px] relative`}
      >
        <table className={`min-w-full divide-y ${theme.divider}`}>
          <thead className={`sticky top-0 z-50 ${theme.background}`}>
            {headers.map((headerRow, rowIndex) => (
              <tr key={rowIndex} className={theme.background}>
                {headerRow.map((header, colIndex) => (
                  <th
                    key={colIndex}
                    rowSpan={header.rowSpan}
                    colSpan={header.colSpan}
                    className={`
                      px-4 py-2 text-left text-sm font-medium ${
                        theme.textSecondary
                      } border-0 border-r-0 border-t-0 ${theme.border}
                      ${
                        header.isRowHeader
                          ? `sticky left-0 ${theme.background} z-50 border-r ${theme.border} border-l-0`
                          : theme.background
                      }
                      ${
                        header.isTotal
                          ? `${theme.backgroundSecondary} sticky right-0 `
                          : ""
                      }
                    `}
                  >
                    {header.content}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={`divide-y  ${theme.divider}`}>
            {renderRows(getHierarchicalRows())}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PivotTableUI;
