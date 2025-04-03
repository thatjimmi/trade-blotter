import { DataRow, TableConfig } from '../components/PivotTable';

export class PivotWorkerService {
  private worker: Worker;
  private messageHandlers: Map<string, ((data: any) => void)[]>;
  private isInitialized: boolean = false;

  constructor() {
    this.worker = new Worker(new URL('../workers/pivotWorker.ts', import.meta.url), {
      type: 'module',
      /* @ts-ignore */
      name: 'pivot-worker'
    });
    this.messageHandlers = new Map();

    this.worker.onmessage = (e) => {
      const { type, ...data } = e.data;
      const handlers = this.messageHandlers.get(type) || [];
      handlers.forEach(handler => handler(data));
    };

    this.worker.onerror = (error) => {
      console.error('Worker error:', error);
      this.messageHandlers.get('error')?.forEach(handler => 
        handler({ error: `Worker error: ${error.message}` })
      );
    };
  }

  private addMessageHandler(type: string, handler: (data: any) => void) {
    const handlers = this.messageHandlers.get(type) || [];
    handlers.push(handler);
    this.messageHandlers.set(type, handlers);
  }

  private removeMessageHandler(type: string, handler: (data: any) => void) {
    const handlers = this.messageHandlers.get(type) || [];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
      this.messageHandlers.set(type, handlers);
    }
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    return new Promise((resolve, reject) => {
      let initTimeout: NodeJS.Timeout;

      const handleInit = () => {
        clearTimeout(initTimeout);
        this.removeMessageHandler('init_complete', handleInit);
        this.removeMessageHandler('error', handleError);
        this.isInitialized = true;
        resolve();
      };

      const handleError = (data: any) => {
        clearTimeout(initTimeout);
        this.removeMessageHandler('init_complete', handleInit);
        this.removeMessageHandler('error', handleError);
        reject(new Error(data.error));
      };

      // Set a timeout for initialization
      initTimeout = setTimeout(() => {
        this.removeMessageHandler('init_complete', handleInit);
        this.removeMessageHandler('error', handleError);
        reject(new Error('Database initialization timed out'));
      }, 10000); // 10 second timeout

      this.addMessageHandler('init_complete', handleInit);
      this.addMessageHandler('error', handleError);

      try {
        this.worker.postMessage({ type: 'init' });
      } catch (error) {
        clearTimeout(initTimeout);
        reject(new Error(`Failed to send init message: ${error.message}`));
      }
    });
  }

  public async loadData(data: DataRow[]): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Worker not initialized');
    }

    return new Promise((resolve, reject) => {
      const handleLoad = () => {
        this.removeMessageHandler('load_complete', handleLoad);
        this.removeMessageHandler('error', handleError);
        resolve();
      };

      const handleError = (data: any) => {
        this.removeMessageHandler('load_complete', handleLoad);
        this.removeMessageHandler('error', handleError);
        reject(new Error(data.error));
      };

      this.addMessageHandler('load_complete', handleLoad);
      this.addMessageHandler('error', handleError);

      try {
        this.worker.postMessage({ 
          type: 'load_data',
          payload: { data }
        });
      } catch (error) {
        reject(new Error(`Failed to send load_data message: ${error.message}`));
      }
    });
  }

  public async queryData(filters: Record<string, string[]>, dimensions: string[]): Promise<DataRow[]> {
    return new Promise((resolve, reject) => {
      const handleQuery = (data: any) => {
        this.removeMessageHandler('query_complete', handleQuery);
        this.removeMessageHandler('error', handleError);
        resolve(data.data);
      };

      const handleError = (data: any) => {
        this.removeMessageHandler('query_complete', handleQuery);
        this.removeMessageHandler('error', handleError);
        reject(new Error(data.error));
      };

      this.addMessageHandler('query_complete', handleQuery);
      this.addMessageHandler('error', handleError);

      this.worker.postMessage({
        type: 'query_data',
        payload: { filters, dimensions }
      });
    });
  }

  public async getDimensionValues(dimension: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const handleValues = (data: any) => {
        this.removeMessageHandler('dimension_values_complete', handleValues);
        this.removeMessageHandler('error', handleError);
        resolve(data.values);
      };

      const handleError = (data: any) => {
        this.removeMessageHandler('dimension_values_complete', handleValues);
        this.removeMessageHandler('error', handleError);
        reject(new Error(data.error));
      };

      this.addMessageHandler('dimension_values_complete', handleValues);
      this.addMessageHandler('error', handleError);

      this.worker.postMessage({
        type: 'get_dimension_values',
        payload: { dimension }
      });
    });
  }

  public async calculateValues(
    rowPath: string[], 
    rowDimensions: string[], 
    tableConfig: TableConfig
  ): Promise<Array<{ dimensions: string[], value: number }>> {
    return new Promise((resolve, reject) => {
      const handleValues = (data: any) => {
        this.removeMessageHandler('calculate_values_complete', handleValues);
        this.removeMessageHandler('error', handleError);
        resolve(data.values);
      };

      const handleError = (data: any) => {
        this.removeMessageHandler('calculate_values_complete', handleValues);
        this.removeMessageHandler('error', handleError);
        reject(new Error(data.error));
      };

      this.addMessageHandler('calculate_values_complete', handleValues);
      this.addMessageHandler('error', handleError);

      this.worker.postMessage({
        type: 'calculate_values',
        payload: { rowPath, rowDimensions, tableConfig }
      });
    });
  }
} 