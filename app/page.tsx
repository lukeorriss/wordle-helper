"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

const FALLBACK_WORDS = [
  "ABOUT",
  "ABOVE",
  "ABUSE",
  "ACTOR",
  "ACUTE",
  "ADMIT",
  "ADOPT",
  "ADULT",
  "AFTER",
  "AGAIN",
  "AGENT",
  "AGREE",
  "AHEAD",
  "ALARM",
  "ALBUM",
  "ALERT",
  "ALIEN",
  "ALIGN",
  "ALIKE",
  "ALIVE",
  "ALLOW",
  "ALONE",
  "ALONG",
  "ALTER",
  "AMONG",
  "ANGER",
  "ANGLE",
  "ANGRY",
  "APART",
  "APPLE",
  "APPLY",
  "ARENA",
  "ARGUE",
  "ARISE",
  "ARRAY",
  "ASIDE",
  "ASSET",
  "AUDIO",
  "AUDIT",
  "AVOID",
  "AWAKE",
  "AWARD",
  "AWARE",
  "BADLY",
  "BAKER",
  "BASES",
  "BASIC",
  "BEACH",
  "BEGAN",
  "BEGIN",
  "BEING",
  "BELOW",
  "BENCH",
  "BILLY",
  "BIRTH",
  "BLACK",
  "BLAME",
  "BLANK",
  "BLAST",
  "BLIND",
  "BLOCK",
  "BLOOD",
  "BOARD",
  "BOAST",
  "BOATS",
  "BOBBY",
  "BONDS",
  "BOOST",
  "BOOTH",
  "BOUND",
  "BRAIN",
  "BRAND",
  "BRASS",
  "BRAVE",
  "BREAD",
  "BREAK",
  "BREED",
  "BRIEF",
  "BRING",
  "BROAD",
  "BROKE",
  "BROWN",
  "BUILD",
  "BUILT",
  "BUYER",
  "CABLE",
  "CALIF",
  "CARRY",
  "CATCH",
  "CAUSE",
  "CHAIN",
  "CHAIR",
  "CHAOS",
  "CHARM",
  "CHART",
  "CHASE",
  "CHEAP",
  "CHECK",
  "CHEST",
  "CHIEF",
  "CHILD",
  "CHINA",
  "CHOSE",
  "CIVIL",
  "CLAIM",
  "CLASS",
  "CLEAN",
  "CLEAR",
  "CLICK",
  "CLIMB",
  "CLOCK",
  "CLOSE",
  "CLOUD",
  "COACH",
  "COAST",
  "COULD",
  "COUNT",
  "COURT",
  "COVER",
  "CRAFT",
  "CRASH",
  "CRAZY",
  "CREAM",
  "CRIME",
  "CROSS",
  "CROWD",
  "CROWN",
  "CRUDE",
  "CURVE",
  "CYCLE",
  "DAILY",
  "DANCE",
  "DATED",
  "DEALT",
  "DEATH",
  "DEBUT",
  "DELAY",
  "DEPTH",
  "DOING",
  "DOUBT",
  "DOZEN",
  "DRAFT",
  "DRAMA",
  "DRANK",
  "DRAWN",
  "DREAM",
  "DRESS",
  "DRILL",
  "DRINK",
  "DRIVE",
  "DROVE",
  "DYING",
  "EAGER",
  "EARLY",
  "EARTH",
  "EIGHT",
  "ELITE",
  "EMPTY",
  "ENEMY",
  "ENJOY",
  "ENTER",
  "ENTRY",
  "EQUAL",
  "ERROR",
  "EVENT",
  "EVERY",
  "EXACT",
  "EXIST",
  "EXTRA",
  "FAITH",
  "FALSE",
  "FAULT",
  "FIBER",
  "FIELD",
  "FIFTH",
  "FIFTY",
  "FIGHT",
  "FINAL",
  "FIRST",
  "FIXED",
  "FLASH",
  "FLEET",
  "FLOOR",
  "FLUID",
  "FOCUS",
  "FORCE",
  "FORTH",
  "FORTY",
  "FORUM",
  "FOUND",
  "FRAME",
  "FRANK",
  "FRAUD",
  "FRESH",
  "FRONT",
  "FRUIT",
  "FULLY",
  "FUNNY",
  "GIANT",
  "GIVEN",
  "GLASS",
  "GLOBE",
  "GOING",
  "GRACE",
  "GRADE",
  "GRAND",
  "GRANT",
  "GRASS",
  "GRAVE",
  "GREAT",
  "GREEN",
  "GROSS",
  "GROUP",
  "GROWN",
  "GUARD",
  "GUESS",
  "GUEST",
  "GUIDE",
  "HAPPY",
  "HARRY",
  "HEART",
  "HEAVY",
  "HENCE",
  "HENRY",
  "HORSE",
  "HOTEL",
  "HOUSE",
  "HUMAN",
  "IDEAL",
  "IMAGE",
  "INDEX",
  "INNER",
  "INPUT",
  "ISSUE",
  "JAPAN",
  "JIMMY",
  "JOINT",
  "JONES",
  "JUDGE",
  "KNOWN",
  "LABEL",
  "LARGE",
  "LASER",
  "LATER",
  "LAUGH",
  "LAYER",
  "LEARN",
  "LEASE",
  "LEAST",
  "LEAVE",
  "LEGAL",
  "LEVEL",
  "LEWIS",
  "LIGHT",
  "LIMIT",
  "LINKS",
  "LIVES",
  "LOCAL",
  "LOOSE",
  "LOWER",
  "LUCKY",
  "LUNCH",
  "LYING",
  "MAGIC",
  "MAJOR",
  "MAKER",
  "MARCH",
  "MARIA",
  "MATCH",
  "MAYBE",
  "MAYOR",
  "MEANT",
  "MEDIA",
  "METAL",
  "MIGHT",
  "MINOR",
  "MINUS",
  "MIXED",
  "MODEL",
  "MONEY",
  "MONTH",
  "MORAL",
  "MOTOR",
  "MOUNT",
  "MOUSE",
  "MOUTH",
  "MOVED",
  "MOVIE",
  "MUSIC",
  "NEEDS",
  "NEVER",
  "NEWLY",
  "NIGHT",
  "NOISE",
  "NORTH",
  "NOTED",
  "NOVEL",
  "NURSE",
  "OCCUR",
  "OCEAN",
  "OFFER",
  "OFTEN",
  "ORDER",
  "OTHER",
  "OUGHT",
  "PAINT",
  "PANEL",
  "PAPER",
  "PARTY",
  "PEACE",
  "PETER",
  "PHASE",
  "PHONE",
  "PHOTO",
  "PIANO",
  "PICKED",
  "PIECE",
  "PILOT",
  "PITCH",
  "PLACE",
  "PLAIN",
  "PLANE",
  "PLANT",
  "PLATE",
  "POINT",
  "POUND",
  "POWER",
  "PRESS",
  "PRICE",
  "PRIDE",
  "PRIME",
  "PRINT",
  "PRIOR",
  "PRIZE",
  "PROOF",
  "PROUD",
  "PROVE",
  "QUEEN",
  "QUICK",
  "QUIET",
  "QUITE",
  "RADIO",
  "RAISE",
  "RANGE",
  "RAPID",
  "RATIO",
  "REACH",
  "READY",
  "REALM",
  "REBEL",
  "REFER",
  "RELAX",
  "REPAY",
  "REPLY",
  "RIGHT",
  "RIGID",
  "RIVAL",
  "RIVER",
  "ROBIN",
  "ROGER",
  "ROMAN",
  "ROUGH",
  "ROUND",
  "ROUTE",
  "ROYAL",
  "RURAL",
  "SCALE",
  "SCENE",
  "SCOPE",
  "SCORE",
  "SENSE",
  "SERVE",
  "SEVEN",
  "SHALL",
  "SHAPE",
  "SHARE",
  "SHARP",
  "SHEET",
  "SHELF",
  "SHELL",
  "SHIFT",
  "SHINE",
  "SHIRT",
  "SHOCK",
  "SHOOT",
  "SHORT",
  "SHOWN",
  "SIGHT",
  "SINCE",
  "SIXTH",
  "SIXTY",
  "SIZED",
  "SKILL",
  "SLEEP",
  "SLIDE",
  "SMALL",
  "SMART",
  "SMILE",
  "SMITH",
  "SMOKE",
  "SNAKE",
  "SNOW",
  "SOLID",
  "SOLVE",
  "SORRY",
  "SOUND",
  "SOUTH",
  "SPACE",
  "SPARE",
  "SPEAK",
  "SPEED",
  "SPEND",
  "SPENT",
  "SPLIT",
  "SPOKE",
  "SPORT",
  "STAFF",
  "STAGE",
  "STAKE",
  "STAND",
  "START",
  "STATE",
  "STEAM",
  "STEEL",
  "STEEP",
  "STEER",
  "STICK",
  "STILL",
  "STOCK",
  "STONE",
  "STOOD",
  "STORE",
  "STORM",
  "STORY",
  "STRIP",
  "STUCK",
  "STUDY",
  "STUFF",
  "STYLE",
  "SUGAR",
  "SUITE",
  "SUPER",
  "SWEET",
  "TABLE",
  "TAKEN",
  "TASTE",
  "TAXES",
  "TEACH",
  "TEAMS",
  "TEETH",
  "TERRY",
  "TEXAS",
  "THANK",
  "THEFT",
  "THEIR",
  "THEME",
  "THERE",
  "THESE",
  "THICK",
  "THING",
  "THINK",
  "THIRD",
  "THOSE",
  "THREE",
  "THREW",
  "THROW",
  "THUMB",
  "TIGHT",
  "TIRED",
  "TITLE",
  "TODAY",
  "TOPIC",
  "TOTAL",
  "TOUCH",
  "TOUGH",
  "TOWER",
  "TRACK",
  "TRADE",
  "TRAIN",
  "TREAT",
  "TREND",
  "TRIAL",
  "TRIBE",
  "TRICK",
  "TRIED",
  "TRIES",
  "TRUCK",
  "TRULY",
  "TRUNK",
  "TRUST",
  "TRUTH",
  "TWICE",
  "TWIST",
  "TYLER",
  "UNCLE",
  "UNDER",
  "UNDUE",
  "UNION",
  "UNITY",
  "UNTIL",
  "UPPER",
  "UPSET",
  "URBAN",
  "USAGE",
  "USUAL",
  "VALID",
  "VALUE",
  "VIDEO",
  "VIRUS",
  "VISIT",
  "VITAL",
  "VOCAL",
  "VOICE",
  "WASTE",
  "WATCH",
  "WATER",
  "WAVE",
  "WAYS",
  "WEIRD",
  "WELCOME",
  "WELLS",
  "WELSH",
  "WENT",
  "WERE",
  "WHAT",
  "WHEEL",
  "WHEN",
  "WHERE",
  "WHICH",
  "WHILE",
  "WHITE",
  "WHOLE",
  "WHOSE",
  "WOMAN",
  "WOMEN",
  "WORLD",
  "WORRY",
  "WORSE",
  "WORST",
  "WORTH",
  "WOULD",
  "WRITE",
  "WRONG",
  "WROTE",
  "YOUNG",
  "YOUTH",
  "ZERO",
]

