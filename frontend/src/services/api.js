
import * as mock from './mockData';

const { delay } = mock;

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const IS_DEMO_MODE = true;

export async function getFarmerProfile() {
  await delay();
  return mock.DEMO_FARMER;
}

export async function getCentres() {
  await delay();
  return mock.CENTRES;
}

export async function getCentre(id) {
  await delay(250);
  return mock.CENTRES.find((c) => c.id === id) || mock.CENTRES[0];
}

export async function getAvailableSlots() {
  await delay(300);
  return mock.SLOTS;
}

export async function getCurrentBooking() {
  await delay();
  return mock.CURRENT_BOOKING;
}

export async function createBooking(payload) {
  await delay(700);
  return { ...mock.CURRENT_BOOKING, ...payload, status: 'CONFIRMED' };
}

export async function cancelBooking(bookingId) {
  await delay(500);
  return { id: bookingId, status: 'CANCELLED' };
}

export async function getQueue() {
  await delay(350);
  return { tokens: mock.QUEUE_TOKENS, currentToken: 'KQ-267', yourToken: 'KQ-284' };
}

export async function getProcurementTimeline() {
  await delay();
  return mock.PROCUREMENT_TIMELINE;
}

export async function getQualityCheck() {
  await delay();
  return mock.QUALITY_CHECK;
}

export async function getWeighment() {
  await delay();
  return mock.WEIGHMENT;
}

export async function getPayment() {
  await delay();
  return mock.PAYMENT;
}

export async function getReceipt() {
  await delay();
  return mock.RECEIPT;
}

export async function getHistory() {
  await delay();
  return mock.HISTORY;
}

export async function getNotifications() {
  await delay(250);
  return mock.NOTIFICATIONS;
}

export async function submitComplaint(payload) {
  await delay(600);
  return { id: `cx-${Date.now()}`, status: 'OPEN', ...payload };
}

export async function getComplaints() {
  await delay();
  return mock.COMPLAINTS;
}

export async function getOperatorQueue() {
  await delay();
  return mock.OPERATOR_QUEUE;
}

export async function operatorAction(action) {
  await delay(400);
  return { ok: true, action };
}

export async function getAdminStats() {
  await delay();
  return mock.ADMIN_STATS;
}

export async function getAdminAnalytics() {
  await delay(400);
  return {
    dailyBookings: mock.ADMIN_DAILY_BOOKINGS,
    cropSplit: mock.ADMIN_CROP_SPLIT,
    centrePerformance: mock.ADMIN_CENTRE_PERFORMANCE
  };
}
