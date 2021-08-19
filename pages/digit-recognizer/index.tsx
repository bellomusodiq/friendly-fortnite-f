// @ts-nocheck
import type { NextPage } from 'next';
import Head from 'next/head';
import { Row, Col, Typography, Button, Modal, Divider } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';

const { Title, Paragraph, Text } = Typography;

const Home: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const drawStart = useRef<HTMLCanvasElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleThrottle = throttle((e) => mouseMove(e), 5);

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current?.getContext('2d');
    }
    ctx?.current?.fillRect(
      0,
      0,
      canvasRef.current?.getAttribute('height'),
      canvasRef.current?.getAttribute('width')
    );
    drawStart.current = false;
  }, []);

  const mouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    let ev = e;
    if (e.touches && e.touches[0]) {
      ev = e.touches[0];
    }
    const x = Math.round(
      ev.clientX - canvasRef?.current?.getBoundingClientRect()?.left
    );
    const y = Math.round(
      ev.clientY - canvasRef?.current?.getBoundingClientRect()?.top
    );
    drawStart.current = true;
    ctx.current.beginPath();
    ctx.current.lineWidth = 10;
    ctx.current.strokeStyle = 'white';
    ctx.current.moveTo(x, y);
  };

  const mouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawStart.current) {
      let ev = e;
      if (e.touches && e.touches[0]) {
        ev = e.touches[0];
      }
      const x = Math.round(
        ev.clientX - canvasRef.current.getBoundingClientRect().left
      );
      const y = Math.round(
        ev.clientY - canvasRef.current.getBoundingClientRect().top
      );
      ctx.current.lineTo(x, y);
      ctx.current.stroke();
      ctx.current.moveTo(x, y);
    }
  };

  const dropEnd = (e) => {
    drawStart.current = false;
  };

  const runPrediction = () => {
    setLoading(true);
    axios
      .post(`/api/mnist/`, {
        data: canvasRef.current
          .toDataURL()
          .replace(/^data:image\/[a-z]+;base64,/, ''),
      })
      .then((res) => {
        setLoading(false);
        showModal();
        setData(res.data);
      });
  };

  const reset = () => {
    ctx?.current?.clearRect(
      0,
      0,
      canvasRef.current?.getAttribute('height'),
      canvasRef.current?.getAttribute('width')
    );
    ctx?.current?.fillRect(
      0,
      0,
      canvasRef.current?.getAttribute('height'),
      canvasRef.current?.getAttribute('width')
    );
  };

  const renderRow = () =>
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
      <React.Fragment key={num}>
        <Divider style={{ margin: '5px 0' }} />
        <Row gutter={4}>
          <Col xs={4}>{num}</Col>
          <Col xs={8}>{data?.prob[num.toString()]}%</Col>
        </Row>
      </React.Fragment>
    ));

  return (
    <>
      {loading && <Loader />}
      <Modal
        title="Prediction Result"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row gutter={4}>
          <Col xs={4}>
            <Title level={3}>No.</Title>
          </Col>
          <Col xs={12}>
            <Title level={3}>Prediction probability</Title>
          </Col>
        </Row>
        {renderRow()}
        <Text>
          The model predicts the number to be "<b>{data?.prediction}</b>"
        </Text>
      </Modal>
      <Head>
        <title>Hand-written Digit Recognizer</title>
        <meta name="description" content="MNIST Hand-written Recognizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row justify="center" style={{ marginTop: 50, marginBottom: 50 }}>
        <Col xs={20} lg={18}>
          <Title>MNIST Hand-written Digit Recognizer</Title>
          <Paragraph>
            The MNIST database (Modified National Institute of Standards and
            Technology database) is a large database of handwritten digits that
            is commonly used for training various image processing systems. The
            database is also widely used for training and testing in the field
            of machine learning.
          </Paragraph>
          <Paragraph>
            This demonstration uses Convolutional Neural Network (CNN) to
            predict the writen digit in the canvas (box) bellow, digit can be
            any digit from 0-9
          </Paragraph>
          <Row justify="center">
            <Col>
              <canvas
                onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => {
                  e.persist();
                  handleThrottle(e);
                }}
                onMouseDown={mouseDown}
                onMouseUp={dropEnd}
                onTouchMove={(e: React.TouchEvent<HTMLCanvasElement>) => {
                  e.persist();
                  handleThrottle(e);
                }}
                onTouchStart={mouseDown}
                onTouchEnd={dropEnd}
                ref={canvasRef}
                style={{
                  display: 'flex',
                  border: '2px solid white',
                  margin: 'auto',
                  touchAction: 'none'
                }}
                width={300}
                height={300}
              />
              <Row justify="center">
                <Col>
                  <Row justify="center" gutter={5}>
                    <Col>
                      <Button style={{ marginTop: 20 }} onClick={runPrediction}>
                        Run Prediction
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="danger"
                        style={{ marginTop: 20 }}
                        onClick={reset}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Home;
