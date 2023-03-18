import '../styles/globals.css';
import type { AppProps } from 'next/app';
import MainLayout from '../components/MainLayout';

export { reportWebVitals } from 'next-axiom';

function MyApp({ Component, pageProps }: AppProps) {
  return <MainLayout><Component {...pageProps} /></MainLayout>;
}

export default MyApp;
