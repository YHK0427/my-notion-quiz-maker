import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// MUI Imports
import {
  AppBar, Toolbar, Typography, Button, Box, Grid, Paper, List, ListItem, ListItemText,
  CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Component Imports
import NotionApiKeyForm from '../components/NotionApiKeyForm';
import QuestionGeneratorForm from '../components/QuestionGeneratorForm';

interface NotionPage {
  id: string;
  title: string;
}

interface GeneratedQuestion {
  question: string;
  options?: string[];
  answer?: string;
}

const DashboardPage = () => {
  const [notionPages, setNotionPages] = useState<NotionPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [pagesError, setPagesError] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const fetchNotionPages = async () => {
    setGeneratedQuestions([]); // Clear old questions when refetching pages
    setLoadingPages(true);
    setPagesError('');
    const token = localStorage.getItem('access_token');
    if (!token) {
      setPagesError('Not logged in. Redirecting...');
      setLoadingPages(false);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/notion/pages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotionPages(response.data.pages);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          handleLogout();
          return;
        }
        setPagesError(err.response.data.detail || 'Failed to fetch Notion pages.');
      } else {
        setPagesError('An unexpected error occurred while fetching Notion pages.');
      }
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    fetchNotionPages();
  }, []);

  const handleQuestionsGenerated = (questions: GeneratedQuestion[]) => {
    setGeneratedQuestions(questions);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notion Quiz Maker
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Left Column */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <NotionApiKeyForm onApiKeySaved={fetchNotionPages} />
          </Paper>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Your Notion Pages</Typography>
            {loadingPages ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            ) : pagesError ? (
              <Alert severity="error">{pagesError}</Alert>
            ) : notionPages.length === 0 ? (
              <Alert severity="info">No Notion pages found. Please configure your API key and share pages with the integration.</Alert>
            ) : (
              <List dense>
                {notionPages.map((page) => (
                  <ListItem key={page.id} disablePadding>
                    <ListItemText primary={page.title} secondary={`ID: ${page.id}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <QuestionGeneratorForm
              notionPages={notionPages}
              onQuestionsGenerated={handleQuestionsGenerated}
            />
          </Paper>
          {generatedQuestions.length > 0 && (
            <Paper sx={{ p: 2, mt: 3 }}>
              <Typography variant="h6" gutterBottom>Generated Questions</Typography>
              {generatedQuestions.map((q, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Question {index + 1}: {q.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: 'background.default' }}>
                    {q.options && (
                      <List dense>
                        {q.options.map((option, optIndex) => (
                          <ListItem key={optIndex}>
                            <ListItemText primary={option} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                    {q.answer && <Alert severity="success" variant="outlined"><strong>Answer:</strong> {q.answer}</Alert>}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;