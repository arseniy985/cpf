const PHONE_COUNTRY_CODE = '7';
const PHONE_LOCAL_PREFIX = '8';
const PHONE_MOBILE_PREFIX = '9';
const PHONE_MAX_DIGITS = 11;

function extractPhoneDigits(value: string) {
  return value.replace(/\D/g, '');
}

function normalizeRussianPhoneDigits(value: string) {
  const digits = extractPhoneDigits(value);

  if (!digits) {
    return '';
  }

  if (digits.startsWith(PHONE_LOCAL_PREFIX)) {
    return `${PHONE_COUNTRY_CODE}${digits.slice(1)}`.slice(0, PHONE_MAX_DIGITS);
  }

  if (digits.startsWith(PHONE_MOBILE_PREFIX)) {
    return `${PHONE_COUNTRY_CODE}${digits}`.slice(0, PHONE_MAX_DIGITS);
  }

  return digits.slice(0, PHONE_MAX_DIGITS);
}

export function formatPhoneInput(value: string) {
  const digits = normalizeRussianPhoneDigits(value);

  if (!digits) {
    return '';
  }

  const country = '+7';
  const area = digits.slice(1, 4);
  const first = digits.slice(4, 7);
  const second = digits.slice(7, 9);
  const third = digits.slice(9, 11);

  let result = country;

  if (area) {
    result += ` (${area}`;
  }

  if (area.length === 3) {
    result += ')';
  }

  if (first) {
    result += ` ${first}`;
  }

  if (second) {
    result += `-${second}`;
  }

  if (third) {
    result += `-${third}`;
  }

  return result;
}

export function normalizePhoneNumber(value: string) {
  const digits = normalizeRussianPhoneDigits(value);

  if (!digits) {
    return '';
  }

  return `+${digits}`;
}

export function hasCompletePhoneNumber(value: string) {
  return normalizeRussianPhoneDigits(value).length === PHONE_MAX_DIGITS;
}
