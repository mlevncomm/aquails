export interface FilterCalcInput {
  deviceModel: string;
  lastChangeDate: string;
  peopleCount: string;
  usageIntensity: string;
  hasTasteIssue: boolean;
  createReminder: boolean;
}

export interface FilterCalcResult {
  nextChangeDate: Date;
  daysRemaining: number;
  status: 'healthy' | 'approaching' | 'overdue';
  statusLabel: string;
  statusColor: string;
  recommendedFilters: string[];
}

const FILTER_LIFE_DAYS: Record<string, number> = {
  'low': 220,
  'medium': 180,
  'high': 140,
};

export function calculateFilterChange(input: FilterCalcInput): FilterCalcResult {
  const intensityMultiplier: Record<string, number> = {
    'low': 1.3,
    'medium': 1.0,
    'high': 0.7,
  };

  const peopleMultiplier: Record<string, number> = {
    '1-2': 1.2,
    '3-4': 1.0,
    '5+': 0.7,
  };

  const baseLife = FILTER_LIFE_DAYS[input.usageIntensity] || 180;
  const lifeDays = Math.round(baseLife * (intensityMultiplier[input.usageIntensity] || 1) * (peopleMultiplier[input.peopleCount] || 1));

  const lastDate = new Date(input.lastChangeDate);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + lifeDays);

  const today = new Date();
  const diffTime = nextDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status: FilterCalcResult['status'];
  let statusLabel: string;
  let statusColor: string;

  if (daysRemaining < 0) {
    status = 'overdue';
    statusLabel = 'Filtre değişimi zamanı gelmiş!';
    statusColor = '#E85454';
  } else if (daysRemaining <= 30) {
    status = 'approaching';
    statusLabel = 'Filtre değişimi yaklaşıyor';
    statusColor = '#F59E0B';
  } else {
    status = 'healthy';
    statusLabel = 'Filtreniz sağlıklı aralıkta';
    statusColor = '#1286D8';
  }

  if (input.hasTasteIssue && status === 'healthy') {
    status = 'approaching';
    statusLabel = 'Su kalitesi şikayeti var, erken değişim önerilir';
    statusColor = '#F59E0B';
  }

  const recommendedFilters = ['Sediment Filtre', 'Aktif Karbon Filtre', 'Post Karbon Filtre'];
  if (input.deviceModel.includes('RO')) recommendedFilters.push('RO Membran');

  return { nextChangeDate: nextDate, daysRemaining, status, statusLabel, statusColor, recommendedFilters };
}

export function saveFilterReminder(input: FilterCalcInput & { email?: string; phone?: string }): void {
  const reminders = JSON.parse(localStorage.getItem('filter-reminders') || '[]');
  reminders.push({ ...input, id: Date.now().toString(), createdAt: new Date().toISOString() });
  localStorage.setItem('filter-reminders', JSON.stringify(reminders));
}

export function getFilterReminders(): Array<FilterCalcInput & { id: string; createdAt: string }> {
  return JSON.parse(localStorage.getItem('filter-reminders') || '[]');
}
