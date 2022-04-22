import React from "react";
import { Card, Radio, Space, Button, Row, Col } from "antd";

const Question = ({ question, timer, nextQuestion, handleOnChangeOption }) => {
  return (
    question && (
      <Card
        title={question.text}
        style={{ width: 300 }}
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
          <Col>{timer}</Col>
        </Row>
        <div>
          <Radio.Group onChange={handleOnChangeOption}>
            <Space direction="vertical">
              {question.options.map((q) => (
                <Radio key={q.text} value={q.text}>
                  {q.text}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
        <Row justify="end">
          <Col>
            <Button
              onClick={nextQuestion}
              type="primary"
              style={{ marginLeft: 8 }}
            >
              Siguiente
            </Button>
          </Col>
        </Row>
      </Card>
    )
  );
};

export default Question;
