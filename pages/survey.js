import React from "react";
import { useState, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import { Button, DatePicker, version, Radio, Space, Row, Col } from "antd";
import styles from "../styles/Survey.module.css";
import { getSurveyService } from "../services/services";
import HeadSurvey from "../components/HeadSurvey";
import Questions from "../components/Questions";
import Answers from "../components/Answers";
import { clearTimer, deleteTimer, getDeadTime } from "../utils/timer";

const Survey = () => {
  const RefTimer = useRef(null);
  const RefOption = useRef("");
  const [survey, setSurvey] = useState();
  const [numberQuestion, setNumberQuestion] = useState("");
  const [timer, setTimer] = useState("00");
  const [timeId, setTimeId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [startedSurvey, setStartedSurvey] = useState(false);

  const getSurvey = async () => {
    const survey = await getSurveyService();
    setSurvey(survey);
  };

  useEffect(() => {
    getSurvey();
  }, []);

  const beginSurvey = () => {
    setAnswers([]);
    setNumberQuestion(0);
    setStartedSurvey(true);
  };

  const nextQuestion = () => {
    let answerItem = {
      question: survey.questions[numberQuestion].text,
      answer: RefOption.current,
    };
    setAnswers([...answers, answerItem]);
    RefOption.current = "";
    deleteTimer(timeId);
    if (numberQuestion + 1 > survey.questions.length) {
      setNumberQuestion("");
      setAnswers(answersSelected);
    } else {
      setNumberQuestion(numberQuestion + 1);
    }
  };

  const manageNextQuestion = () => {
    if (numberQuestion !== "" && numberQuestion !== null) {
      if (survey) {
        if (numberQuestion + 1 > survey.questions.length) {
          setNumberQuestion("");
          clearTimer(
            getDeadTime(survey?.questions[numberQuestion]?.lifetimeSeconds),
            survey?.questions[numberQuestion]?.lifetimeSeconds,
            RefTimer.current,
            setTimer
          );
          setStartedSurvey(false);
        } else {
          clearTimer(
            getDeadTime(survey?.questions[numberQuestion]?.lifetimeSeconds),
            survey?.questions[numberQuestion]?.lifetimeSeconds,
            RefTimer.current,
            setTimer
          );
          const itemOfTimer = setTimeout(
            nextQuestion,
            survey?.questions[numberQuestion]?.lifetimeSeconds * 1000
          );
          setTimeId(itemOfTimer);
        }
      }
    }
  };

  useEffect(() => {
    manageNextQuestion();
  }, [numberQuestion]);

  const handleOnChangeOption = (e) => {
    RefOption.current = e.target.value;
  };

  const submitSurvey = () => {
    setAnswers([]);
  };

  return (
    <div className={styles.App}>
      {survey && (
        <>
          <HeadSurvey
            survey={survey}
            startedSurvey={startedSurvey}
            beginSurvey={beginSurvey}
          />
          <Questions
            survey={survey}
            numberQuestion={numberQuestion}
            timer={timer}
            handleOnChangeOption={handleOnChangeOption}
            optionSelected={RefOption.current}
          />
          <Answers answers={answers} startedSurvey={startedSurvey} />
          {answers.length > 0 && !startedSurvey && (
            <Row justify="center" gutter={[16, 16]}>
              <Col xs={10} sm={10} md={10} lg={8} xl={10}>
                <Button
                  onClick={submitSurvey}
                  type="primary"
                  style={{ marginLeft: 8 }}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default Survey;
