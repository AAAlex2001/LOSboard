export interface ViewAdvertisementState {
  is_viewed: boolean;
  views_count: number;
  error: string | null;
}

export type ViewAdvertisementAction =
  | {
      type: "VIEW_REGISTERED";
      payload: { is_viewed: boolean; views_count: number };
    }
  | { type: "FAILURE"; payload: string };
