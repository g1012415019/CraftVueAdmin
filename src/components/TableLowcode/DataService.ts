import { DataSourceConfig } from './types/DataSourceConfig';
import axios from 'axios';

export class DataService {
  async fetchData(config: DataSourceConfig, params: Record<string, any>): Promise<any> {
    const { api, method, requestMap, responseMap } = config;

    if (!api) {
      console.warn('API URL is not provided in DataSourceConfig.');
      return { list: [], total: 0 };
    }

    let requestData = params;
    // Apply requestMap if provided (simple dot-notation mapping)
    if (requestMap) {
      try {
        // Assuming requestMap is a simple JSON string for mapping
        const map = JSON.parse(requestMap);
        requestData = {};
        for (const key in map) {
          if (Object.prototype.hasOwnProperty.call(map, key)) {
            // Simple mapping: map[key] is the source path in params
            const sourcePath = map[key].split('.');
            let value = params;
            for (const pathPart of sourcePath) {
              if (value && typeof value === 'object' && pathPart in value) {
                value = value[pathPart];
              } else {
                value = undefined;
                break;
              }
            }
            requestData[key] = value;
          }
        }
      } catch (e) {
        console.error('Error parsing requestMap:', e);
        // Fallback to original params if mapping fails
        requestData = params;
      }
    }

    try {
      const response = await axios({
        url: api,
        method: method || 'GET',
        [method === 'GET' ? 'params' : 'data']: requestData,
      });

      let responseData = response.data;
      // Apply responseMap if provided (simple dot-notation mapping)
      if (responseMap) {
        try {
          // Assuming responseMap is a simple JSON string for mapping
          const map = JSON.parse(responseMap);
          const mappedData: any = {};
          for (const key in map) {
            if (Object.prototype.hasOwnProperty.call(map, key)) {
              // Simple mapping: map[key] is the source path in responseData
              const sourcePath = map[key].split('.');
              let value = responseData;
              for (const pathPart of sourcePath) {
                if (value && typeof value === 'object' && pathPart in value) {
                  value = value[pathPart];
                } else {
                  value = undefined;
                  break;
                }
              }
              mappedData[key] = value;
            }
          }
          responseData = mappedData;
        } catch (e) {
          console.error('Error parsing responseMap:', e);
          // Fallback to original responseData if mapping fails
        }
      }

      return responseData;
    } catch (error) {
      console.error('API call failed:', error);
      throw error; // Re-throw to be caught by useTableData
    }
  }

  transformStaticData(data: any[]): any[] {
    console.log('Transforming static data:', data);
    // Placeholder for static data transformation logic
    return data;
  }

  runFunction(funcName: string, args: any[]): any {
    console.log('Running function:', funcName, 'with args:', args);
    // Placeholder for custom function execution logic
    return null;
  }
}
