import Head from 'next/head';

const LayoutMeta = () => {
  return (
    <Head>
      <title>Mojo | P2P Sports Betting</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="P2P Sports Betting" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@davidhurley87" />
      <meta name="twitter:title" content="Mojo" />
      <meta name="twitter:description" content="P2P Sports Betting" />
      <meta
        name="twitter:image"
        content="https://pollock-art.s3.amazonaws.com/meta2.png"
      />
      <meta property="og:url" content={`https://mojo.club`} />
      <meta property="og:title" content="Mojo" />
      <meta property="og:description" content="P2P Sports Betting" />
      <meta
        property="og:image"
        content="https://pollock-art.s3.amazonaws.com/meta2.png"
      />
    </Head>
  );
};

export default LayoutMeta;
