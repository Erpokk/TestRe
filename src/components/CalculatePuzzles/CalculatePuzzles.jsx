import { useState, useCallback, useMemo, useRef } from "react";
import Section from "../Section/Section";
import Container from "../Container/Container";
import css from "./CalculatePuzzles.module.css";
import fileToNumArray from "../../utils/fileToNumArray";
import ClickerGame from "../Cliker/Cliker";

const CalculatePuzzles = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [result, setResult] = useState({
    withSeparator: "",
    withoutSeparator: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const prevPuzzlesArrayRef = useRef(null);
  const prevWorkerResultRef = useRef(null);

  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target.result);
      reader.readAsText(selectedFile);
    }
  }, []);

  const puzzlesArray = useMemo(() => {
    return fileContent ? fileToNumArray(fileContent) : [];
  }, [fileContent]);

  const processFile = useCallback(async () => {
    if (!file) {
      alert("Завантажте файл");
      return;
    }

    setIsLoading(true);

    if (
      prevPuzzlesArrayRef.current &&
      JSON.stringify(prevPuzzlesArrayRef.current) ===
        JSON.stringify(puzzlesArray)
    ) {
      console.log("Використовуємо кешований результат");
      setResult(prevWorkerResultRef.current);
      setIsLoading(false);
      return;
    }

    console.log("Запускаємо новий Web Worker");

    prevPuzzlesArrayRef.current = puzzlesArray;

    const worker = new Worker("/src/utils/puzzleWorker.js");
    worker.postMessage({ fragments: puzzlesArray });

    worker.onmessage = (event) => {
      prevWorkerResultRef.current = event.data;
      setResult(event.data);
      setIsLoading(false);
      worker.terminate();
    };
  }, [file, puzzlesArray]);

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
