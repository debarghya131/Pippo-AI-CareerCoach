"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { demoQuizQuestions } from "@/lib/demo-data";

export default function Quiz({ isDemoMode = false }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  const activeQuizData = isDemoMode ? demoQuizQuestions : quizData;

  useEffect(() => {
    if (activeQuizData) {
      setAnswers(new Array(activeQuizData.length).fill(null));
    }
  }, [activeQuizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < activeQuizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === activeQuizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / activeQuizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    if (isDemoMode) {
      const questionResults = activeQuizData.map((question, index) => ({
        question: question.question,
        answer: question.correctAnswer,
        userAnswer: answers[index],
        isCorrect: question.correctAnswer === answers[index],
        explanation: question.explanation,
      }));

      const wrongAnswers = questionResults.filter((question) => !question.isCorrect);
      const improvementTip = wrongAnswers.length
        ? "Review debugging, validation, and tradeoff reasoning before your next round. Those themes usually create the biggest score jump."
        : "Strong work. Your answers show solid fundamentals and clear reasoning under interview-style pressure.";

      setResultData({
        id: "demo-quiz-result",
        userId: "demo-user",
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.success("Demo quiz completed!");
      return;
    }

    const savedResult = await saveQuizResultFn(activeQuizData, answers, score);
    if (savedResult) {
      toast.success("Quiz completed!");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setResultData(null);

    if (!isDemoMode) {
      generateQuizFn();
    }
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // Show results if quiz is completed
  if (resultData) {
    return (
      <div className="mx-0 sm:mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!activeQuizData) {
    return (
      <Card className="mx-0 sm:mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
          {isDemoMode && (
            <p className="mt-3 text-sm text-amber-200">
              Demo mode lets you explore the screen, but quiz generation and
              saving are disabled until you sign in.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuizFn} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = activeQuizData[currentQuestion];

  return (
    <Card className="mx-0 sm:mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {activeQuizData.length}
        </CardTitle>
        {isDemoMode && (
          <p className="text-sm text-amber-200">
            Demo quiz answers stay local to this preview and are not saved.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 rounded-lg border border-border/60 px-3 py-3"
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="leading-6">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
            className="w-full sm:w-auto"
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="w-full sm:ml-auto sm:w-auto"
        >
          {savingResult && (
            <BarLoader className="mt-4" width={"100%"} color="gray" />
          )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
