import { Col, Row } from "antd";
import React from "react";
import Question from "./Question";
import styles from "./../styles/Question.module.css";

const Questions = ({
  survey,
  numberQuestion,
  timer,
  nextQuestion,
  handleOnChangeOption,
  optionSelected,
}) => {
  return (
    <Row justify="center" gutter={[16, 16]} className={styles.rowMarginTop}>
      <Col xs={24} sm={18} md={18} lg={10} xl={8}>
        {survey && numberQuestion !== "" ? (
          <Question
            question={survey.questions[numberQuestion]}
            timer={timer}
            nextQuestion={nextQuestion}
            handleOnChangeOption={handleOnChangeOption}
            optionSelected={optionSelected}
          />
        ) : null}
      </Col>
    </Row>
  );
};

export default Questions;
