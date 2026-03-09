//true при npm run dev и в false при сборке (build)
export const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
