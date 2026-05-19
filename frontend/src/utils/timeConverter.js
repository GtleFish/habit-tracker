export const formatTo12Hour = (time24h) => {
  if (!time24h) return '';
  const [hours, minutes] = time24h.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
};

export const formatTo24Hour = (time24h) => {
  if (!time24h) return '';
  return time24h;
};

export const timeInputTo24Hour = (timeStr) => {
  if (!timeStr) return '';
  return timeStr;
};

export const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '-';
  return `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`;
};

export const isValidTime = (timeStr) => {
  if (!timeStr) return true;
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr);
};
