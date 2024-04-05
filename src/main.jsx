import { createRoot } from './libs/react-dom';
import App from './index.jsx';

// create root container
const root = createRoot(document.getElementById('root'));
// render
root.render(<App />);