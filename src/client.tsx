import { StartClient } from '@tanstack/react-start/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document);

root.render(
  <StrictMode>
    <StartClient />
  </StrictMode>
);
