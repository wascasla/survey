import React from "react";
import { Card, Radio, Space, Button, Row, Col } from "antd";
import Image from "next/image";
import styles from "../styles/Question.module.css";

const Question = ({
  question,
  timer,
  handleOnChangeOption,
  optionSelected,
}) => {
  return (
    question && (
      <Card
        title={question.text}
        cover={
          <img
            alt={question.text}
            src={question.image}
            width={100}
            height={150}
          />
        }
      >
        <Row justify="end">
          <Col>
            <div className={styles.circle}>{timer}</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Radio.Group onChange={handleOnChangeOption} value={optionSelected}>
              <Space direction="vertical">
                {question.options.map((q) => (
                  <Radio key={q.text} value={q.text}>
                    {q.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  );
};

export default Question;
