export const validateMessages = {
  required: 'Please input your ${label}',
  string: {
    min: '${label} must be at least ${min} characters',
    max: '${label} cannot be longer than ${max} characters'
  },
  array: {
    min: '${label} cannot be less than ${min} in length',
    max: '${label} cannot be greater than ${max} in length'
  },
  number: {
    range: '${label} must be between 0 and ${max}',
    min: '${label} must be minimum ${min}',
    max: '${label} must be maximum ${max}'
  },
  whitespace: 'Please input your ${name}',
  pattern: {
    mismatch: '${label} does not allow special charaters'
  }
};
