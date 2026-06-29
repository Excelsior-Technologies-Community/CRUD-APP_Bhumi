import crypto from 'crypto';

export const generateTempPassword = () => {
  return crypto
    .randomBytes(10)
    .toString('base64')
    .replace(/[/+=]/g, '')
    .slice(0, 10);
};

export const generateOtp = () => {
  return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
};
