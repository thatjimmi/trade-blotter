import { PivotWorkerService } from '../services/PivotWorkerService';

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
  private workerService: PivotWorkerService;
  private isInitialized: boolean = false;

  constructor(data: DataRow[], config: PivotTableConfig) {
    this.data = data;
    this.config = config;
    this.dimensions = Object.keys(data[0] || {});
    this.workerService = new PivotWorkerService();
  }

  private async initializeWorker() {
    if (this.isInitialized) return;
    
    try {
      console.log('Initializing PivotTable worker...');
      await this.workerService.initialize();
      console.log('Loading data into worker...');
      await this.workerService.loadData(this.data);
      console.log('Worker initialization complete');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize worker:', error);
      throw error;
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initializeWorker();
    }
  }

  public async filterData(): Promise<DataRow[]> {
    await this.ensureInitialized();
    return this.workerService.queryData(this.config.filters, this.dimensions);
  }

  private async getColumnCombinations(config: TableConfig): Promise<string[][]> {
    await this.ensureInitialized();
    if (!config.colDimensions.length) return [];

    const filteredData = await this.filterData();
    const combinations: string[][] = [];

    const firstDimValues = [...new Set(
      filteredData
        .map((row) => String(row[config.colDimensions[0]]))
        .filter(Boolean)
    )].sort();

    const buildCombinations = async (currentCombo: string[], depth: number) => {
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
        await buildCombinations([...currentCombo, value], depth + 1);
      }
    };

    for (const value of firstDimValues) {
      await buildCombinations([value], 1);
    }

    return combinations;
  }

  public async getHeaders(): Promise<any[][]> {
    await this.ensureInitialized();
    const filteredData = await this.filterData();
    const activeConfigs = this.config.tableConfigs.filter(
      (config) => config.colDimensions.length && config.valueDimension
    );

    if (activeConfigs.length === 0) return [];

    const maxColDimensions = Math.max(
      ...activeConfigs.map((config) => config.colDimensions.length)
    );

    const headerRows = await Promise.all(Array(maxColDimensions).fill(0).map(async (_, depth) => {
      const headers = [];
      
      if (depth === 0) {
        headers.push({
          content: this.config.rowDimensions[0],
          rowSpan: maxColDimensions,
          isRowHeader: true
        });
      }

      for (const config of activeConfigs) {
        if (depth >= config.colDimensions.length) continue;

        const combinations = await this.getColumnCombinations(config);
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
      }

      return headers;
    }));

    return headerRows;
  }

  public async calculateRowValues(rowPath: string[]): Promise<any[]> {
    await this.ensureInitialized();
    const values: any[] = [];

    for (const config of this.config.tableConfigs) {
      if (!config.colDimensions.length || !config.valueDimension) continue;

      const calculatedValues = await this.workerService.calculateValues(
        rowPath,
        this.config.rowDimensions,
        config
      );

      const combinations = await this.getColumnCombinations(config);
      combinations.forEach((combo) => {
        const matchingValue = calculatedValues.find(v => 
          v.dimensions.every((dim, i) => dim === combo[i])
        );

        values.push({
          content: formatValue(matchingValue?.value || 0, config.formatType),
          isNumber: true
        });
      });

      if (config.showColumnTotal) {
        const total = calculatedValues.reduce((sum, v) => sum + (v.value || 0), 0);
        values.push({
          content: formatValue(total, config.formatType),
          isNumber: true,
          isTotal: true
        });
      }
    }

    return values;
  }

  public async calculateGrandTotalValues(tableConfig: TableConfig): Promise<any[]> {
    await this.ensureInitialized();
    const values: any[] = [];

    if (!tableConfig.colDimensions.length || !tableConfig.valueDimension) {
      return values;
    }

    const calculatedValues = await this.workerService.calculateValues(
      [],
      this.config.rowDimensions,
      tableConfig
    );

    const combinations = await this.getColumnCombinations(tableConfig);
    combinations.forEach((combo) => {
      const matchingValue = calculatedValues.find(v => 
        v.dimensions.every((dim, i) => dim === combo[i])
      );

      values.push({
        content: formatValue(matchingValue?.value || 0, tableConfig.formatType),
        isNumber: true,
        isTotal: true
      });
    });

    if (tableConfig.showColumnTotal) {
      const grandTotal = calculatedValues.reduce((sum, v) => sum + (v.value || 0), 0);
      values.push({
        content: formatValue(grandTotal, tableConfig.formatType),
        isNumber: true,
        isTotal: true
      });
    }

    return values;
  }

  public async getNumericDimensions(): Promise<string[]> {
    await this.ensureInitialized();
    const filteredData = await this.filterData();
    return this.dimensions.filter(
      (dim) =>
        !isNaN(parseFloat(String(filteredData[0]?.[dim]))) &&
        isFinite(Number(filteredData[0]?.[dim]))
    );
  }

  public async getDimensionValues(dimension: string): Promise<string[]> {
    await this.ensureInitialized();
    return this.workerService.getDimensionValues(dimension);
  }

  // Helper method to calculate column span for headers
  private getColSpan(path: string[], combinations: string[][]): number {
    return combinations.filter(combo =>
      path.every((value, index) => combo[index] === value)
    ).length;
  }

  public async getHierarchicalRows(): Promise<any[]> {
    await this.ensureInitialized();
    const filteredData = await this.filterData();
    const { rowDimensions } = this.config;

    const buildRowHierarchy = async (path: string[] = [], depth: number = 0): Promise<any[] | null> => {
      if (depth >= rowDimensions.length) return null;

      const currentDimension = rowDimensions[depth];
      const matchingRows = filteredData.filter((row) =>
        path.every((value, i) => String(row[rowDimensions[i]]) === value)
      );

      const dimensionValues = [...new Set(
        matchingRows.map((row) => String(row[currentDimension]))
      )].sort();

      const rows = await Promise.all(
        dimensionValues.map(async (value) => {
          const newPath = [...path, value];
          const children = await buildRowHierarchy(newPath, depth + 1);
          const rowValues = await this.calculateRowValues(newPath);
          const rowId = `row-${newPath.join("-")}`;

          return {
            id: rowId,
            content: value,
            path: newPath,
            depth,
            children: children || undefined,
            values: rowValues,
            isExpanded: false
          };
        })
      );

      return rows;
    };

    const result = await buildRowHierarchy();
    return result || [];
  }
}