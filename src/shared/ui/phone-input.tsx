'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { formatPhoneInput } from '@/shared/lib/forms/phone';

type PhoneInputProps = Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'defaultValue'> & {
  value?: string;
  defaultValue?: string;
};

export function PhoneInput({
  autoComplete = 'tel',
  inputMode = 'tel',
  placeholder = '+7 (999) 000-00-00…',
  spellCheck = false,
  value,
  defaultValue,
  onChange,
  ...props
}: PhoneInputProps) {
  const maskedValue = value !== undefined ? formatPhoneInput(value) : undefined;
  const maskedDefaultValue = defaultValue !== undefined ? formatPhoneInput(defaultValue) : undefined;

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = formatPhoneInput(event.target.value);
    (onChange as ((value: string) => void) | undefined)?.(nextValue);
  }, [onChange]);

  return (
    <Input
      {...props}
      type="tel"
      autoComplete={autoComplete}
      inputMode={inputMode}
      spellCheck={spellCheck}
      placeholder={placeholder}
      value={maskedValue}
      defaultValue={maskedDefaultValue}
      onChange={handleChange}
    />
  );
}
