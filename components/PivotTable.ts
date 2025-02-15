export type FormatType = "number" | "currency" | "percent" | "eur";

export interface TableConfig {
  id: string;
  colDimensions: string[];
  valueDimension: string;
  formatType: FormatType;
  showColumnTotal: boolean;
}

export interface DataRow {
  [key: string]: string | number | Date;
}

export interface PivotTableConfig {
  rowDimensions: string[];
  tableConfigs: TableConfig[];
  filters: Record<string, string[]>;
  showRowTotal: boolean;
}

// PivotTable.ts
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

  public filterData(): DataRow[] {
    return this.data.filter((row) =>
      Object.entries(this.config.filters).every(([dimension, selectedValues]) =>
        selectedValues.length === 0
          ? true
          : selectedValues.includes(String(row[dimension]))
      )
    );
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

        [...headerGroups.values()]
          .sort((a, b) => {
            for (let i = 0; i <= depth; i++) {
              const comp = String(a[i]).localeCompare(String(b[i]));
              if (comp !== 0) return comp;
            }
            return 0;
          })
          .forEach((path) => {
            headers.push({
              content: path[depth],
              path: path.slice(0, depth + 1),
              colSpan: this.getColSpan(path.slice(0, depth + 1), combinations)
            });
          });

        if (config.showColumnTotal && depth === 0) {
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

  private getColSpan(path: string[], combinations: string[][]): number {
    if (path.length === combinations[0].length) return 1;
    return combinations.filter(combo =>
      path.every((value, i) => combo[i] === value)
    ).length;
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

      if (config.showColumnTotal) {
        const total = matchingRows.reduce(
          (sum, row) => sum + (parseFloat(String(row[config.valueDimension])) || 0),
          0
        );

        values.push({
          content: formatValue(total, config.formatType),
          isNumber: true,
          isTotal: true
        });
      }
    });

    return values;
  }

  public calculateGrandTotalValues(tableConfig: TableConfig): any[] {
    const values: any[] = [];
    const filteredData = this.filterData();

    if (!tableConfig.colDimensions.length || !tableConfig.valueDimension) {
      return values;
    }

    const combinations = this.getColumnCombinations(tableConfig);
    
    combinations.forEach((combo) => {
      const matchingRows = filteredData.filter(row =>
        combo.every((value, index) =>
          String(row[tableConfig.colDimensions[index]]) === value
        )
      );

      const total = matchingRows.reduce(
        (sum, row) => sum + (parseFloat(String(row[tableConfig.valueDimension])) || 0),
        0
      );

      values.push({
        content: formatValue(total, tableConfig.formatType),
        isNumber: true,
        isTotal: true
      });
    });

    if (tableConfig.showColumnTotal) {
      const grandTotal = filteredData.reduce(
        (sum, row) => sum + (parseFloat(String(row[tableConfig.valueDimension])) || 0),
        0
      );

      values.push({
        content: formatValue(grandTotal, tableConfig.formatType),
        isNumber: true,
        isTotal: true
      });
    }

    return values;
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
}