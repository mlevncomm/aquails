export interface ServiceSlot {
  id: string;
  date: string;
  time: string;
  label: string;
  available: boolean;
  customerName?: string;
  serviceType?: string;
  address?: string;
  status?: 'available' | 'booked' | 'completed';
}

const TIME_SLOTS = ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00'];

export function generateSlots(daysAhead = 14): ServiceSlot[] {
  const saved = localStorage.getItem('service-slots');
  if (saved) return JSON.parse(saved);

  const slots: ServiceSlot[] = [];
  const today = new Date();
  for (let d = 0; d < daysAhead; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    TIME_SLOTS.forEach((time, i) => {
      slots.push({
        id: `${dateStr}-${i}`,
        date: dateStr,
        time,
        label: time,
        available: Math.random() > 0.3,
        status: Math.random() > 0.3 ? 'available' : 'booked',
      });
    });
  }
  localStorage.setItem('service-slots', JSON.stringify(slots));
  return slots;
}

export function bookSlot(slotId: string, customerName: string, serviceType: string, address: string): boolean {
  const slots = generateSlots();
  const slot = slots.find(s => s.id === slotId);
  if (!slot || !slot.available) return false;
  slot.available = false;
  slot.status = 'booked';
  slot.customerName = customerName;
  slot.serviceType = serviceType;
  slot.address = address;
  localStorage.setItem('service-slots', JSON.stringify(slots));
  return true;
}

export function getSlotsForDate(date: string): ServiceSlot[] {
  return generateSlots().filter(s => s.date === date);
}

export function getTodaySlots(): ServiceSlot[] {
  const today = new Date().toISOString().split('T')[0];
  return generateSlots().filter(s => s.date === today);
}

export function getWeekSlots(): ServiceSlot[] {
  const today = new Date();
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    weekDates.push(d.toISOString().split('T')[0]);
  }
  return generateSlots().filter(s => weekDates.includes(s.date));
}

export function completeSlot(slotId: string): void {
  const slots = generateSlots();
  const slot = slots.find(s => s.id === slotId);
  if (slot) slot.status = 'completed';
  localStorage.setItem('service-slots', JSON.stringify(slots));
}
