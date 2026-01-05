import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx' 
import { HabitProvider } from './context/HabitContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <HabitProvider>
          <App />
        </HabitProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
