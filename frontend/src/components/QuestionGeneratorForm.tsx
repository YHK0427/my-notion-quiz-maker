import React, { useState } from 'react';
import axios from 'axios';

// MUI Imports
import {
  Box, Button, TextField, Typography, Alert, Collapse, FormControl, InputLabel, Select, MenuItem,
  CircularProgress
} from '@mui/material';

interface NotionPage {
  id: string;
  title: string;
}

interface QuestionGeneratorFormProps {
  notionPages: NotionPage[];
  onQuestionsGenerated: (questions: any[]) => void;
}

const QuestionGeneratorForm: React.FC<QuestionGeneratorFormProps> = ({ notionPages, onQuestionsGenerated }) => {
  const [selectedPageId, setSelectedPageId] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    onQuestionsGenerated([]); // Clear previous questions

    if (!selectedPageId) {
      setError('Please select a Notion page.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to generate questions.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/generate-questions',
        {
          page_id: selectedPageId,
          num_questions: numQuestions,
          question_type: questionType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onQuestionsGenerated(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Failed to generate questions.');
      } else {
        setError('An unexpected error occurred during question generation.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Generate Questions
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="page-select-label">Select Notion Page</InputLabel>
          <Select
            labelId="page-select-label"
            id="pageSelect"
            value={selectedPageId}
            label="Select Notion Page"
            onChange={(e) => setSelectedPageId(e.target.value)}
            disabled={notionPages.length === 0}
          >
            {notionPages.map((page) => (
              <MenuItem key={page.id} value={page.id}>
                {page.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Number of Questions"
          type="number"
          fullWidth
          margin="normal"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          inputProps={{ min: 1, max: 10 }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="question-type-label">Question Type</InputLabel>
          <Select
            labelId="question-type-label"
            id="questionType"
            value={questionType}
            label="Question Type"
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
            <MenuItem value="short_answer">Short Answer</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={loading || !selectedPageId}
          sx={{ mt: 2 }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </Button>
      </Box>
      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Collapse>
    </Box>
  );
};

export default QuestionGeneratorForm;
