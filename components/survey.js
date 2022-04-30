import React from "react";
import { useState, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import { Button, Row, Col, Alert } from "antd";
import styles from "../styles/Survey.module.css";
import HeadSurvey from "./HeadSurvey";
import Questions from "./Questions";
import Answers from "./Answers";
import { clearTimer, deleteTimer, getDeadTime } from "../utils/timer";
import { ethers } from "ethers";
import surveyJson from "../services/survey-sample.json";
import abi from "../utils/survey-abi.json";

const Survey = () => {
  const RefTimer = useRef(null);
  const RefOption = useRef("");
  const [numberQuestion, setNumberQuestion] = useState("");
  const [timer, setTimer] = useState("00");
  const [timeId, setTimeId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [startedSurvey, setStartedSurvey] = useState(false);
  const [message, setMessage] = useState();
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalQuiz, setTotalQuiz] = useState(0);
  const [loadingTxn, setLoadingTxn] = useState(false);

  const survey = surveyJson;
  const contractAddress = "0x74F0B668Ea3053052DEAa5Eedd1815f579f0Ee03";

  const contractABI = abi;

  useEffect(() => {
    setTimeout(() => {
      setMessage();
    }, 4000);
  }, [message]);

  const getTotalQuiz = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const surveyContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await surveyContract.balanceOf(currentAccount);
        setTotalQuiz(ethers.utils.formatEther(count));
      } else {
        setMessage("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const checkIfWalletIsConnected = (setMessage) => {
    try {
      const { ethereum } = window;

      if (!!ethereum) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      setMessage(error);
    }
  };

  const checkIfExistsAnAuthorizedAccount = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setMessage(error.message);
      return false;
    }
  };

  useEffect(() => {
    getTotalQuiz();
  }, [currentAccount]);

  useEffect(() => {
    checkIfExistConnectedWalletAndAthorizedAccount();
  }, []);

  const checkIfExistConnectedWalletAndAthorizedAccount = async () => {
    if (checkIfWalletIsConnected()) {
      setMessage("Make sure you have metamask");
    } else {
      if (await checkIfExistsAnAuthorizedAccount()) {
        getTotalQuiz();
      } else {
        setMessage("Not authorized account found");
      }
    }
  };

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
          const itemOfTimer = setTimeout(nextQuestion, survey?.questions[numberQuestion]?.lifetimeSeconds * 1000);
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

  const submit = async () => {
    let surveyId = 1;
    let answers = [1, 2, 3];

    if (currentAccount) {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const surveyContract = new ethers.Contract(contractAddress, contractABI, signer);

          setLoadingTxn(true);
          const waveTxn = await surveyContract.submit(surveyId, answers);

          await waveTxn.wait();
          setLoadingTxn(false);

          getTotalQuiz();
          setAnswers([]);
        } else {
          setMessage("Ethereum object doesn't exist!");
        }
      } catch (error) {
        setMessage(error.message);
        setLoadingTxn(false);
      }
    } else {
      setMessage("Not authorized account found");
      setLoadingTxn(false);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        setMessage("Get Metamask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts) {
        setMessage("You need to connect and account in Metamask!");
      } else {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      setMessage(error);
    }
  };

  return (
    <div className={styles.App}>
      {survey && (
        <>
          {message && <Alert message={message} banner />}
          <HeadSurvey
            survey={survey}
            startedSurvey={startedSurvey}
            beginSurvey={beginSurvey}
            connectWallet={connectWallet}
          />
          {currentAccount && <h2 className={styles.balance}>Balance QUIZ: {totalQuiz}</h2>}
          <Questions
            survey={survey}
            numberQuestion={numberQuestion}
            timer={timer}
            handleOnChangeOption={handleOnChangeOption}
            optionSelected={RefOption.current}
          />
          <Answers answers={answers} startedSurvey={startedSurvey} />

          {answers.length > 0 && !startedSurvey && currentAccount && (
            <Row justify="center" className={styles.btnSubmit} gutter={[16, 16]}>
              <Col xs={10} sm={10} md={10} lg={8} xl={10}>
                <Button loading={loadingTxn} onClick={submit} type="primary" style={{ marginLeft: 8 }}>
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
