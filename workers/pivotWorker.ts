import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';

let db: any = null;
let SQL: any = null;

// Initialize the database
async function initDB() {
  try {
    console.log('Starting database initialization...');
    
    // Initialize SQL.js with proper WASM loading
    SQL = await initSqlJs({
      locateFile: (filename: string) => {
        console.log('Locating file:', filename);
        // Use a more reliable way to get the base URL
        const wasmPath = `/static/wasm/${filename}`;
        console.log('WASM path:', wasmPath);
        return wasmPath;
      }
    });

    console.log('SQL.js initialized successfully');

    // Check for SharedArrayBuffer support
    if (typeof SharedArrayBuffer === 'undefined') {
      throw new Error('SharedArrayBuffer is required for absurd-sql');
    }

    // Create a new database instance
    try {
      console.log('Creating new database instance...');
      db = new SQL.Database();
      console.log('Database instance created successfully');
    } catch (dbError) {
      console.error('Failed to create database:', dbError);
      throw new Error(`Database creation failed: ${dbError.message}`);
    }

    // Initialize IndexedDB backend
    try {
      console.log('Initializing IndexedDB backend...');
      const backend = new IndexedDBBackend();
      const sqlFS = new SQLiteFS(SQL.FS, backend);
      SQL.register_for_idb(sqlFS);
      console.log('IndexedDB backend initialized successfully');
    } catch (fsError) {
      console.error('Failed to initialize filesystem:', fsError);
      throw new Error(`Filesystem initialization failed: ${fsError.message}`);
    }

    // Create tables for pivot data
    try {
      console.log('Creating tables...');
      db.exec(`
        CREATE TABLE IF NOT EXISTS pivot_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          row_data TEXT
        );
        
        CREATE INDEX IF NOT EXISTS idx_pivot_data ON pivot_data(id);
      `);
      console.log('Tables created successfully');
    } catch (tableError) {
      console.error('Failed to create tables:', tableError);
      throw new Error(`Table creation failed: ${tableError.message}`);
    }

    // Verify database connection
    try {
      console.log('Verifying database connection...');
      const testQuery = db.exec('SELECT 1');
      if (!testQuery || !testQuery.length) {
        throw new Error('Database verification failed');
      }
      console.log('Database verification successful');
    } catch (verifyError) {
      console.error('Failed to verify database:', verifyError);
      throw new Error(`Database verification failed: ${verifyError.message}`);
    }

    console.log('Database initialization completed successfully');
    self.postMessage({ type: 'init_complete' });
  } catch (error) {
    console.error('Database initialization error:', error);
    self.postMessage({ 
      type: 'error', 
      error: `Database initialization failed: ${(error as Error).message}` 
    });
    throw error;
  }
}

// Type definitions for the worker messages
interface WorkerMessage {
  type: string;
  payload?: any;
}

