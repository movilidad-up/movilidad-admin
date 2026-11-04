import React from 'react'; import ReactDOM from 'react-dom/client'; import {QueryClient,QueryClientProvider} from '@tanstack/react-query'; import {AuthProvider} from './app/providers/AuthProvider'; import {AppRouter} from './app/router'; import './styles.css';
const queryClient=new QueryClient({defaultOptions:{queries:{staleTime:30000,refetchOnWindowFocus:false}}});
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={queryClient}><AuthProvider><AppRouter/></AuthProvider></QueryClientProvider></React.StrictMode>);
