declare module "finnhub" {
    export const ApiClient: any;
    export class DefaultApi {
      quote(
        symbol: string,
        callback: (error: any, data: any, response: any) => void
      ): void;
    }
  }
  
  