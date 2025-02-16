import { useState } from "react";
import Section from "../Section/Section";
import Container from "../Container/Container";
import css from "./CalculatePuzzles.module.css";
import fileToNumArray from "../../utils/fileToNumArray";
import ClickerGame from "../Cliker/Cliker";

const CalculatePuzzles = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState({
    withSeparator: "",
    withoutSeparator: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const processFile = async () => {
    if (!file) {
      alert("Завантажте файл");
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    const fileContent = await new Promise((resolve, reject) => {
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });

    const puzzlesArray = fileToNumArray(fileContent);

    const worker = new Worker(
      new URL("../../utils/puzzleWorker.js", import.meta.url),
      {
        type: "module",
      }
    );
    worker.postMessage({ fragments: puzzlesArray });

    worker.onmessage = (event) => {
      setResult(event.data);
      setIsLoading(false);
      worker.terminate();
    };
  };

  return (
    <Section>
      <Container>
        <div className={css.textWrapper}>
          <h1>Задача</h1>
          <h2>Скласти найбільший однорядний цифровий пазл.</h2>
          <p>
            Чи любите ви пазли? Давайте складемо з вами цифровий пазл, де
            елементами з`єднання будуть перші або останні ДВІ цифри. Для
            спрощення завдання будемо використовувати однорядний пазл, де його
            фрагменти можуть розміщуватись тільки слідуючи один за одним.
          </p>
          <p>Наприклад, маємо такі рядки із числами:</p>
          <p>608017, 248460, 962282, 994725, 177092</p>
          <p>Рішення:</p>
          <p>Аналізуючи кінцеві частини, можна скласти такий ланцюжок:</p>
          <p>248460 & 608017 & 177092 - 2484(60)80(17)7092</p>
          <p>
            Таким чином найбільша послідовність і відповідь буде: 24846080177092
          </p>
          <img
            src="/testExample.webp"
            loading="lazy"
            alt="Example of Puzzle Variation"
          />
        </div>
        <div className={css.inputContainer}>
          <input type="file" accept=".txt" onChange={handleFileChange} />
          <button onClick={processFile} disabled={isLoading}>
            {isLoading ? "Обробка..." : "Прочитати файл"}
          </button>
        </div>

        {isLoading && <ClickerGame isLoading={isLoading} />}

        {!isLoading && (
          <>
            <pre className={css.output} id="output">
              {result.withSeparator}
            </pre>
            <pre className={css.output} id="output">
              {result.withoutSeparator}
            </pre>
          </>
        )}
      </Container>
    </Section>
  );
};

export default CalculatePuzzles;
