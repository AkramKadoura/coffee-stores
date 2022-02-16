import Document, {Head, Html, Main, NextScript} from 'next/document'

class MyDocument extends Document {
    render() {
        return (
        
          <Html lang="en">
            <Head>
                <link
                  rel="preload"
                  href="/fonts/IBMPlexSans-Bold.ttf"
                  as="font"
                  crossOrigin="anonymous"
                ></link>
                <link
                  rel="preload"
                  href="/fonts/IBMPlexSans-Regular.ttf"
                  as="font"
                  crossOrigin="anonymous"
                ></link>
                <link
                  rel="preload"
                  href="/fonts/IBMPlexSans-SemiBold.ttf"
                  as="font"
                  crossOrigin="anonymous"
                ></link>

            </Head>
            <body>
                <Main></Main>
                <NextScript />
 
            </body>
          </Html>
        )
    }
}

export default MyDocument


// @font-face {
//     font-family: 'IBMPlexSans';
//     font-style: normal;
//     font-weight: 500;
//     src: url(/fonts/IBMPlexSans-Regular.ttf) format('truetype');
//   }
   
//   @font-face {
//     font-family: 'IBMPlexSans';
//     font-style: normal;
//     font-weight: 600;
//     src: url(/fonts/IBMPlexSans-SemiBold.ttf) format('truetype');
//   }
   
//   @font-face {
//     font-family: 'IBMPlexSans';
//     font-style: normal;
//     font-weight: 700;
//     src: url(/fonts/IBMPlexSans-Bold.ttf) format('truetype');
//   }