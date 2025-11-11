// interfaces/IUserCreate.ts
export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  weight?: number | null;
  height?: number | null;
  gender?: string | null;
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean;
  lactose_intolerant?: boolean;
  high_cholesterol?: boolean;
  diabetes?: boolean;
  hypertension?: boolean;
  allergies?: string | null;
}
