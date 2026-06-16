export interface Source {
  id: number;
  title: string;
  url: string;
  project: string;
  createdAt: string;
  tags?: string[];
  notes?: string;
}