interface FilterPayload {
  filters: Record<string, string[]>;
  dimensions: string[];
}

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, payload } = e.data;

  try {
    switch (type) {
      case 'init':
        await initDB();
        break;

      case 'load_data':
        if (!db) {
          throw new Error('Database not initialized');
        }
        // Clear existing data
        db.exec('DELETE FROM pivot_data');
        
        // Insert new data in batches
        const batchSize = 1000;
        const data = payload.data as Record<string, any>[];

        // Process data before insertion to ensure numeric values are properly formatted
        const processedData = data.map(row => {
          const processed = { ...row };
          Object.entries(row).forEach(([key, value]) => {
            if (typeof value === 'number') {
              processed[key] = value;
            } else if (typeof value === 'string' && value.trim().startsWith('$')) {
              // Handle currency strings
              const numericValue = parseFloat(value.replace(/[$,]/g, ''));
              processed[key] = isNaN(numericValue) ? 0 : numericValue;
            } else if (typeof value === 'string' && !isNaN(Number(value.replace(/,/g, '')))) {
              // Handle numeric strings
              const numericValue = parseFloat(value.replace(/,/g, ''));
              processed[key] = isNaN(numericValue) ? 0 : numericValue;
            }
          });
          return processed;
        });

        console.log('Sample processed row:', processedData[0]);

        for (let i = 0; i < processedData.length; i += batchSize) {
          const batch = processedData.slice(i, i + batchSize);
          const stmt = db.prepare('INSERT INTO pivot_data (row_data) VALUES (?)');
          
          batch.forEach(row => {
            stmt.run([JSON.stringify(row)]);
          });
          
          stmt.free();
        }
        
        self.postMessage({ type: 'load_complete' });
        break;

      case 'query_data':
        if (!db) {
          throw new Error('Database not initialized');
        }
        const { filters, dimensions } = payload as FilterPayload;
        let whereClause = '';
        
        if (filters && Object.keys(filters).length > 0) {
          const conditions = Object.entries(filters).map(([dim, values]) => {
            if (!values || values.length === 0) return null;
            const jsonPath = `$.${dim}`;
            return `json_extract(row_data, '${jsonPath}') IN (${values.map(v => `'${v}'`).join(',')})`;
          }).filter(Boolean);
          
          if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' AND ')}`;
          }
        }

        const query = `
          SELECT row_data
          FROM pivot_data
          ${whereClause}
          LIMIT 10000
        `;

        const results = db.exec(query);
        const rows = results[0]?.values?.map(row => JSON.parse(row[0])) || [];
        
        self.postMessage({ type: 'query_complete', data: rows });
        break;

      case 'get_dimension_values':
        try {
          const { dimension } = payload;
          const query = `
            SELECT DISTINCT json_extract(row_data, '$.${dimension}') as value
            FROM pivot_data
            WHERE json_extract(row_data, '$.${dimension}') IS NOT NULL
            ORDER BY value
          `;
          
          const results = db.exec(query);
          const values = results[0]?.values?.map(row => row[0]) || [];
          
          self.postMessage({ 
            type: 'dimension_values_complete', 
            dimension,
            values 
          });
        } catch (error) {
          self.postMessage({ type: 'error', error: (error as Error).message });
        }
        break;

      case 'calculate_values':
        try {
          const { rowPath, rowDimensions, tableConfig } = payload;
          
          // Build the row path conditions
          let whereClause = rowPath.map((value: string, index: number) => 
            `json_extract(row_data, '$.${rowDimensions[index]}') = '${value}'`
          ).join(' AND ');

          // Add column dimension conditions
          if (tableConfig.colDimensions.length > 0) {
            const colDimConditions = tableConfig.colDimensions.map((dim: string) => 
              `json_extract(row_data, '$.${dim}') IS NOT NULL`
            ).join(' AND ');
            whereClause = whereClause ? `${whereClause} AND ${colDimConditions}` : colDimConditions;
          }

          // Add value dimension condition
          if (whereClause) {
            whereClause += ` AND json_extract(row_data, '$.${tableConfig.valueDimension}') IS NOT NULL`;
          } else {
            whereClause = `WHERE json_extract(row_data, '$.${tableConfig.valueDimension}') IS NOT NULL`;
          }

          const query = `
            WITH parsed_data AS (
              SELECT DISTINCT
                ${tableConfig.colDimensions.map((dim: string) => 
                  `json_extract(row_data, '$.${dim}') as ${dim}`
                ).join(', ')},
                CAST(
                  CASE 
                    WHEN json_type(row_data, '$.${tableConfig.valueDimension}') = 'text' 
                      AND json_extract(row_data, '$.${tableConfig.valueDimension}') LIKE '$%'
                    THEN REPLACE(REPLACE(json_extract(row_data, '$.${tableConfig.valueDimension}'), '$', ''), ',', '')
                    WHEN json_type(row_data, '$.${tableConfig.valueDimension}') = 'text'
                    THEN REPLACE(json_extract(row_data, '$.${tableConfig.valueDimension}'), ',', '')
                    ELSE json_extract(row_data, '$.${tableConfig.valueDimension}')
                  END AS DECIMAL(20, 2)
                ) as numeric_value
              FROM pivot_data
              ${whereClause ? `WHERE ${whereClause}` : ''}
            )
            SELECT 
              ${tableConfig.colDimensions.map((dim: string) => dim).join(', ')}
              ${tableConfig.colDimensions.length ? ',' : ''}
              SUM(numeric_value) as value
            FROM parsed_data
            ${tableConfig.colDimensions.length ? 
              `GROUP BY ${tableConfig.colDimensions.map((dim: string) => dim).join(', ')}` : 
              ''
            }
          `;

          console.log('Executing query:', query);

          const results = db.exec(query);
          console.log('Query results:', results);

          const values = results[0]?.values?.map(row => {
            const value = parseFloat(row[row.length - 1]);
            console.log('Parsed value:', value);
            return {
              dimensions: row.slice(0, -1),
              value: isNaN(value) ? 0 : value
            };
          }) || [];

          console.log('Processed values:', values);

          self.postMessage({ 
            type: 'calculate_values_complete',
            values
          });
        } catch (error) {
          console.error('Error in calculate_values:', error);
          self.postMessage({ type: 'error', error: (error as Error).message });
        }
        break;
    }
  } catch (error) {
    console.error(`Error in worker (${type}):`, error);
    self.postMessage({ 
      type: 'error', 
      error: (error as Error).message 
    });
  }
}; 