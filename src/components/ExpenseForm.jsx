import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const validationSchema = Yup.object({
  fecha: Yup.string().required('Requerido'),
  cantidad: Yup.number()
    .required('Requerido')
    .positive('Cantidad debe ser positiva'),
  categoria: Yup.string().required('Requerido'),
  descripcion: Yup.string().required('Requerido'),
});

function ExpenseForm({ onAddExpense }) {
  const formik = useFormik({
    initialValues: {
      fecha: '',
      cantidad: '',
      categoria: '',
      descripcion: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onAddExpense({
        Fecha: values.fecha,
        Cantidad: parseFloat(values.cantidad),
        Categoría: values.categoria,
        Descripción: values.descripcion,
      });
      resetForm();
    },
  });

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Añadir Gasto
        </Typography>
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
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
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
          margin="normal"
        />
        <TextField
          fullWidth
          id="categoria"
          name="categoria"
          label="Categoría"
          value={formik.values.categoria}
          onChange={formik.handleChange}
          error={formik.touched.categoria && Boolean(formik.errors.categoria)}
          helperText={formik.touched.categoria && formik.errors.categoria}
          margin="normal"
        />
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
          helperText={formik.touched.descripcion && formik.errors.descripcion}
          margin="normal"
        />
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
