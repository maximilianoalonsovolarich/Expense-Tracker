// src

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useModal } from '../../hooks/useModal.jsx';
import { fetchCategories } from '../../services/api';

const validationSchema = Yup.object({
  fecha: Yup.string().required('Requerido'),
  cantidad: Yup.number()
    .required('Requerido')
    .positive('Cantidad debe ser positiva'),
  categoria: Yup.string().required('Requerido'),
  descripcion: Yup.string().required('Requerido'),
  ganancia: Yup.boolean(),
  gasto: Yup.boolean(),
});

const FormContainer = styled(Paper)`
  && {
    padding: 1rem;
    background-color: var(--background-paper);
    border-radius: 8px;
    margin-top: 1rem;
    color: var(--text-primary);
  }
`;

const ButtonContainer = styled(Button)`
  margin-top: 1rem;
`;

function ExpenseForm({ onAddExpense }) {
  const [categories, setCategories] = useState([]);
  const { showModal } = useModal();

  useEffect(() => {
    async function fetchCategoriesFromAPI() {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategoriesFromAPI();
  }, []);

  const formik = useFormik({
    initialValues: {
      fecha: '',
      cantidad: '',
      categoria: '',
      descripcion: '',
      ganancia: false,
      gasto: false,
    },
    validationSchema: validationSchema,
    validate: (values) => {
      const errors = {};
      if (values.ganancia && values.gasto) {
        errors.ganancia = 'No puede seleccionar Ganancia y Gasto a la vez';
        errors.gasto = 'No puede seleccionar Ganancia y Gasto a la vez';
      }
      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      if (values.ganancia || values.gasto) {
        onAddExpense({
          Fecha: values.fecha,
          Cantidad: parseFloat(values.cantidad),
          Categoría: values.categoria,
          Descripción: values.descripcion,
          Ganancia: values.ganancia,
          Gasto: values.gasto,
        });
        resetForm();
        showModal();
      } else {
        toast.error('Debe seleccionar al menos Ganancia o Gasto');
      }
    },
  });

  return (
    <FormContainer elevation={3}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Añadir Gasto
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <label htmlFor="fecha">Fecha</label>
            <TextField
              fullWidth
              id="fecha"
              name="fecha"
              type="date"
              value={formik.values.fecha}
              onChange={formik.handleChange}
              error={formik.touched.fecha && Boolean(formik.errors.fecha)}
              helperText={formik.touched.fecha && formik.errors.fecha}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="cantidad">Cantidad</label>
            <TextField
              fullWidth
              id="cantidad"
              name="cantidad"
              type="number"
              value={formik.values.cantidad}
              onChange={formik.handleChange}
              error={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
              helperText={formik.touched.cantidad && formik.errors.cantidad}
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="categoria">Categoría</label>
            <TextField
              fullWidth
              select
              id="categoria"
              name="categoria"
              value={formik.values.categoria}
              onChange={formik.handleChange}
              error={
                formik.touched.categoria && Boolean(formik.errors.categoria)
              }
              helperText={formik.touched.categoria && formik.errors.categoria}
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="descripcion">Descripción</label>
            <TextField
              fullWidth
              id="descripcion"
              name="descripcion"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              error={
                formik.touched.descripcion && Boolean(formik.errors.descripcion)
              }
              helperText={
                formik.touched.descripcion && formik.errors.descripcion
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  id="ganancia"
                  name="ganancia"
                  checked={formik.values.ganancia}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="Ganancia"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  id="gasto"
                  name="gasto"
                  checked={formik.values.gasto}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="Gasto"
            />
          </Grid>
        </Grid>
        <ButtonContainer
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={formik.values.ganancia && formik.values.gasto}
        >
          Añadir Gasto
        </ButtonContainer>
      </Box>
    </FormContainer>
  );
}

export default ExpenseForm;
