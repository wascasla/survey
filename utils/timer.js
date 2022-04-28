export const getTimeRemaining = (e) => {
  const total = Date.parse(e) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  return {
    total,
    seconds,
  };
};

export const startTimer = (e, setTimer) => {
  let { total, seconds } = getTimeRemaining(e);
  if (total >= 0) {
    setTimer(seconds > 9 ? seconds : "0" + seconds);
  }
};

export const clearTimer = (e, time, itemRefTimer, setTimer) => {
  setTimer("0" + time);
  if (itemRefTimer) clearInterval(itemRefTimer);
  const id = setInterval(() => {
    startTimer(e, setTimer);
  }, 1000);
  itemRefTimer = id;
};

export const getDeadTime = (time) => {
  let deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + time);
  return deadline;
};

export const deleteTimer = (id) => {
  clearTimeout(id);
};
