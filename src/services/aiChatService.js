import axios from 'axios';

const aiBaseUrl = import.meta.env.VITE_AI_BASE_URL || 'http://localhost:8001/api/v1';

const aiClient = axios.create({
    baseURL: aiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 35000,
});

/**
 * Ask a question about available properties, rentals, pricing, deposits, and amenities.
 * @param {Object} options
 * @param {string} options.question
 * @param {number|null} [options.propertyId]
 * @returns {Promise<{ answer: string, properties?: Array, model?: string }>}
 */
export async function askPropertyQuestion({ question, propertyId = null }) {
    const payload = {
        question: question.trim(),
    };

    if (propertyId) {
        payload.property_id = Number(propertyId);
    }

    const response = await aiClient.post('/property/ask', payload);
    return response.data;
}

/**
 * Ask a question about the logged-in customer's own rent, active contracts, invoices, and payment history.
 * @param {Object} options
 * @param {string} options.question
 * @param {string|null} [options.token]
 * @returns {Promise<{ answer: string, profile?: Object, model?: string }>}
 */
export async function askRentQuestion({ question, token = null }) {
    const authToken = token || localStorage.getItem('token');
    const headers = {};

    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await aiClient.post(
        '/rent/ask',
        { question: question.trim() },
        { headers }
    );

    return response.data;
}

export default {
    askPropertyQuestion,
    askRentQuestion,
};
