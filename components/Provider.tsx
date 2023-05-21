'use client'
import { FC, ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux'
import { store } from '@/services/store';
// import { QueryClientProvider, QueryClient } from 'react-query'
interface ProviderProps {
  children: ReactNode
};

export default  function Providers({ children }: ProviderProps) {
  // const queryClient = new QueryClient()
  return (
    // <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <Provider store={store}>

          {children}
        </Provider>
      </ThemeProvider>
    // </QueryClientProvider>


  );
};
