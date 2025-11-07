export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidTelegram = (username: string): boolean => {
  const re = /^@[a-zA-Z0-9_]{5,32}$/;
  return re.test(username);
};

export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic phone validation (can be enhanced based on requirements)
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};