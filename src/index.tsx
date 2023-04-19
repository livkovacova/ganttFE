import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import './index.css';
import reportWebVitals from './reportWebVitals';
import GanttApp from './GanttApp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <GanttApp />
  </BrowserRouter>
);

reportWebVitals();