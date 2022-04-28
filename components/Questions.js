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
    <Row justify="center" gutter={[16, 16]} className={styles.row_margin_top}>
      <Col xs={24} sm={12} md={12} lg={10} xl={10}>
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
