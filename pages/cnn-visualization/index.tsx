import React, { useState } from 'react';
import { Row, Col, Typography, Button, Modal, Checkbox, Alert } from 'antd';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import { API_URL } from '../../CONFIG';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import DataAgumentationImage from '../../assets/images/data-agumentation.jpg';
import Cat from '../../assets/images/cat-data-agumentation.jpg';
import Dog from '../../assets/images/dog.jpg';

const { Title, Paragraph } = Typography;

type SelectItemProps = {
  title: string;
  checked: boolean;
  toggleSelect: () => void;
};

type TransformType = {
  id: string;
  name: string;
};

const SelectItem: React.FC<SelectItemProps> = ({
  title,
  checked,
  toggleSelect,
}) => (
  <div style={{ marginTop: 5 }}>
    <Checkbox onChange={toggleSelect} checked={checked}>
      {title}
    </Checkbox>
  </div>
);

const CNNVisualization: NextPage = () => {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransforms, setSelectedTransforms] = useState<{
    [k: string]: boolean;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [fileData, setFileData] = useState<any>();

  const toggleSelect = (transform: string) => {
    if (selectedTransforms?.[transform]) {
      setSelectedTransforms((oldVal) => {
        const newVal = { ...oldVal };
        delete newVal[transform];
        return newVal;
      });
    } else {
      setSelectedTransforms((oldVal) => {
        const newVal = { ...oldVal };
        newVal[transform] = true;
        return newVal;
      });
    }
  };

  const handleOk = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', fileData);
    axios
      .post(`${API_URL}/api/cnn-visualization/`, formData)
      .then((res) => {
        setLoading(false);
        setData(res.data.image);
        setIsModalVisible(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      })
      .finally(() => {
        setTimeout(() => {
          setError(false);
        }, 3000);
      });
  };

  const displayImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (file) {
      setOriginalImage(URL.createObjectURL(file));
      setFileData(file);
    }
  };

  return (
    <>
      {error && (
        <Alert
          className="Alert"
          message="Something went wrong, Try again"
          type="error"
        />
      )}
      {loading && <Loader />}
      <Head>
        <title>Convolutional Neural Network Visualisation</title>
        <meta
          name="description"
          content="Convolutional Neural Network Visualisation"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row justify="center" style={{ marginTop: 50, marginBottom: 50 }}>
        <Col xs={20} lg={18}>
          <Title style={{ textAlign: 'center' }}>
            Convolutional Neural Network Visualisation
          </Title>
          <br />
          <br />
          <Paragraph>
            This is a DEMO to shows the output of the Convolutional Neural
            Network, layers by layers (Conv, ReLU and MaxPool)
          </Paragraph>
          <Paragraph>VGG16 model was used as a case study</Paragraph>
          <br />
          <br />
          <Paragraph>Upload Image</Paragraph>
          <Row gutter={4}>
            <Col xs={24} md={10}>
              <input
                className="UploadButton"
                type="file"
                title="Upload an Image"
                onChange={displayImage}
                accept="image/*"
              />
            </Col>
            <Col xs={24} md={14}>
              {originalImage && (
                <>
                  <Paragraph>Original Image</Paragraph>
                  <img
                    src={originalImage}
                    style={{ width: '100%' }}
                    alt="Original Uploaded Image"
                  />
                </>
              )}
            </Col>
          </Row>
          <br />
          <Button onClick={handleOk}>Visualize CNN</Button>
          <br />
          <Title level={3}>Result</Title>
          {data && (
            <img
              className="CnnVisualizationImg"
              src={data}
              alt="cnn visualization result"
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default CNNVisualization;
