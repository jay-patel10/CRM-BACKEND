const ErrorResponse = {
  success: false,
  message: '',
  error: null,   // For generic error messages like DB errors
  errors: {}     // For field-specific validation errors (email, name, etc.)
};

export default ErrorResponse;
