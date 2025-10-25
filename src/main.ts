import { createRoot } from 'none';
import App from './App';

/**
 * Entry point for the None application.
 *
 * The `createRoot` function mounts the App component
 * into the DOM element with id="root".
 */
const root = createRoot('#root');
root.render(<App />);