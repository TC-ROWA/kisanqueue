
const delay = (ms = 450) => new Promise((res) => setTimeout(res, ms));

export const DEMO_FARMER = {
  id: 'f-001',
  name: 'Rajesh Kumar',
  mobile: '9876543210',
  village: 'Bichpuri',
  district: 'Agra',
  state: 'Uttar Pradesh',
  language: 'en',
  farmerId: 'UP-AGR-00931'
};

export const CENTRES = [
  {
    id: 'c-001',
    name: 'Shakti Agro Procurement Centre',
    village: 'Bichpuri',
    district: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.1591,
    lng: 77.9436,
    status: 'OPEN',
    dailyCapacity: 220,
    processedToday: 180,
    queueLength: 42,
    avgProcessingPerHour: 8,
    currentToken: 'KQ-267',
    nextSlot: '01:00 PM – 02:00 PM',
    openingTime: '08:00 AM',
    closingTime: '06:00 PM'
  },
  {
    id: 'c-002',
    name: 'Kisan Seva Procurement Centre',
    village: 'Etmadpur',
    district: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.1975,
    lng: 78.1145,
    status: 'HIGH_RUSH',
    dailyCapacity: 180,
    processedToday: 128,
    queueLength: 52,
    avgProcessingPerHour: 6,
    currentToken: 'KQ-140',
    nextSlot: '02:00 PM – 03:00 PM',
    openingTime: '08:00 AM',
    closingTime: '06:00 PM'
  },
  {
    id: 'c-003',
    name: 'GreenField Procurement Centre',
    village: 'Fatehabad',
    district: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.0704,
    lng: 78.2245,
    status: 'LIMITED_CAPACITY',
    dailyCapacity: 150,
    processedToday: 140,
    queueLength: 18,
    avgProcessingPerHour: 5,
    currentToken: 'KQ-088',
    nextSlot: '11:00 AM – 12:00 PM (tomorrow)',
    openingTime: '08:00 AM',
    closingTime: '05:00 PM'
  }
];

export const SLOTS = [
  { time: '09:00 AM – 10:00 AM', remaining: 0 },
  { time: '10:00 AM – 11:00 AM', remaining: 4 },
  { time: '11:00 AM – 12:00 PM', remaining: 12 },
  { time: '12:00 PM – 01:00 PM', remaining: 9 },
  { time: '01:00 PM – 02:00 PM', remaining: 21 },
  { time: '02:00 PM – 03:00 PM', remaining: 15 }
];

export const CURRENT_BOOKING = {
  id: 'b-284',
  token: 'KQ-284',
  crop: 'Wheat',
  quantity: '42.5 Quintals',
  centreId: 'c-001',
  centreName: 'Shakti Agro Procurement Centre',
  date: '24 August 2026',
  slot: '11:30 AM',
  status: 'CONFIRMED',
  queuePosition: 17,
  farmersAhead: 17,
  estimatedWaitMinutes: 80,
  recommendedArrival: '11:25 AM – 11:40 AM'
};

export const QUEUE_TOKENS = Array.from({ length: 20 }).map((_, i) => {
  const num = 268 + i;
  return { token: `KQ-${num}`, status: num < 284 ? 'ahead' : num === 284 ? 'you' : 'behind' };
});

export const QUEUE_STATUS_STEPS = [
  { key: 'BOOKED', label: 'Booked' },
  { key: 'ARRIVED', label: 'Arrived' },
  { key: 'WAITING', label: 'Waiting' },
  { key: 'CALLED', label: 'Called' },
  { key: 'QUALITY_CHECK', label: 'Quality Check' },
  { key: 'WEIGHING', label: 'Weighing' },
  { key: 'PROCUREMENT', label: 'Procurement' },
  { key: 'PAYMENT', label: 'Payment' }
];

export const PROCUREMENT_TIMELINE = {
  currentStep: 'WAITING',
  steps: [
    { key: 'REGISTERED', label: 'Registration', time: '02 Jan 2026, 9:14 AM', done: true },
    { key: 'BOOKED', label: 'Slot booked', time: '24 Aug 2026, 7:02 AM', done: true },
    { key: 'ARRIVED', label: 'Arrived', time: '24 Aug 2026, 10:58 AM', done: true },
    { key: 'QUALITY_CHECK', label: 'Quality check', time: null, done: false },
    { key: 'WEIGHING', label: 'Weighed', time: null, done: false },
    { key: 'PROCUREMENT', label: 'Procurement completed', time: null, done: false },
    { key: 'PAYMENT_PROCESSING', label: 'Payment processing', time: null, done: false },
    { key: 'PAYMENT_RECEIVED', label: 'Payment received', time: null, done: false }
  ]
};

export const QUALITY_CHECK = {
  moisture: '12.4%',
  foreignMatter: '0.8%',
  grade: 'A',
  status: 'APPROVED',
  remarks: 'Clean, well-dried produce. Within accepted limits.'
};

