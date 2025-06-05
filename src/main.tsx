import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from 'features/document/pages/home-page';
import { LogInPage } from 'src/features/auth/pages/login-page';
import { SignUpPage } from 'src/features/auth/pages/signup-page';
import { DocumentPage } from 'src/features/document/pages/document-page';
import { SheetPage } from './features/document/pages/sheet-page.tsx';
import { DocumentLayout } from './features/document/pages/document-layout.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css'
import App from './App.tsx'
import { RouteChangeListener } from './shared/components/Route/route-listener.tsx';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <RouteChangeListener />
    <Routes>
      <Route element={<App />} path='/'>
        {/* Homepage */}
        <Route element={<HomePage />} path='home' />
        {/* Document */}
        <Route element={<DocumentLayout />}>
          <Route element={<DocumentPage />} path=':document_id'/>
          <Route element={<SheetPage />} path=':document_id/:sheet_name' />
        </Route>
        {/* Auth */}
        <Route element={<LogInPage />} path='login' />
        <Route element={<SignUpPage />} path='signup' />    
      </Route>
    </Routes>
  </BrowserRouter>
  </QueryClientProvider>
) 
