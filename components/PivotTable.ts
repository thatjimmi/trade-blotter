// Types
export type FormatType = "number" | "currency" | "percent" | "eur";

export interface TableConfig {
  id: string;
  colDimensions: string[];
  valueDimension: string;
  formatType: FormatType;
}

export interface DataRow {
  [key: string]: string | number | Date;
}

export interface PivotTableConfig {
  rowDimensions: string[];
  tableConfigs: TableConfig[];
  filters: Record<string, string[]>;
}

// Utility functions
const getDimensionType = (data: DataRow[], dimension: string): "string" | "number" | "date" => {
  const sample = data[0]?.[dimension];
  if (!sample) return "string";

  if (!isNaN(parseFloat(String(sample))) && isFinite(Number(sample))) {
    return "number";
  }

  if (!isNaN(Date.parse(String(sample)))) {
    return "date";
  }

  return "string";
};

const formatValue = (value: number, formatType: FormatType): string => {
  switch (formatType) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    case "percent":
      return new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
      }).format(value / 100);
    case "eur":
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(value);
    default:
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
      }).format(value);
  }
};

export class PivotTable {
  private data: DataRow[];
  private config: PivotTableConfig;
  private dimensions: string[];

  constructor(data: DataRow[], config: PivotTableConfig) {
    this.data = data;
    this.config = config;
    this.dimensions = Object.keys(data[0] || {});
  }


  private getColumnCombinations(config: TableConfig): string[][] {
    if (!config.colDimensions.length) return [];

    const filteredData = this.filterData();
    const combinations: string[][] = [];

    const firstDimValues = [...new Set(
      filteredData
        .map((row) => String(row[config.colDimensions[0]]))
        .filter(Boolean)
    )].sort();

    const buildCombinations = (currentCombo: string[], depth: number) => {
      if (depth === config.colDimensions.length) {
        combinations.push(currentCombo);
        return;
      }

      const dimension = config.colDimensions[depth];
      const validValues = [...new Set(
        filteredData
          .filter((row) =>
            currentCombo.every(
              (value, i) => String(row[config.colDimensions[i]]) === value
            )
          )
          .map((row) => String(row[dimension]))
          .filter(Boolean)
      )].sort();

      for (const value of validValues) {
        buildCombinations([...currentCombo, value], depth + 1);
      }
    };

    for (const value of firstDimValues) {
      buildCombinations([value], 1);
    }

    return combinations;
  }

  public getHeaders(): any[][] {
    const filteredData = this.filterData();
    const activeConfigs = this.config.tableConfigs.filter(
      (config) => config.colDimensions.length && config.valueDimension
    );

    if (activeConfigs.length === 0) return [];

    const maxColDimensions = Math.max(
      ...activeConfigs.map((config) => config.colDimensions.length)
    );

    return Array(maxColDimensions).fill(0).map((_, depth) => {
      const headers = [];
      
      if (depth === 0) {
        headers.push({
          content: this.config.rowDimensions[0],
          rowSpan: maxColDimensions,
          isRowHeader: true
        });
      }

      activeConfigs.forEach((config) => {
        if (depth >= config.colDimensions.length) return;

        const combinations = this.getColumnCombinations(config);
        const headerGroups = new Map();
        
        combinations.forEach((combo) => {
          const pathKey = combo.slice(0, depth + 1).join("|");
          if (!headerGroups.has(pathKey)) {
            headerGroups.set(pathKey, combo);
          }
        });

        const getColspan = (path: string[]) => {
          if (depth === config.colDimensions.length - 1) return 1;
          return combinations.filter((combo) =>
            path.every((value, i) => combo[i] === value)
          ).length;
        };

        [...headerGroups.values()]
          .sort((a, b) => {
            for (let i = 0; i <= depth; i++) {
              const comp = String(a[i]).localeCompare(String(b[i]));
              if (comp !== 0) return comp;
            }
            return 0;
          })
          .forEach((path) => {
            const value = path[depth];
            const fullPath = path.slice(0, depth + 1);
            headers.push({
              content: value,
              path: fullPath,
              colSpan: getColspan(fullPath)
            });
          });

        if (depth === 0) {
          headers.push({
            content: "Total",
            rowSpan: maxColDimensions,
            isTotal: true
          });
        }
      });

      return headers;
    });
  }

