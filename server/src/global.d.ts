declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRATION: string;
      JWT_COOKIES_EXPIRES_IN: string
      JWT_TOKEN_EXPIRES_IN: string
      CLIENT_ROOT_URL:string;
      FIREBASE_PRIVATE_KEY: string
      FIREBASE_SERVER_UID: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};