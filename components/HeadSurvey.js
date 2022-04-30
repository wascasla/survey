import React from "react";
import { Button, Col, Image, Row } from "antd";
import styles from "../styles/HeadSurvey.module.css"

const HeadSurvey = ({ survey, startedSurvey, beginSurvey, connectWallet }) => {
  return (
    <div className={styles.head}> 
      <Row justify="center" gutter={[16, 16]}>
        <Col xs={18} sm={10} md={10} lg={8} xl={10}>
          <h2>{`Survey: ${survey.title} `}</h2>
          <Image width={100} alt={survey.title} src={survey.image} />
        </Col>
      </Row>
      <Row justify="center" gutter={[16, 16]}>
        <Col span={24}>
          <hr></hr>
        </Col>
      </Row>
      <Row justify="center" gutter={[16, 16]}>
        <Col xs={10} sm={10} md={10} lg={8} xl={10}>
          <Button
            disabled={startedSurvey}
            onClick={beginSurvey}
            type="primary"
            style={{ marginLeft: 8 }}
          >
            Begin Survey
          </Button>
        </Col>
        <Col xs={10} sm={10} md={10} lg={8} xl={10}>
          <Button
            onClick={connectWallet}
            type="primary"
            style={{ marginLeft: 8 }}
          >
            Connect Wallet
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default HeadSurvey;
