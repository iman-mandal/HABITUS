import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'
import UserContext from './Context/userContext'



createRoot(document.getElementById('root')).render(

    <StrictMode>
        <UserContext>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </UserContext>
    </StrictMode>,
)
