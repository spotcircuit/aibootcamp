declare module 'connect-pg-simple' {
  import { SessionStore } from 'express-session';
  
  function connectPgSimple(session: any): new (options?: any) => SessionStore;
  
  export = connectPgSimple;
}