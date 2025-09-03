// Form validation utilities
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateRoute = (start: string, destination: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!start.trim()) {
    errors.push('Start location is required');
  }
  
  if (!destination.trim()) {
    errors.push('Destination is required');
  }
  
  if (start.trim().toLowerCase() === destination.trim().toLowerCase()) {
    errors.push('Start and destination cannot be the same');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateReportIssue = (
  type: string,
  location: { lat: number; lng: number } | null
): ValidationResult => {
  const errors: string[] = [];
  
  if (!type) {
    errors.push('Please select an issue type');
  }
  
  if (!location) {
    errors.push('Please select a location');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .substring(0, 500); // Limit length
};

// Validate coordinates
export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
};