import EventBus from '@/libs/AppEventBus'

let validationToastPending = false

function showValidationToast() {
  if (validationToastPending) return

  validationToastPending = true
  EventBus.emit('show-toast', {
    severity: 'warn',
    summary: '',
    detail: 'Please correct the highlighted fields before submitting.',
  })

  queueMicrotask(() => {
    validationToastPending = false
  })
}

function normalizeMessage(message, field = '') {
  const text = String(message || '').trim()
  const lower = text.toLowerCase()
  const fieldName = String(field || '').toLowerCase()

  if (!text) {
    return 'Something went wrong. Please try again.'
  }

  if (lower.includes('required')) {
    return 'This field is required.'
  }

  if (lower.includes('valid email') || lower.includes('must be a valid email') || lower.includes('email must be valid')) {
    return 'Please enter a valid email address.'
  }

  if (
    fieldName === 'email'
    && (lower.includes('already been taken') || lower.includes('already registered') || lower.includes('already exists'))
  ) {
    return 'This email is already registered.'
  }

  if (
    lower.includes('confirmation does not match')
    || lower.includes('confirmation doesn')
    || lower.includes('password confirmation')
    || lower.includes('passwords do not match')
  ) {
    return 'Passwords do not match.'
  }

  return text
}

function normalizeErrors(errors) {
  return Object.entries(errors || {}).reduce((normalized, [field, messages]) => {
    const list = Array.isArray(messages) ? messages : [messages]
    const normalizedMessages = list.map((message) => normalizeMessage(message, field))

    normalized[field] = [
      ...(normalized[field] || []),
      ...normalizedMessages,
    ].filter((message, index, allMessages) => allMessages.indexOf(message) === index)

    if (field.includes('.')) {
      const rootField = field.split('.')[0]
      normalized[rootField] = [
        ...(normalized[rootField] || []),
        ...normalizedMessages,
      ].filter((message, index, allMessages) => allMessages.indexOf(message) === index)
    }

    return normalized
  }, {})
}

export class Errors {
  /**
   * Create a new Errors instance.
   */
  constructor() {
    this.errors = {}
  }

  /**
   * Determine if an errors exists for the given field.
   *
   * @param {string} field
   */
  has(field) {
    // eslint-disable-next-line no-prototype-builtins
    return this.errors.hasOwnProperty(field)
  }

  /**
   * Determine if we have any errors.
   */
  any() {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Retrieve the error message for a field.
   *
   * @param {string} field
   */
  get(field) {
    if (this.errors[field]) {
      let errorList = []
      this.errors[field].forEach((err) => {
        errorList.push(err)
      })
      return errorList
    }

    return []
  }

  /**
   * Retrieve flash message if any
   *
   * @param {string} field
   */
  getFlash(field) {
    if (this.errors[field]) {
      return this.errors[field]
    }
  }

  /**
   * Record the new errors.
   *
   * @param {object} errors
   */
  record(errors, notify = true) {
    this.errors = normalizeErrors(errors)

    if (notify && this.any()) {
      showValidationToast()
    }
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string|null} field
   */
  clear(field) {
    if (field) {
      if (this.has(field)) {
        delete this.errors[field]
      }

      return
    }

    this.errors = {}
  }
}
