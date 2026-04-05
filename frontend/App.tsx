import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './src/components/Layout';
import LiteratureReviewPage from './src/pages/LiteratureReview';
import SummarizerPage from './src/pages/Summarizer';
import AboutPage from './src/pages/AboutPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/literature-review" replace />} />
          <Route path="literature-review" element={<LiteratureReviewPage />} />
          <Route path="summarizer"        element={<SummarizerPage />} />
          <Route path="about"             element={<AboutPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
