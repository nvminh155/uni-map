// Check if we should enable logging
const shouldLog = () => {
  // Check for "track" query parameter
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('track')) {
      return true;
    }
  }
  
  // Check if NODE_ENV is development
  if (import.meta.env.MODE === 'development') {
    return true;
  }
  
  return false;
};

// Create a conditional console wrapper
const conditionalConsole = {
  log: (message?: any, ...args: any[]) => {
    if (shouldLog()) {
      console.log(message, ...args);
    }
  },
  error: (message?: any, ...optionalParams: any[]) => {
    if (shouldLog()) {
      console.error(message, ...optionalParams);
    }
  },
  warn: (message?: any, ...args: any[]) => {
    if (shouldLog()) {
      console.warn(message, ...args);
    }
  },
  info: (message?: any, ...args: any[]) => {
    if (shouldLog()) {
      console.info(message, ...args);
    }
  },
  debug: (message?: any, ...args: any[]) => {
    if (shouldLog()) {
      console.debug(message, ...args);
    }
  }
};

export const csl = conditionalConsole;