export const WEIGHMENT = {
  declaredQuantity: '42.5 Qtl',
  actualWeight: '41.8 Qtl',
  difference: '0.7 Qtl',
  rate: 2274,
  grossAmount: 95065
};

export const PAYMENT = {
  expectedAmount: 95065,
  status: 'PROCESSING',
  method: 'Direct Bank Transfer',
  reference: 'KQ-PAY-92817',
  date: null,
  timeline: [
    { label: 'Procurement completed', done: true },
    { label: 'Payment initiated', done: true },
    { label: 'Payment processing', done: true, current: true },
    { label: 'Payment received', done: false }
  ]
};

export const RECEIPT = {
  farmerName: 'Rajesh Kumar',
  token: 'KQ-284',
  centre: 'Shakti Agro Procurement Centre',
  crop: 'Wheat',
  quantity: '41.8 Qtl',
  grade: 'A',
  rate: 2274,
  gross: 95065,
  deductions: 1200,
  net: 93865,
  date: '24 August 2026',
  reference: 'KQ-PAY-92817'
};

export const HISTORY = [
  { date: '24 Aug 2026', crop: 'Wheat', centre: 'Shakti Agro Procurement Centre', quantity: '41.8 Qtl', amount: 93865, status: 'PROCESSING' },
  { date: '15 Aug 2026', crop: 'Wheat', centre: 'Shakti Agro Procurement Centre', quantity: '31.2 Qtl', amount: 80652, status: 'PAID' },
  { date: '02 Jul 2026', crop: 'Mustard', centre: 'GreenField Procurement Centre', quantity: '18.4 Qtl', amount: 41960, status: 'PAID' },
  { date: '19 May 2026', crop: 'Wheat', centre: 'Kisan Seva Procurement Centre', quantity: '36.0 Qtl', amount: 88920, status: 'PAID' },
  { date: '03 Apr 2026', crop: 'Barley', centre: 'Shakti Agro Procurement Centre', quantity: '22.7 Qtl', amount: 47320, status: 'PAID' }
];

export const NOTIFICATIONS = [
  { id: 'n1', category: 'Queue', text: 'Your slot has been confirmed for 11:30 AM.', time: '2h ago', read: false },
  { id: 'n2', category: 'Queue', text: 'There are 17 farmers ahead of you.', time: '45m ago', read: false },
  { id: 'n3', category: 'Queue', text: 'Your estimated waiting time has decreased to 1h 20m.', time: '20m ago', read: false },
  { id: 'n4', category: 'System', text: 'Shakti Agro Procurement Centre is running slightly slower than usual today.', time: '15m ago', read: true },
  { id: 'n5', category: 'Procurement', text: 'Quality check will begin once your token is called.', time: '10m ago', read: true }
];

export const COMPLAINTS = [
  { id: 'cx-1', subject: 'Payment delayed', category: 'Payment issue', status: 'IN_REVIEW', date: '18 Aug 2026' },
  { id: 'cx-2', subject: 'Wrong weight recorded', category: 'Weight issue', status: 'RESOLVED', date: '20 May 2026' },
  { id: 'cx-3', subject: 'Token skipped without notice', category: 'Token issue', status: 'OPEN', date: '24 Aug 2026' }
];

export const OPERATOR_QUEUE = {
  centre: 'Shakti Agro Procurement Centre',
  currentToken: 'KQ-284',
  stage: 'QUALITY_CHECK',
  next: ['KQ-285', 'KQ-286', 'KQ-287', 'KQ-288'],
  stats: { bookingsToday: 210, waiting: 42, completed: 168, noShow: 6, avgProcessingMinutes: 7.5 }
};

export const ADMIN_STATS = {
  totalFarmers: 1284,
  bookingsToday: 612,
  activeCentres: 18,
  currentWaiting: 322,
  completedProcurements: 4560,
  pendingPayments: 214,
  avgWaitMinutes: 74,
  avgProcessingMinutes: 7.8
};

export const ADMIN_DAILY_BOOKINGS = [
  { day: 'Mon', bookings: 480, processed: 455 },
  { day: 'Tue', bookings: 520, processed: 498 },
  { day: 'Wed', bookings: 610, processed: 560 },
  { day: 'Thu', bookings: 590, processed: 575 },
  { day: 'Fri', bookings: 640, processed: 602 },
  { day: 'Sat', bookings: 700, processed: 640 },
  { day: 'Sun', bookings: 300, processed: 290 }
];

export const ADMIN_CROP_SPLIT = [
  { crop: 'Wheat', value: 62 },
  { crop: 'Mustard', value: 16 },
  { crop: 'Barley', value: 12 },
  { crop: 'Gram', value: 10 }
];

export const ADMIN_CENTRE_PERFORMANCE = CENTRES.map((c) => ({
  name: c.name.split(' ')[0],
  processed: c.processedToday,
  waitMinutes: Math.round((c.queueLength / c.avgProcessingPerHour) * 60)
}));

export { delay };
