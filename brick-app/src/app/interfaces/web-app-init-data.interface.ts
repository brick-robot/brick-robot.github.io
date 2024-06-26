export interface WebAppInitData {
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  };
  query_id?: string;
  auth_date?: number;
  hash?: string;
}
