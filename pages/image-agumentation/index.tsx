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

const ImageAgumentation: NextPage = () => {
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

  const transformToName: { [transform: string]: string } = {};

  const transforms: TransformType[] = [
    {
      id: 'center_crop',
      name: 'Center Crop',
    },
    {
      id: 'random_crop',
      name: 'Random Crop',
    },
    {
      id: 'color_jitter',
      name: 'Color Jitter',
    },
    {
      id: 'gray_scale',
      name: 'Gray Scale',
    },
    {
      id: 'affine',
      name: 'Affine Transformation',
    },
    {
      id: 'horizontal_flip',
      name: 'Horizontal Flip',
    },
    {
      id: 'vertical_flip',
      name: 'Vertical Flip',
    },
    {
      id: 'perspective',
      name: 'Perspective Transformation',
    },
    {
      id: 'rotation',
      name: 'Rotation',
    },
    {
      id: 'gaussian_blur',
      name: 'Gaussian Blur',
    },
    {
      id: 'invert',
      name: 'Invert',
    },
    {
      id: 'sharpness',
      name: 'Sharpness',
    },
    {
      id: 'random_erasing',
      name: 'Random Erasing',
    },
  ];

  transforms.forEach((transformItem) => {
    transformToName[transformItem.id] = transformItem.name;
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', fileData);
    const transformsData = JSON.stringify(Object.keys(selectedTransforms));
    formData.append('transforms', transformsData);
    axios
      .post(`${API_URL}/api/image-agumentation/`, formData)
      .then((res) => {
        setLoading(false);
        setData(res.data);
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

  const handleCancel = () => {
    setIsModalVisible(false);
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
      <Modal
        title="Select Transforms"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm"
        okButtonProps={{
          disabled: Boolean(Object.keys(selectedTransforms).length < 1),
        }}
      >
        {transforms.map((transform) => (
          <SelectItem
            key={transform.id}
            title={transform.name}
            checked={!!selectedTransforms?.[transform.id]}
            toggleSelect={() => toggleSelect(transform.id)}
          />
        ))}
      </Modal>
      <Head>
        <title>Image Data Agumentation</title>
        <meta name="description" content="Image Data Agumentation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row justify="center" style={{ marginTop: 50, marginBottom: 50 }}>
        <Col xs={20} lg={18}>
          <Title style={{ textAlign: 'center' }}>Image Data Agumentation</Title>
          <Image
            src={Cat}
            alt="https://www.kdnuggets.com/2018/05/data-augmentation-deep-learning-limited-data.html"
          />
          <br />
          <br />
          <Paragraph>
            Data augmentation in data analysis are techniques used to increase
            the amount of data by adding slightly modified copies (
            <b>
              tilting, rotating, horizontal & vertical filping, random croping,
              changing color, grayscale, scaling, bluring, posterizing,
              solarizing, sharpness adjusting, contrast adjusting, random
              erasing
            </b>
            ) of already existing data or newly created synthetic data from
            existing data. It acts as a regularizer and helps reduce overfitting
            when training a machine learning model.[1] It is closely related to
            oversampling in data analysis. [Wiki,
            <a target="_blank">
              https://en.wikipedia.org/wiki/Data_augmentation]
            </a>
          </Paragraph>
          <Paragraph>
            [Shorten, C., Khoshgoftaar, T.M. A survey on Image Data Augmentation
            for Deep Learning. J Big Data 6, 60 (2019).
            <a target="_blank">
              https://doi.org/10.1186/s40537-019-0197-0]
            </a>{' '}
            Showed the effect of data agumentation by comparing train/test
            losses for when data agumentation was not applied and when it is
            applied in the figure below.
          </Paragraph>
          <Image
            src={DataAgumentationImage}
            alt="A survey on Image Data Augmentation for Deep Learning"
          />
          <br />
          <br />
          <Paragraph>
            In general your image dataset increase to <b>n * (t + 1)</b>, <br />
            where n = number of images in dataset, t = number of transforms
            (rotation, flip, crop etc.)
            <br />
            For example: having 10,000 images and applying 5 transforms, this
            will generate 5 new images for each original image in this case the
            new data images will be 60,000
          </Paragraph>
          <br />
          <Title level={4}>
            This is a playground to demonstrate data agumentation
          </Title>
          <Paragraph>
            Upload Image and choose different transform types, this will output
            the different modified images
          </Paragraph>
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
          <Row style={{ marginTop: 20 }} justify="center">
            <Button
              title="Select Transforms"
              disabled={!originalImage}
              onClick={showModal}
            >
              Select Transforms
            </Button>
          </Row>
          <br />
          <br />
          <Title level={4}>Agument Result</Title>
          <Row gutter={10}>
            {originalImage && (
              <Col xs={24} md={12} lg={8} style={{ marginTop: 20 }}>
                <Paragraph>Original</Paragraph>
                <img width="100%" src={originalImage} alt="dog" />
              </Col>
            )}
            {data?.map((transformed: any) => (
              <Col
                key={transformed.id}
                xs={24}
                md={12}
                lg={8}
                style={{ marginTop: 20 }}
              >
                <Paragraph>{transformToName[transformed.transform]}</Paragraph>
                <img width="100%" src={transformed.image} alt="dog" />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ImageAgumentation;
