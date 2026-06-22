export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  lastPage: number;
}
