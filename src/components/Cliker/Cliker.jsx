import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ClickerGame = ({ isLoading }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft > 0 && isLoading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isLoading]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {isLoading && timeLeft > 0 ? (
        <>
          <h2>Тицяй на кнопку поки чекаєш !</h2>
          <p>Кліків: {score}</p>
          <p>До кінця залишилось: {timeLeft} сек.</p>
          <button
            onClick={() => setScore(score + 1)}
            style={{
              padding: "10px 20px",
              fontSize: "18px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Клікай!
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setScore(0);
              setTimeLeft(10);
            }}
            style={{
              padding: "10px 20px",
              fontSize: "18px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Почати знову
          </button>
          <h3>Гра закінчилась! Твій результат:</h3>
          <p> {score} кліків</p>
        </>
      )}
    </div>
  );
};

ClickerGame.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default ClickerGame;
