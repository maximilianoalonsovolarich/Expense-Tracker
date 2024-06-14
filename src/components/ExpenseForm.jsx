import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Paper, Grid } from '@mui/material';

const validationSchema = Yup.object({
  fecha: Yup.string().required('Requerido'),
  cantidad: Yup.number()
    .required('Requerido')
    .positive('Cantidad debe ser positiva'),
  categoria: Yup.string().required('Requerido'),
  descripcion: Yup.string().required('Requerido'),
  ingreso: Yup.number()
    .required('Requerido')
    .positive('Ingreso debe ser positivo'),
  egreso: Yup.number()
    .required('Requerido')
    .positive('Egreso debe ser positivo'),
});

function ExpenseForm({ onAddExpense }) {
  const formik = useFormik({
    initialValues: {
      fecha: '',
      cantidad: '',
      categoria: '',
      descripcion: '',
      ingreso: '',
      egreso: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onAddExpense({
        Fecha: values.fecha,
        Cantidad: parseFloat(values.cantidad),
        Categoría: values.categoria,
        Descripción: values.descripcion,
        Ingreso: parseFloat(values.ingreso),
        Egreso: parseFloat(values.egreso),
      });
      resetForm();
    },
  });

  return (
    <Paper
      elevation={3}
      sx={{ padding: 2, backgroundColor: 'background.paper' }}
    >
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Typography variant="h5" gutterBottom>
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
              id="categoria"
              name="categoria"
              label="Categoría"
              value={formik.values.categoria}
              onChange={formik.handleChange}
              error={
                formik.touched.categoria && Boolean(formik.errors.categoria)
              }
              helperText={formik.touched.categoria && formik.errors.categoria}
            />
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
            <TextField
              fullWidth
              id="ingreso"
              name="ingreso"
              label="Ingreso"
              type="number"
              value={formik.values.ingreso}
              onChange={formik.handleChange}
              error={formik.touched.ingreso && Boolean(formik.errors.ingreso)}
              helperText={formik.touched.ingreso && formik.errors.ingreso}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="egreso"
              name="egreso"
              label="Egreso"
              type="number"
              value={formik.values.egreso}
              onChange={formik.handleChange}
              error={formik.touched.egreso && Boolean(formik.errors.egreso)}
              helperText={formik.touched.egreso && formik.errors.egreso}
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
