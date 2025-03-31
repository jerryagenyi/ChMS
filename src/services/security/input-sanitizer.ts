import DOMPurify from 'dompurify';

export const sanitizeInput = (data: any) => {
  // Recursively sanitize all string values
  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object') {
      return typeof obj === 'string' ? DOMPurify.sanitize(obj) : obj;
    }
    
    return Object.keys(obj).reduce((acc, key) => ({
      ...acc,
      [key]: sanitize(obj[key])
    }), {});
  };

  return sanitize(data);
};