import { Html, Head, Main, NextScript } from 'next/document';
import { FB_PIXEL_ID } from '../lib/fpixel';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <meta
          name="facebook-domain-verification"
          content="i5j3n45wpi561c391xkdsse5w85083"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async />
      </body>
    </Html>
  );
}
