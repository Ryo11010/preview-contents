import { useCallback, useState } from 'react';
import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';

type FocusHandler = (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

export const useTextFieldFocus = (handlers?: {
  onFocus?: FocusHandler;
  onBlur?: FocusHandler;
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus: FocusHandler = useCallback(
    (e) => {
      setFocused(true);
      handlers?.onFocus?.(e);
    },
    [handlers],
  );

  const handleBlur: FocusHandler = useCallback(
    (e) => {
      setFocused(false);
      handlers?.onBlur?.(e);
    },
    [handlers],
  );

  const baseInputProps: Pick<TextInputProps, 'onFocus' | 'onBlur' | 'autoCorrect'> =
    {
      onFocus: handleFocus,
      onBlur: handleBlur,
      autoCorrect: false,
    };

  return { focused, handleFocus, handleBlur, baseInputProps };
};
