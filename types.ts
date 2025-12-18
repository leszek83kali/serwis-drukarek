
export enum RepairStatus {
  PENDING = 'Oczekujące',
  DIAGNOSING = 'Diagnozowanie',
  REPAIRING = 'W trakcie naprawy',
  READY = 'Gotowe do odbioru',
  COMPLETED = 'Zakończone',
  CANCELLED = 'Anulowane'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
}

export interface RepairRequest {
  id: string;
  clientId: string;
  clientName?: string;
  printerModel: string;
  serialNumber: string;
  description: string;
  status: RepairStatus;
  createdAt: string;
  updatedAt: string;
  estimatedCost?: number;
  comments?: string[];
  aiSuggestion?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
