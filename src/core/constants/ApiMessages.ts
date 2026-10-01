/**
 * Central catalog of response messages / status codes / string constants
 * returned by ShoppersStack APIs. Import from here instead of hard-coding strings.
 */
export const ApiMessages = {
  // Envelope `message` values
  SUCCESS:       'Success',
  CREATED:       'Created',
  OK:            'OK',

  BAD_REQUEST:   'BAD_REQUEST',
  UNAUTHORIZED:  'UNAUTHORIZED',
  FORBIDDEN:     'FORBIDDEN',
  NOT_FOUND:     'NOT_FOUND',
  CONFLICT:      'CONFLICT',
  INTERNAL:      'INTERNAL_SERVER_ERROR',

  // Common `data` (error) strings observed from ShoppersStack
  Errors: {
    WRONG_CREDENTIALS: 'Given user ID or password is wrong',
    INVALID_PHONE:     'The number is Not Valid',
    MUST_NOT_BE_NULL:  'must not be null',
    DUPLICATE_USER:    'Given Email ID or Phone number already used',
  },
} as const;

export type ApiMessagesType = typeof ApiMessages;
