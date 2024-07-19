import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const targetTime = new Date(targetDate).getTime();
    const timeDifference = targetTime - now;

    if (timeDifference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  },);

  return (
    <div className="d-flex h-full flex-column items-center justify-content-center  gap-8">
          <div className="d-flex justify-content-center  gap-1 px-6 lg:gap-3">
              <div className="d-flex flex-column items-center justify-content-center ">
                  <div className="min-w-[3.5rem] rounded-xl px-3 text-center"><span className="text-xl font-bold lg:text-3xl">{timeLeft.days}</span></div>
                  <span className="text-xs text-uppercase text-secondary lg:text-sm">Days</span>
              </div>
              <span className=" text-xl font-bold lg:text-3xl">:</span>
              <div className="d-flex flex-column items-center justify-content-center ">
                  <div className="min-w-[3.5rem] rounded-xl px-3 text-center"><span className="text-xl font-bold lg:text-3xl">{timeLeft.hours}</span></div>
                  <span className="text-xs text-uppercase text-secondary lg:text-sm">Hours</span>
              </div>
              <span className=" text-xl font-bold lg:text-3xl">:</span>
              <div className="d-flex flex-column items-center justify-content-center ">
                  <div className="min-w-[3.5rem] rounded-xl px-3 text-center"><span className="text-xl font-bold lg:text-3xl">{timeLeft.minutes}</span></div>
                  <span className="text-xs text-uppercase text-secondary lg:text-sm">Minutes</span>
              </div>
              <span className=" text-xl font-bold lg:text-3xl">:</span>
              <div className="d-flex flex-column items-center justify-content-center ">
                  <div className="min-w-[3.5rem] rounded-xl px-3 text-center"><span className="text-xl font-bold lg:text-3xl">{timeLeft.seconds}</span></div>
                  <span className="text-xs text-uppercase text-secondary lg:text-sm">Seconds</span>
              </div>
          </div>
      </div>
  );
};

export default CountdownTimer;