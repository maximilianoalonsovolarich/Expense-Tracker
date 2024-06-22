// src/services/api.js
import axios from 'axios';

const AIRTABLE_ENDPOINT = import.meta.env.VITE_AIRTABLE_ENDPOINT;
const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

let queue = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue || queue.length === 0) return;

  isProcessingQueue = true;
  const { id, resolve, reject } = queue.shift();

  try {
    const response = await axios.delete(`${AIRTABLE_ENDPOINT}/${id}`, {
      headers: HEADERS,
    });
    resolve(response.data);
  } catch (error) {
    reject(error);
  } finally {
    isProcessingQueue = false;
    setTimeout(processQueue, 500); // Pause of 500 ms between each request
  }
};

export const fetchExpenses = async () => {
  try {
    const response = await axios.get(AIRTABLE_ENDPOINT, { headers: HEADERS });
    const records = response.data.records.map((record) => ({
      ...record.fields,
      id: record.id,
      Fecha: record.fields.Fecha || 'No disponible',
      Cantidad: record.fields.Cantidad || 0,
      Categoría: record.fields.Categoría || 'No especificada',
      Descripción: record.fields.Descripción || 'No disponible',
      Ganancia: record.fields.Ganancia || false,
      Gasto: record.fields.Gasto || false,
    }));
    const saldoInicialRecord = records.find(
      (record) => record.Categoría === 'Saldo Inicial'
    );
    const saldoInicial = saldoInicialRecord ? saldoInicialRecord.Cantidad : 0;

    return { expenses: records, saldoInicial };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(AIRTABLE_ENDPOINT, { headers: HEADERS });
    const categories = response.data.records.map(
      (record) => record.fields.Categoría
    );
    return [...new Set(categories)];
  } catch (error) {
    console.error('Error fetching categories:', error);
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
    return response.data.records.map((record) => ({
      ...record.fields,
      id: record.id,
      Fecha: record.fields.Fecha || 'No disponible',
      Cantidad: record.fields.Cantidad || 'No disponible',
      Categoría: record.fields.Categoría || 'No disponible',
      Descripción: record.fields.Descripción || 'No disponible',
      Ganancia: record.fields.Ganancia || false,
      Gasto: record.fields.Gasto || false,
    }));
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const deleteExpense = (id) => {
  return new Promise((resolve, reject) => {
    queue.push({ id, resolve, reject });
    processQueue();
  });
};
