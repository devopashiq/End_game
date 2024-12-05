import { useState } from "react";
import { languages } from "./languages";
import { clsx } from "clsx";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from "react-confetti";
import useWindowSize from "./hooks/useWindowSize.js";

export default function App() {
  const { width, height } = useWindowSize();
  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedwords, setGuessedWords] = useState([]);

  console.log(currentWord);

  // Derived values
  const wrongGuessCount = guessedwords.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = [...currentWord].every((letter) =>
    guessedwords.includes(letter)
  );
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedwords[guessedwords.length - 1];
  const farewellText = getFarewellText(
    languages[wrongGuessCount - 1]?.name || ""
  );

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function newGame() {
    setCurrentWord(getRandomWord());
    setGuessedWords([]);
  }

  function handleClick(letter) {
    setGuessedWords((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  const words = currentWord.split("").map((letter, index) => {
    const isRevealed = isGameLost || guessedwords.includes(letter);
    const classMissed = clsx({
      missed: isGameLost && !guessedwords.includes(letter),
    });

    return (
      <span className={classMissed} key={index}>
        {isRevealed ? letter.toUpperCase() : ""}
      </span>
    );
  });
  const languageElements = languages.map((lang, index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    const isLanguageLost = index < wrongGuessCount;

    const className = clsx("chip", isLanguageLost && "lost");

    return (
      <span className={className} style={styles} key={index}>
        {lang.name}
      </span>
    );
  });

  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedwords.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const classnames = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={classnames}
        key={letter}
        onClick={() => handleClick(letter)}
        disabled={isGameOver}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && wrongGuessCount > 0,
  });

  function renderGameStatus() {
    if (!isGameOver && wrongGuessCount > 0) {
      return <p className="farewell-message">{farewellText}</p>;
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }
    return null;
  }

  return (
    <main>
      {isGameWon && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={1000}
        />
      )}
      <header className="header">
        <h1 className="header_title">Assembly: Endgame</h1>
        <p className="header_paragragh">
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="language-chips">{languageElements}</section>
      {/* Combined visually-hidden aria-live region for status updates */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(guessedwords)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
          You have {languages.length - 1 - wrongGuessCount} attempts left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedwords.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>
      <section className="word_contianers">{words}</section>
      <section className="keyboard">{keyboardElements}</section>
      {isGameOver && (
        <button onClick={newGame} className="new-game">
          New Game
        </button>
      )}
    </main>
  );
}
