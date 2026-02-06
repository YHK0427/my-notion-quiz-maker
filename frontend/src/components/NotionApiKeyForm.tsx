import React, { useState } from 'react';
import axios from 'axios';

// MUI Imports
import { Box, Button, TextField, Typography, Alert, Collapse } from '@mui/material';

interface NotionApiKeyFormProps {
  onApiKeySaved: () => void;
}

const NotionApiKeyForm: React.FC<NotionApiKeyFormProps> = ({ onApiKeySaved }) => {
  const [notionApiKey, setNotionApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to save the Notion API key.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/notion/token',
        { notion_api_token: notionApiKey },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Notion API key saved successfully!');
      setNotionApiKey('');
      // Show success message for a bit before calling parent
      setTimeout(() => {
        setMessage('');
        onApiKeySaved();
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Failed to save Notion API key.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notion API Key
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Enter your Notion API Key"
          variant="outlined"
          fullWidth
          required
          value={notionApiKey}
          onChange={(e) => setNotionApiKey(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save API Key'}
        </Button>
      </Box>
      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Collapse>
      <Collapse in={!!message}>
        <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>
      </Collapse>
    </Box>
  );
};

export default NotionApiKeyForm;
