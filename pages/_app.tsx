import {Provider} from "react-redux";
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from "../src/app/store";
import {AppProps} from "next/app";
import {UserProvider} from '@auth0/nextjs-auth0/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';
import Head from "next/head";

export default function App({Component, pageProps}: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserProvider>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          </Head>
          <Component {...pageProps} />
        </UserProvider>
      </PersistGate>
    </Provider>
  )
}
