export const DEFAULT_TIMEFRAME: number = 30; //- The default timeframe for best selling products query.
export const APP_PORT: number = 500;
export const APP_ADDR: string = '127.0.0.1';

/* If true, change username and password to the corresponding values */
const MONGO_REQUIRES_AUTH: boolean = false;
const MONGO_USERNAME: string = '';
const MONGO_PASSWORD: string = '';
export const DEFAULT_MONGO_URL: string = (MONGO_REQUIRES_AUTH)
    ? `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:27017`
    : "mongodb://localhost:27017";
