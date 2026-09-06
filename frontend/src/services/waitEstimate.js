
export function estimateWaitMinutes(farmersAhead, avgProcessingMinutesPerFarmer) {
  return Math.round(farmersAhead * avgProcessingMinutesPerFarmer);
}

export function shouldLeaveNow({ farmersAhead, avgProcessingMinutesPerFarmer, travelMinutes, bufferMinutes }) {
  const estimatedMinutesUntilCalled = estimateWaitMinutes(farmersAhead, avgProcessingMinutesPerFarmer);
  const minutesNeededToArriveInTime = travelMinutes + bufferMinutes;
  const canLeaveNow = estimatedMinutesUntilCalled <= minutesNeededToArriveInTime + 10;
  const leaveInMinutes = Math.max(estimatedMinutesUntilCalled - minutesNeededToArriveInTime, 0);

  return {
    estimatedMinutesUntilCalled,
    minutesNeededToArriveInTime,
    canLeaveNow,
    leaveInMinutes
  };
}
