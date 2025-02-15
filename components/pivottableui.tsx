import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { PivotTable } from "./PivotTable";

const TableConfigPanel = ({
  config,
  index,
  dimensionOptions,
  numericOptions,
  onUpdate,
  onRemove,
  showRemove,
}) => (
  <div className="p-4 border border-gray-800 rounded-lg bg-[#0B0B0F]/50 space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-medium text-gray-400">Table {index + 1}</h3>
      {showRemove && (
        <button
          onClick={() => onRemove(config.id)}
          className="text-gray-500 hover:text-gray-300 text-lg p-1"
        >
          x
        </button>
      )}
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-xs mb-1 text-gray-400">
          Column Dimensions
        </label>
        <MultiSelect
          options={dimensionOptions}
          value={config.colDimensions}
          onChange={(values) =>
            onUpdate(config.id, { ...config, colDimensions: values })
          }
          placeholder="Select column dimensions"
        />
      </div>

      <div>
        <label className="block text-xs mb-1 text-gray-400">
          Value Dimension
        </label>
        <MultiSelect
          options={numericOptions}
          value={[config.valueDimension]}
          onChange={(values) =>
            onUpdate(config.id, { ...config, valueDimension: values[0] })
          }
          placeholder="Select value dimension"
        />
      </div>

      <div>
        <label className="block text-xs mb-1 text-gray-400">Format Type</label>
        <select
          value={config.formatType}
          onChange={(e) =>
            onUpdate(config.id, { ...config, formatType: e.target.value })
          }
          className="w-full p-2 rounded-lg bg-[#0B0B0F] text-gray-300 border border-gray-800 
            focus:outline-none focus:ring-2 focus:ring-gray-700"
        >
          <option value="number">Number</option>
          <option value="currency">Currency (USD)</option>
          <option value="percent">Percentage</option>
          <option value="eur">Currency (EUR)</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-xs text-gray-400">Total Options</label>
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
              className="rounded bg-gray-900 border-gray-700"
            />
            Show Column Total
          </label>
        </div>
      </div>
    </div>
  </div>
);

const MultiSelect = ({ options, value, onChange, placeholder }) => (
  <select
    multiple
    value={value}
    onChange={(e) =>
      onChange([...e.target.selectedOptions].map((opt) => opt.value))
    }
    className="w-full p-2 rounded-lg bg-[#0B0B0F] text-gray-300 border border-gray-800 
      focus:outline-none focus:ring-2 focus:ring-gray-700"
  >
    <option value="" disabled className="bg-[#0B0B0F]">
      {placeholder}
    </option>
    {options.map((opt) => (
      <option key={opt} value={opt} className="bg-[#0B0B0F] text-gray-300">
        {opt}
      </option>
    ))}
  </select>
);

const PivotTableUI = ({ data, initialConfig, configureable }) => {
  const [pivotTable, setPivotTable] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showConfig, setShowConfig] = useState(configureable);
  const [config, setConfig] = useState({
    showRowTotal: true,
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
        className="sticky left-0 bg-[#0B0B0F] group-hover:bg-gray-900/30 z-10 font-medium border-r border-gray-800 px-4 py-2 text-sm"
      >
        <div className="flex items-center">
          <span style={{ marginLeft: `${row.depth * 1.5}rem` }} />
          {row.children && (
            <button
              onClick={() => toggleRowExpansion(row.id)}
              className="mr-2 p-1 hover:bg-gray-800 rounded-full"
            >
              {row.isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
          <span className="text-gray-400 group-hover:text-gray-300">
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
            px-4 py-2 text-sm text-right
            ${value.isTotal ? "bg-gray-900/50 font-medium" : ""}
            ${value.isPositive ? "text-green-400" : ""}
            ${value.isNegative ? "text-red-400" : ""}
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
        <tr key={row.id} className="group hover:bg-gray-900/30">
          {renderRow(row)}
        </tr>,
      ];

      if (row.isExpanded && row.children) {
        // Pass false for nested levels to prevent multiple grand totals
        mainRow.push(...renderRows(row.children, false));
      }

      return mainRow;
    });

    // Only add grand total row at the root level
    if (isRootLevel && config.showRowTotal) {
      result.push(
        <tr key="grand-total" className="bg-gray-900/30 font-medium">
          <td className="sticky left-0 bg-gray-900/30 z-10 px-4 py-2 text-sm border-r border-gray-800">
            Total
          </td>
          {config.tableConfigs.flatMap((tableConfig) => {
            const values = pivotTable.calculateGrandTotalValues(tableConfig);
            return values.map((value, idx) => (
              <td
                key={`total-${idx}`}
                className="px-4 py-2 text-sm text-right font-medium"
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
    <div className="w-full space-y-6 bg-[#0B0B0F] text-gray-300 p-6 rounded-xl border border-slate-800">
      {/* Toggle Configuration Button */}
      {configureable && (
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
        >
          {showConfig ? "Hide Configuration" : "Show Configuration"}
        </button>
      )}

      {/* Configuration Section */}
      {showConfig && (
        <div className="space-y-6">
          {/* Row Dimensions */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Row Dimensions
            </label>
            <MultiSelect
              options={dimensions}
              value={config.rowDimensions}
              onChange={handleRowDimensionChange}
              placeholder="Select dimensions"
            />
          </div>

          {/* Table Configurations */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-400">
                Table Configurations
              </h3>
              <button
                onClick={addNewTable}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 
                  text-gray-300 transition-colors"
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
                />
              ))}
            </div>
          </div>

          {/* Total Configuration */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Total Options</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.showRowTotal}
                onChange={(e) => handleRowTotalToggle(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700"
              />
              <span className="text-sm">Show Grand Total Row</span>
            </label>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-400">Filters</h3>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {dimensions.map((dimension) => (
                <div key={dimension}>
                  <label className="block text-xs mb-1 text-gray-400">
                    {dimension}
                  </label>
                  <MultiSelect
                    options={pivotTable.getDimensionValues(dimension)}
                    value={config.filters[dimension] || []}
                    onChange={(values) => handleFilterChange(dimension, values)}
                    placeholder={`Filter ${dimension}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <table className="min-w-full divide-y divide-gray-800">
          <thead>
            {headers.map((headerRow, rowIndex) => (
              <tr key={rowIndex} className="bg-[#0B0B0F]">
                {headerRow.map((header, colIndex) => (
                  <th
                    key={colIndex}
                    rowSpan={header.rowSpan}
                    colSpan={header.colSpan}
                    className={`
                      px-4 py-2 text-left text-sm font-medium text-gray-400
                      ${
                        header.isRowHeader
                          ? "sticky left-0 bg-[#0B0B0F] z-10 border-r border-gray-800"
                          : ""
                      }
                      ${header.isTotal ? "bg-gray-900" : ""}
                    `}
                  >
                    {header.content}
                    {header.path && header.path.length > 1 && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({header.path.slice(0, -1).join(" → ")})
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-800">
            {renderRows(getHierarchicalRows())}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PivotTableUI;
