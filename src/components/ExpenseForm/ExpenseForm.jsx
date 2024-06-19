import React, { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

function ExpenseForm({ onAddExpense }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategoriesFromAPI() {
      try {
        const response = await fetch(
          'https://api.airtable.com/v0/meta/bases/app30fCoAP4n2LysL/tables',
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
            },
          }
        );
        const data = await response.json();
        const categoryField = data.tables[0].fields.find(
          (field) => field.name === 'Categoría'
        );
        const categoriesData = categoryField.options.choices.map((choice) => ({
          name: choice.name,
          color: choice.color,
        }));
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
      } else {
        toast.error('Debe seleccionar al menos Ganancia o Gasto');
      }
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
                <MenuItem key={index} value={category.name}>
                  <span style={{ color: category.color }}>{category.name}</span>
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
