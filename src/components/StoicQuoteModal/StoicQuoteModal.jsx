import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Box,
  Typography,
  IconButton,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useModal } from '../../hooks/useModal.jsx';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none',
};

const StoicQuoteModal = () => {
  const { isOpen, hideModal } = useModal();
  const [quote, setQuote] = useState({ text: '', author: '' });

  const fetchQuote = async () => {
    try {
      const response = await fetch('/frases_estoicas_es.json');
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.frases.length);
      const frase = data.frases[randomIndex];
      setQuote({ text: frase.texto, author: frase.autor });
    } catch (error) {
      console.error('Error fetching the quote:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQuote();
    }
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={hideModal}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={hideModal}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="stoic-quote-title" variant="h6" component="h2">
            Estoicismo
          </Typography>
          <Typography id="stoic-quote-description" sx={{ mt: 2 }}>
            {quote.text}
          </Typography>
          <Typography sx={{ mt: 1, fontStyle: 'italic' }}>
            - {quote.author}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default StoicQuoteModal;
