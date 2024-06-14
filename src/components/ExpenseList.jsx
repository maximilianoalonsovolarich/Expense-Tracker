import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ExpenseList({ expenses, onDeleteExpense }) {
  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gastos
      </Typography>
      <List>
        {expenses.map((expense, index) => (
          <React.Fragment key={expense.id}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDeleteExpense(expense.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${expense.fields.Fecha} - ${expense.fields.Cantidad} - ${expense.fields.Categoría} - ${expense.fields.Descripción}`}
              />
            </ListItem>
            {index < expenses.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default ExpenseList;
