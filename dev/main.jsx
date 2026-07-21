/*
Dev-server entry. Loads the host-global stubs first, then renders the widget
component directly into #root so React Fast Refresh can hot-swap edits to
SidebarComponent and the panels without a full reload. Not part of the shipped
bundle — the production entry is src/pages/index.jsx.
*/
import './mocks.js';
import {createRoot} from 'react-dom/client';
import SidebarComponent from '../src/components/SidebarComponent.jsx';

createRoot(document.getElementById('root')).render(<SidebarComponent/>);
