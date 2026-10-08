/**
 * Get time-based greeting based on the current hour
 * @param {string} firstName
 * @returns {string}
 */
export function getTimeGreeting(firstName = 'there') {
  const hour = new Date().getHours();
  let timeStr = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeStr = 'Good afternoon';
  } else if (hour >= 17 || hour < 5) {
    timeStr = 'Good evening';
  }
  return `${timeStr}, ${firstName} 👋`;
}
