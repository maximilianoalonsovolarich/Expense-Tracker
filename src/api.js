import axios from 'axios';

const AIRTABLE_ENDPOINT = import.meta.env.VITE_AIRTABLE_ENDPOINT;
const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

export const fetchExpenses = async () => {
  try {
    const response = await axios.get(AIRTABLE_ENDPOINT, { headers: HEADERS });
    return response.data.records;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const addExpense = async (expense) => {
  try {
    const response = await axios.post(
      AIRTABLE_ENDPOINT,
      { records: [{ fields: expense }] },
      { headers: HEADERS }
    );
    return response.data.records;
  } catch (error) {
    console.error('Error adding expense:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${AIRTABLE_ENDPOINT}/${id}`, {
      headers: HEADERS,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting expense:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};
