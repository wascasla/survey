export const getSurveyService = async () => {
  const response = await fetch(
    "https://ratherlabs-challenges.s3.sa-east-1.amazonaws.com/survey-sample.json"
  );
  const survey = await response.json();
  return survey;
};
