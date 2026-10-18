import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, RotateCcw, Sparkles, X } from 'lucide-react';
import type { QuizQuestion } from '../data/birthdayConfig';

interface QuizChallengeProps {
  questions: QuizQuestion[];
  reducedMotion: boolean;
}

export default function QuizChallenge({ questions, reducedMotion }: QuizChallengeProps) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const question = questions[step];

  const restart = () => {
    setStep(0);
    setScore(0);
    setPicked(null);
    setFinished(false);
  };

  const pick = (optionIndex: number) => {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (optionIndex === question.correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (step + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setStep((s) => s + 1);
    setPicked(null);
  };

  const verdict =
    score === questions.length
      ? 'Flawless. Suspiciously flawless.'
      : score >= questions.length - 1
        ? 'Almost perfect — we are proud and slightly concerned.'
        : score >= Math.ceil(questions.length / 2)
          ? 'Solid. You know us, you simply refuse to admit it.'
          : 'Bold answers. Wrong answers, but bold.';

  return (
    <div className="glass quiz">
      {finished ? (
        <div className="quiz__result">
          <Sparkles size={26} aria-hidden style={{ color: 'var(--gold)' }} />
          <p className="quiz__result-score">
            {score} / {questions.length}
          </p>
          <p className="chapter__lead">{verdict}</p>
          <button type="button" className="btn" onClick={restart}>
            <RotateCcw size={16} aria-hidden /> Play again
          </button>
        </div>
      ) : (
        <>
          <div className="quiz__progress" aria-hidden="true">
            {questions.map((_, index) => (
              <span
                key={index}
                className={`quiz__progress-seg${index <= step ? ' is-done' : ''}`}
              />
            ))}
          </div>

          <p className="quiz__score">
            Question {step + 1} of {questions.length} · Score {score}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reducedMotion ? 0 : 0.28 }}
            >
              <h3 className="quiz__question">{question.question}</h3>
              <div className="quiz__options" role="group" aria-label="Answers">
                {question.options.map((option, index) => {
                  const isCorrect = index === question.correctIndex;
                  const isPicked = picked === index;
                  const stateClass =
                    picked === null
                      ? ''
                      : isCorrect
                        ? ' is-correct'
                        : isPicked
                          ? ' is-wrong'
                          : '';
                  return (
                    <button
                      key={`${question.id}-option-${index}`}
                      type="button"
                      className={`quiz__option${stateClass}`}
                      onClick={() => pick(index)}
                      disabled={picked !== null}
                    >
                      <span>{option}</span>
                      {picked !== null && isCorrect ? (
                        <Check size={17} aria-hidden style={{ color: '#7fdca4' }} />
                      ) : null}
                      {picked !== null && isPicked && !isCorrect ? (
                        <X size={17} aria-hidden style={{ color: '#f09aa9' }} />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {picked !== null ? (
                <p className="quiz__feedback" role="status">
                  {question.feedback}
                </p>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="quiz__footer">
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={next}
              disabled={picked === null}
            >
              {step + 1 >= questions.length ? 'See my score' : 'Next question'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
