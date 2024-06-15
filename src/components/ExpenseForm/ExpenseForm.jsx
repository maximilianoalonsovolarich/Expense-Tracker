import React, { useState, useEffect } from 'react';
import { fetchCategories } from '/src/services/api.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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

const validationSchema = Yup.object({
  fecha: Yup.string().required('Requerido'),
  cantidad: Yup.number()
    .required('Requerido')
    .positive('Cantidad debe ser positiva'),
  categoria: Yup.string().required('Requerido'),
  descripcion: Yup.string().required('Requerido'),
  ingreso: Yup.boolean(),
  egreso: Yup.boolean(),
});

function ExpenseForm({ onAddExpense }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function getCategories() {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    getCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      fecha: '',
      cantidad: '',
      categoria: '',
      descripcion: '',
      ingreso: false,
      egreso: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onAddExpense({
        Fecha: values.fecha,
        Cantidad: parseFloat(values.cantidad),
        Categoría: values.categoria,
        Descripción: values.descripcion,
        Ingreso: values.ingreso,
        Egreso: values.egreso,
      });
      resetForm();
    },
  });

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Añadir Gasto
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="fecha"
              name="fecha"
              label="Fecha"
              type="date"
              value={formik.values.fecha}
              onChange={formik.handleChange}
              error={formik.touched.fecha && Boolean(formik.errors.fecha)}
              helperText={formik.touched.fecha && formik.errors.fecha}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="cantidad"
              name="cantidad"
              label="Cantidad"
              type="number"
              value={formik.values.cantidad}
              onChange={formik.handleChange}
              error={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
              helperText={formik.touched.cantidad && formik.errors.cantidad}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              id="categoria"
              name="categoria"
              label="Categoría"
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
            <TextField
              fullWidth
              id="descripcion"
              name="descripcion"
              label="Descripción"
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
                  id="ingreso"
                  name="ingreso"
                  checked={formik.values.ingreso}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="Ingreso"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  id="egreso"
                  name="egreso"
                  checked={formik.values.egreso}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="Egreso"
            />
          </Grid>
        </Grid>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
        >
          Añadir Gasto
        </Button>
      </Box>
    </Paper>
  );
}

export default ExpenseForm;
