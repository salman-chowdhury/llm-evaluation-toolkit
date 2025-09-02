export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if it's today
    const isToday = date.toDateString() === now.toDateString();
    
    // Check if it's tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeStr = date.toLocaleTimeString('en-AU', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (isToday) {
      return `Today at ${timeStr}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${timeStr}`;
    } else {
      return date.toLocaleDateString('en-AU', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  } catch (error) {
    return 'Invalid date';
  }
};

export const isEventActive = (start: string, end?: string): boolean => {
  const now = new Date();
  const startDate = new Date(start);
  
  if (end) {
    const endDate = new Date(end);
    return now >= startDate && now <= endDate;
  }
  
  // For incidents without end time, consider active if started within last 24 hours
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return startDate >= dayAgo;
};

export const isEventInFuture = (start: string): boolean => {
  const now = new Date();
  const startDate = new Date(start);
  return startDate > now;
};