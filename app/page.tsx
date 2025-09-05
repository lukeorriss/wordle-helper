"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { FALLBACK_WORDS } from "@/lib/wordlist";

type LetterState = "correct" | "present" | "absent" | "unknown";

interface GuessLetter {
  letter: string;
  state: LetterState;
}

interface Guess {
  id: string;
  letters: GuessLetter[];
}

export default function WordleHelper() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [possibleWords, setPossibleWords] = useState<string[]>([]);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://darkermango.github.io/5-Letter-words/words.json");
        if (!response.ok) {
          throw new Error("API not available");
        }
        const words = await response.json();
        if (Array.isArray(words.words) && words.words.length > 0) {
          setAllWords(words.words);
          setPossibleWords(words.words);
        } else {
          throw new Error("Invalid API response");
        }
        setError(null);
      } catch (err) {
        console.log("API failed, using fallback word list");
        setAllWords(FALLBACK_WORDS);
        setPossibleWords(FALLBACK_WORDS);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  const filterWords = (guesses: Guess[]) => {
    if (!Array.isArray(allWords)) return [];

    const filteredWords = allWords.filter((word) => {
      word = word.toUpperCase();
      // Track letter counts for "present" and "absent" logic
      let isValid = true;

      for (const guess of guesses) {
        // For each guess, build up letter state maps
        const correctLetters: Record<number, string> = {};
        const presentLetters: string[] = [];
        const absentLetters: string[] = [];

        // First, collect info from the guess
        guess.letters.forEach((guessLetter, idx) => {
          if (guessLetter.state === "correct") {
            correctLetters[idx] = guessLetter.letter;
          } else if (guessLetter.state === "present") {
            presentLetters.push(guessLetter.letter);
          } else if (guessLetter.state === "absent") {
            absentLetters.push(guessLetter.letter);
          }
        });

        // Check "correct" positions
        for (const idx in correctLetters) {
          if (word[Number(idx)] !== correctLetters[idx]) {
            isValid = false;
            break;
          }
        }
        if (!isValid) break;

        // Check "present" letters: must be in word, but NOT at that position
        guess.letters.forEach((guessLetter, idx) => {
          if (guessLetter.state === "present") {
            if (word[idx] === guessLetter.letter) {
              isValid = false;
            }
            if (!word.includes(guessLetter.letter)) {
              isValid = false;
            }
          }
        });
        if (!isValid) break;

        // For "absent" letters: must NOT be in word, UNLESS that letter is marked as "correct" or "present" elsewhere in this guess
        guess.letters.forEach((guessLetter, idx) => {
          if (guessLetter.state === "absent") {
            // If this letter is marked as "correct" or "present" elsewhere in this guess, allow it at those positions
            const isElsewhereCorrectOrPresent = guess.letters.some((l, i) => l.letter === guessLetter.letter && i !== idx && (l.state === "correct" || l.state === "present"));
            if (isElsewhereCorrectOrPresent) {
              // Only disallow at this position
              if (word[idx] === guessLetter.letter) {
                isValid = false;
              }
            } else {
              // Disallow anywhere in the word
              if (word.includes(guessLetter.letter)) {
                isValid = false;
              }
            }
          }
        });
        if (!isValid) break;
      }
      return isValid;
    });
    return filteredWords;
  };

  const addGuess = () => {
    if (currentGuess.length !== 5) return;

    const newGuess: Guess = {
      id: Date.now().toString(),
      letters: currentGuess.split("").map((letter) => ({
        letter: letter.toUpperCase(),
        state: "unknown" as LetterState,
      })),
    };

    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);
    setCurrentGuess("");
    setPossibleWords(filterWords(updatedGuesses));
  };

  const toggleLetterState = (guessId: string, letterIndex: number) => {
    const updatedGuesses = guesses.map((guess) => {
      if (guess.id === guessId) {
        const updatedLetters = guess.letters.map((letter, index) => {
          if (index === letterIndex) {
            const states: LetterState[] = ["unknown", "correct", "present", "absent"];
            const currentIndex = states.indexOf(letter.state);
            const nextIndex = (currentIndex + 1) % states.length;
            return { ...letter, state: states[nextIndex] };
          }
          return letter;
        });
        return { ...guess, letters: updatedLetters };
      }
      return guess;
    });

    setGuesses(updatedGuesses);
    setPossibleWords(filterWords(updatedGuesses));
  };

  const removeGuess = (guessId: string) => {
    const updatedGuesses = guesses.filter((guess) => guess.id !== guessId);
    setGuesses(updatedGuesses);
    setPossibleWords(filterWords(updatedGuesses));
  };

  const getLetterStateColor = (state: LetterState) => {
    switch (state) {
      case "correct":
        return "bg-[#6CA965] text-white";
      case "present":
        return "bg-[#c8b653] text-white";
      case "absent":
        return "bg-[#787c7f] text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getLetterStateLabel = (state: LetterState) => {
    switch (state) {
      case "correct":
        return "Correct position";
      case "present":
        return "Wrong position";
      case "absent":
        return "Not in word";
      default:
        return "Click to set";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading word dictionary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wordle Helper</h1>
          <p className="text-gray-600">Enter your guesses and mark each letter to find possible answers</p>
          <p className="text-sm text-gray-500 mt-1">Using {allWords.length} words from dictionary</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Your Guess</CardTitle>
            <CardDescription>Enter a 5-letter word you've tried in Wordle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter 5-letter word"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toUpperCase().slice(0, 5))}
                onKeyPress={(e) => e.key === "Enter" && addGuess()}
                className="flex-1"
                maxLength={5}
              />
              <Button onClick={addGuess} disabled={currentGuess.length !== 5 || guesses.length >= 6} className="bg-slate-900 text-white hover:bg-slate-800 disabled:bg-gray-300 disabled:text-gray-500">
                Add Guess
              </Button>
            </div>
            {guesses.length >= 6 && <p className="text-sm text-gray-500 mt-2">Maximum 6 guesses reached</p>}
          </CardContent>
        </Card>

        {guesses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Guesses</CardTitle>
              <CardDescription>Click each letter to mark it as correct (green), wrong position (yellow), or not in word (gray)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {guesses.map((guess) => (
                  <div key={guess.id} className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {guess.letters.map((letter, index) => (
                        <button
                          key={index}
                          onClick={() => toggleLetterState(guess.id, index)}
                          className={`w-12 h-12 rounded border-2 font-bold text-lg transition-colors ${getLetterStateColor(letter.state)}`}
                          title={getLetterStateLabel(letter.state)}
                        >
                          {letter.letter}
                        </button>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeGuess(guess.id)} className="ml-2">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Possible Words ({possibleWords.length})</CardTitle>
            <CardDescription>Words that match your current constraints</CardDescription>
          </CardHeader>
          <CardContent>
            {!Array.isArray(possibleWords) || possibleWords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No words match your current constraints. Check your guesses!</p>
            ) : possibleWords.length > 100 ? (
              <div>
                <p className="text-gray-600 mb-4">Too many possibilities ({possibleWords.length} words). Add more guesses to narrow it down!</p>
                <div className="flex flex-wrap gap-2">
                  {possibleWords.slice(0, 50).map((word) => (
                    <Badge key={word} variant="secondary">
                      {word}
                    </Badge>
                  ))}
                  <Badge variant="outline">+{possibleWords.length - 50} more...</Badge>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {possibleWords.map((word) => (
                  <Badge key={word} variant="secondary">
                    {word}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
