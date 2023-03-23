import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link rel='preconnect' href='https://fonts.gstat</link>ic.com' crossOrigin='' />
                <link href='https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600&display=swap' rel='stylesheet' />
                <link rel='stylesheet' href='https://unpkg.com/leaflet@1.8.0/dist/leaflet.css' integrity='sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==' crossOrigin='' />
                <link rel='shortcut icon' href='/favicon.ico' />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}