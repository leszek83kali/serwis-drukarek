
import { RepairStatus, RepairRequest, User } from './types';

export const mockUser: User = {
  id: 'u1',
  email: 'jan.kowalski@example.pl',
  name: 'Jan Kowalski',
  role: 'client'
};

export const adminUser: User = {
  id: 'admin',
  email: 'admin',
  name: 'Administrator Systemu',
  role: 'admin'
};

export const mockRepairs: RepairRequest[] = [
  {
    id: 'REP-001',
    clientId: 'u1',
    clientName: 'Jan Kowalski',
    printerModel: 'HP LaserJet Pro M404dw',
    serialNumber: 'CNB1J2K3L4',
    description: 'Zacina papier w dolnym podajniku przy drukowaniu dwustronnym.',
    status: RepairStatus.REPAIRING,
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-05-12T14:30:00Z',
    estimatedCost: 150,
    comments: ['Zamówiono rolki pobierające.', 'Oczekiwanie na części.']
  },
  {
    id: 'REP-002',
    clientId: 'u1',
    clientName: 'Jan Kowalski',
    printerModel: 'Epson EcoTank L3250',
    serialNumber: 'X7Y8Z9W0V1',
    description: 'Białe pasy na wydrukach, czyszczenie głowicy z menu nie pomaga.',
    status: RepairStatus.READY,
    createdAt: '2024-05-15T09:15:00Z',
    updatedAt: '2024-05-16T11:00:00Z',
    estimatedCost: 80,
    comments: ['Wykonano płukanie głowicy pod ciśnieniem.', 'Testy drożności wypadły pomyślnie.']
  }
];
