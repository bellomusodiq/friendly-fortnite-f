import '../styles/globals.css';
import '../styles/Loader.css';
import '../styles/Header.css';
import '../styles/SideNav.css';
import type { AppProps } from 'next/app';
import Header from '../components/Header/Header';
import SideNav from '../components/SideNav/SideNav';
import { Row, Col } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Row className="Container">
        <Col xs={0} md={4}>
          <SideNav />
        </Col>
        <Col xs={24} md={20}>
          <Component {...pageProps} />
        </Col>
      </Row>
    </>
  );
}
export default MyApp;
