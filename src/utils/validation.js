import { reactive } from 'vue'
import EventBus from '@/libs/AppEventBus'
import { requiredMessage, VALIDATION_MESSAGES } from '@/utils/formValidation'

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

  // Preserve already-friendly client messages.
  if (
    text.endsWith(' is required.')
    || text === VALIDATION_MESSAGES.select
    || text === VALIDATION_MESSAGES.date
    || text === VALIDATION_MESSAGES.file
    || text === VALIDATION_MESSAGES.emailInvalid
    || text === VALIDATION_MESSAGES.emailRequired
    || text === VALIDATION_MESSAGES.emailReserved
    || text === VALIDATION_MESSAGES.emailUnique
    || text === VALIDATION_MESSAGES.nrcInvalid
    || text === VALIDATION_MESSAGES.phoneInvalid
    || text === VALIDATION_MESSAGES.passwordMin
    || text === VALIDATION_MESSAGES.passwordMatch
    || text === VALIDATION_MESSAGES.passwordDifferent
    || text === VALIDATION_MESSAGES.currentPasswordIncorrect
    || text === 'Incorrect password.'
    || text === 'Email not found.'
    || text === VALIDATION_MESSAGES.numberInvalid
    || text === VALIDATION_MESSAGES.dateInvalid
    || text.startsWith('Please enter a number')
  ) {
    return text
  }

  if (lower.includes('required')) {
    return requiredMessage(fieldName)
  }

  if (lower.includes('valid email') || lower.includes('must be a valid email') || lower.includes('email must be valid')) {
    return VALIDATION_MESSAGES.emailInvalid
  }

  if (fieldName === 'email' && (lower.includes('reserved') || text === VALIDATION_MESSAGES.emailReserved)) {
    return VALIDATION_MESSAGES.emailReserved
  }

  if (
    fieldName === 'email'
    && (lower.includes('already been taken') || lower.includes('already registered') || lower.includes('already exists') || lower.includes('already in use'))
  ) {
    return VALIDATION_MESSAGES.emailUnique
  }

  if (
    fieldName === 'username'
    && (lower.includes('already been taken') || lower.includes('already registered') || lower.includes('already exists') || lower.includes('already in use'))
  ) {
    return 'This username is already in use.'
  }

  if (
    fieldName === 'room_number'
    && (lower.includes('already been taken') || lower.includes('already exists') || lower.includes('already in use'))
  ) {
    return text.includes('already exists in this building')
      ? text
      : 'Room number already exists in this building.'
  }

  if (
    lower.includes('confirmation does not match')
    || lower.includes('confirmation doesn')
    || lower.includes('password confirmation')
    || lower.includes('passwords do not match')
  ) {
    return VALIDATION_MESSAGES.passwordMatch
  }

  if (lower.includes('password') && (lower.includes('at least') || lower.includes('min'))) {
    return VALIDATION_MESSAGES.passwordMin
  }

  if (fieldName.includes('phone') && (lower.includes('invalid') || lower.includes('format') || lower.includes('valid'))) {
    return VALIDATION_MESSAGES.phoneInvalid
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

function clearErrorStore(store) {
  Object.keys(store).forEach((key) => {
    delete store[key]
  })
}

function assignErrors(store, errors) {
  clearErrorStore(store)

  Object.entries(normalizeErrors(errors)).forEach(([field, messages]) => {
    store[field] = messages
  })
}

export class Errors {
  /**
   * Create a new Errors instance backed by a reactive store so templates
   * re-render when validation messages are recorded or cleared.
   */
  constructor() {
    this.errors = reactive({})
  }

  /**
   * Determine if an errors exists for the given field.
   *
   * @param {string} field
   */
  has(field) {
    const messages = this.errors[field]

    if (!Array.isArray(messages) || messages.length === 0) {
      return false
    }

    return messages.some((message) => typeof message === 'string' && message.trim().length > 0)
  }

  /**
   * Determine if we have any errors.
   */
  any() {
    return Object.keys(this.errors).some((field) => this.has(field))
  }

  /**
   * Retrieve the error messages for a field as an array of strings.
   *
   * @param {string} field
   */
  get(field) {
    const messages = this.errors[field]

    if (!Array.isArray(messages)) {
      return []
    }

    return messages.filter((message) => typeof message === 'string' && message.trim().length > 0)
  }

  /**
   * First non-empty error string for a field, or empty string.
   *
   * @param {string} field
   */
  first(field) {
    return this.get(field)[0] || ''
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
   * @param {boolean} notify
   */
  record(errors, notify = true) {
    assignErrors(this.errors, errors)

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

    clearErrorStore(this.errors)
  }
}