type LetterState = "correct" | "present" | "absent" | "unknown"

interface GuessLetter {
  letter: string
  state: LetterState
}

interface Guess {
  id: string
  letters: GuessLetter[]
}

export default function WordleHelper() {
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [possibleWords, setPossibleWords] = useState<string[]>([])
  const [allWords, setAllWords] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://darkermango.github.io/5-Letter-words/words.json")
        if (!response.ok) {
          throw new Error("API not available")
        }
        const words = await response.json()
        if (Array.isArray(words) && words.length > 0) {
          setAllWords(words)
          setPossibleWords(words)
        } else {
          throw new Error("Invalid API response")
        }
        setError(null)
      } catch (err) {
        console.log("API failed, using fallback word list")
        setAllWords(FALLBACK_WORDS)
        setPossibleWords(FALLBACK_WORDS)
        setError(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWords()
  }, [])

  const filterWords = (guesses: Guess[]) => {
    if (!Array.isArray(allWords)) return []

    return allWords.filter((word) => {
      for (const guess of guesses) {
        for (let i = 0; i < 5; i++) {
          const guessLetter = guess.letters[i]
          const wordLetter = word[i]

          if (guessLetter.state === "correct") {
            if (wordLetter !== guessLetter.letter) {
              return false
            }
          } else if (guessLetter.state === "present") {
            if (wordLetter === guessLetter.letter) {
              return false
            }
            if (!word.includes(guessLetter.letter)) {
              return false
            }
          } else if (guessLetter.state === "absent") {
            if (word.includes(guessLetter.letter)) {
              return false
            }
          }
        }
      }
      return true
    })
  }

  const addGuess = () => {
    if (currentGuess.length !== 5) return

    const newGuess: Guess = {
      id: Date.now().toString(),
      letters: currentGuess.split("").map((letter) => ({
        letter: letter.toUpperCase(),
        state: "unknown" as LetterState,
      })),
    }

    const updatedGuesses = [...guesses, newGuess]
    setGuesses(updatedGuesses)
    setCurrentGuess("")
    setPossibleWords(filterWords(updatedGuesses))
  }

  const toggleLetterState = (guessId: string, letterIndex: number) => {
    const updatedGuesses = guesses.map((guess) => {
      if (guess.id === guessId) {
        const updatedLetters = guess.letters.map((letter, index) => {
          if (index === letterIndex) {
            const states: LetterState[] = ["unknown", "correct", "present", "absent"]
            const currentIndex = states.indexOf(letter.state)
            const nextIndex = (currentIndex + 1) % states.length
            return { ...letter, state: states[nextIndex] }
          }
          return letter
        })
        return { ...guess, letters: updatedLetters }
      }
      return guess
    })

    setGuesses(updatedGuesses)
    setPossibleWords(filterWords(updatedGuesses))
  }

  const removeGuess = (guessId: string) => {
    const updatedGuesses = guesses.filter((guess) => guess.id !== guessId)
    setGuesses(updatedGuesses)
    setPossibleWords(filterWords(updatedGuesses))
  }

  const getLetterStateColor = (state: LetterState) => {
    switch (state) {
      case "correct":
        return "bg-green-500 text-white"
      case "present":
        return "bg-yellow-500 text-white"
      case "absent":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getLetterStateLabel = (state: LetterState) => {
    switch (state) {
      case "correct":
        return "Correct position"
      case "present":
        return "Wrong position"
      case "absent":
        return "Not in word"
      default:
        return "Click to set"
    }
  }

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
    )
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
    )
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
              <Button
                onClick={addGuess}
                disabled={currentGuess.length !== 5 || guesses.length >= 6}
                className="bg-slate-900 text-white hover:bg-slate-800 disabled:bg-gray-300 disabled:text-gray-500"
              >
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
              <CardDescription>
                Click each letter to mark it as correct (green), wrong position (yellow), or not in word (gray)
              </CardDescription>
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
              <p className="text-gray-500 text-center py-4">
                No words match your current constraints. Check your guesses!
              </p>
            ) : possibleWords.length > 100 ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Too many possibilities ({possibleWords.length} words). Add more guesses to narrow it down!
                </p>
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
  )
}
