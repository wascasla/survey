import { Col, Row } from "antd";
import React from "react";
import styles from "./../styles/Survey.module.css";

const Answers = ({ startedSurvey, answers }) => {
  return (
    <div className={styles.row_margin_top}>
      {!startedSurvey && answers.length > 0 && (
        <>
          <Row justify="center" gutter={[16, 16]}>
            <Col span={12}>
              <h2>Survey Summary</h2>
            </Col>
          </Row>
          {answers.map((answer) => {
            return (
              <Row key={answer.question} justify="center" gutter={[16, 16]}>
                <Col span={12}>
                  {answer.question} - {answer.answer}
                </Col>
              </Row>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Answers;
