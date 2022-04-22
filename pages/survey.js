import React from "react";
import { useState, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import { Button, DatePicker, version, Radio, Space, Row, Col } from "antd";
import styles from "../styles/Survey.module.css";
import Question from "../src/components/Question";

const Survey = () => {
  const Ref = useRef(null);
  const [survey, setSurvey] = useState();
  const [numberQuestion, setNumberQuestion] = useState("");
  const [timer, setTimer] = useState("00");
  const [timeId, setTimeId] = useState(null);
  const [optionSelected, setOptionSelected] = useState("");
  const [activeQuestion, setActiveQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [startedSurvey, setStartedSurvey] = useState(false);

  // fetch(
  //   "https://ratherlabs-challenges.s3.sa-east-1.amazonaws.com/survey-sample.json"
  // )
  //   .then((response) => response.json())
  //   .then((data) => setSurvey(data));

  const getSurvey = async () => {
    const response = await fetch(
      "https://ratherlabs-challenges.s3.sa-east-1.amazonaws.com/survey-sample.json"
    );
    const survey = await response.json();
    setSurvey(survey);
  };

  useEffect(() => {
    getSurvey();
  });

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    return {
      total,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(seconds > 9 ? seconds : "0" + seconds);
    }
  };

  const clearTimer = (e) => {
    setTimer("0" + survey?.questions[numberQuestion]?.lifetimeSeconds);
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(
      deadline.getSeconds() + survey?.questions[numberQuestion]?.lifetimeSeconds
    );
    return deadline;
  };

  var answersSelected = [];

  const beginSurvey = () => {
    setAnswers([]);
    setNumberQuestion(0);
    setStartedSurvey(true);
    console.log(survey);
  };

  const nextQuestion = () => {
    let answerItem = {
      question: survey.questions[numberQuestion].text,
      answer: optionSelected,
    };
    answersSelected.push(answerItem);
    setAnswers([...answers, answerItem]);
    setOptionSelected("");
    deleteTimer(timeId);
    if (numberQuestion + 1 > survey.questions.length) {
      setNumberQuestion("");
      setAnswers(answersSelected);
      console.log("answers", answersSelected);
    } else {
      setNumberQuestion(numberQuestion + 1);
      console.log("answers", answersSelected);
    }
  };

  const deleteTimer = (id) => {
    console.log("deletetimer", id);
    clearTimeout(id);
  };

  useEffect(() => {
    if (numberQuestion !== "" && numberQuestion !== null) {
      if (survey) {
        if (numberQuestion + 1 > survey.questions.length) {
          setNumberQuestion("");
          clearTimer(getDeadTime());
          setStartedSurvey(false);
          console.log("mostrar resumen respuestas", answers);
        } else {
          clearTimer(getDeadTime());
          const itemOfTimer = setTimeout(
            nextQuestion,
            survey?.questions[numberQuestion]?.lifetimeSeconds * 1000
          );
          setTimeId(itemOfTimer);
          console.log(numberQuestion, itemOfTimer);
        }
      }
    }
  }, [numberQuestion]);

  const handleOnChangeOption = (e) => {
    setOptionSelected(e.target.value);
  };
  return (
    <div className={styles.App}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h2>{`Survey: ${survey?.title} `}</h2>
          <hr></hr>
          <Button
            disabled={startedSurvey}
            onClick={beginSurvey}
            type="primary"
            style={{ marginLeft: 8 }}
          >
            Iniciar
          </Button>
        </Col>

        <Col span={24}>
          {survey && numberQuestion !== "" ? (
            <Question
              question={survey.questions[numberQuestion]}
              timer={timer}
              nextQuestion={nextQuestion}
              handleOnChangeOption={handleOnChangeOption}
            />
          ) : null}
        </Col>
        {answers.length > 0 && <Col span={24}>{JSON.stringify(answers)}</Col>}
      </Row>
    </div>
  );
};

export default Survey;