  public getRows(): any[][] {
    const filteredData = this.filterData();
    const rows: any[][] = [];

    const processRow = (rowPath: string[], indent = 0): void => {
      const rowValues = filteredData.filter((row) =>
        rowPath.every(
          (value, index) => String(row[this.config.rowDimensions[index]]) === value
        )
      );

      const row = [];
      row.push({
        content: rowPath[rowPath.length - 1],
        indent,
        isRowHeader: true
      });

      this.config.tableConfigs.forEach((config) => {
        if (!config.colDimensions.length || !config.valueDimension) return;

        const combinations = this.getColumnCombinations(config);
        combinations.forEach((combo) => {
          const matchingRows = rowValues.filter((row) =>
            combo.every(
              (value, index) =>
                String(row[config.colDimensions[index]]) === value
            )
          );

          const value = matchingRows.reduce(
            (sum, row) => sum + (parseFloat(String(row[config.valueDimension])) || 0),
            0
          );

          row.push({
            content: formatValue(value, config.formatType),
            isNumber: true
          });
        });

        // Add row total
        row.push({
          content: formatValue(
            rowValues.reduce(
              (sum, row) => sum + (parseFloat(String(row[config.valueDimension])) || 0),
              0
            ),
            config.formatType
          ),
          isTotal: true
        });
      });

      rows.push(row);
    };

    // Process all root level rows
    const rootValues = [...new Set(
      filteredData
        .map((row) => String(row[this.config.rowDimensions[0]]))
        .filter(Boolean)
    )].sort((a, b) => {
      const type = getDimensionType(filteredData, this.config.rowDimensions[0]);
      if (type === "date") {
        return new Date(String(a)).getTime() - new Date(String(b)).getTime();
      }
      if (type === "number") {
        return parseFloat(String(a)) - parseFloat(String(b));
      }
      return String(a).localeCompare(String(b));
    });

    rootValues.forEach((value) => processRow([String(value)]));

    // Add grand total row
    if (this.config.rowDimensions.length > 0) {
      const totalRow = [];
      totalRow.push({
        content: "Total",
        isRowHeader: true,
        isTotal: true
      });

      this.config.tableConfigs.forEach((config) => {
        if (!config.colDimensions.length || !config.valueDimension) return;

        const combinations = this.getColumnCombinations(config);
        combinations.forEach((combo) => {
          const matchingRows = filteredData.filter((row) =>
            combo.every(
              (value, index) =>
                String(row[config.colDimensions[index]]) === value
            )
          );

          const total = matchingRows.reduce(
            (sum, row) => sum + (parseFloat(String(row[config.valueDimension])) || 0),
            0
          );

          totalRow.push({
            content: formatValue(total, config.formatType),
            isNumber: true,
            isTotal: true
          });
        });

        // Add grand total
        totalRow.push({
          content: formatValue(
            filteredData.reduce(
              (sum, row) => sum + (parseFloat(String(row[config.valueDimension])) || 0),
              0
            ),
            config.formatType
          ),
          isNumber: true,
          isTotal: true
        });
      });

      rows.push(totalRow);
    }

    return rows;
  }

  public getDimensions(): string[] {
    return this.dimensions;
  }

  public getNumericDimensions(): string[] {
    return this.dimensions.filter(
      (dim) =>
        !isNaN(parseFloat(String(this.data[0][dim]))) &&
        isFinite(Number(this.data[0][dim]))
    );
  }

  public getDimensionValues(dimension: string): string[] {
    return [...new Set(
      this.data
        .map((row) => String(row[dimension]))
        .filter(Boolean)
    )].sort();
  }

  public filterData(): DataRow[] {
    return this.data.filter((row) =>
      Object.entries(this.config.filters).every(([dimension, selectedValues]) =>
        selectedValues.length === 0
          ? true
          : selectedValues.includes(String(row[dimension]))
      )
    );
  }
  
  public calculateRowValues(rowPath: string[]): any[] {
    const values: any[] = [];
    const matchingRows = this.filterData().filter(row =>
      rowPath.every((value, index) => 
        String(row[this.config.rowDimensions[index]]) === value
      )
    );
  
    this.config.tableConfigs.forEach((config) => {
      if (!config.colDimensions.length || !config.valueDimension) return;
  
      const combinations = this.getColumnCombinations(config);
      combinations.forEach((combo) => {
        const comboRows = matchingRows.filter(row =>
          combo.every((value, index) =>
            String(row[config.colDimensions[index]]) === value
          )
        );
  
        const value = comboRows.reduce(
          (sum, row) => sum + (parseFloat(String(row[config.valueDimension])) || 0),
          0
        );
  
        values.push({
          content: formatValue(value, config.formatType),
          isNumber: true
        });
      });
  
      // Add row total
      const total = matchingRows.reduce(
        (sum, row) => sum + (parseFloat(String(row[config.valueDimension])) || 0),
        0
      );
  
      values.push({
        content: formatValue(total, config.formatType),
        isNumber: true,
        isTotal: true
      });
    });
  
    return values;
  }
}