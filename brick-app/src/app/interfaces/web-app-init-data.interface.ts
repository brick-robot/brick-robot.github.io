export interface WebAppInitData {
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  };
  query_id?: string;
  auth_date?: number;
  hash?: string;
}
