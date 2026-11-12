// FILE: lib/discipline.ts

export type DisciplineQuote = {
  text: string
  author: string
}

export const DISCIPLINE_QUOTES: DisciplineQuote[] = [
  {
    text: "You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.",
    author: "David Goggins",
  },
  {
    text: "When you think you're done, you're only at forty percent of your body's capability.",
    author: "David Goggins",
  },
  {
    text: "The most important conversations you'll ever have are the ones you'll have with yourself.",
    author: "David Goggins",
  },
  {
    text: "You must be willing to go to war with yourself.",
    author: "David Goggins",
  },
  {
    text: "Discipline equals freedom.",
    author: "Jocko Willink",
  },
  {
    text: "There is no easy way. There is only hard work, late nights, early mornings, practice, and pain.",
    author: "Jocko Willink",
  },
  {
    text: "It's not who I am underneath, but what I do that defines me.",
    author: "Bruce Wayne",
  },
  {
    text: "Why do we fall? So we can learn to pick ourselves up.",
    author: "Bruce Wayne",
  },
  {
    text: "The training is nothing. The will is everything.",
    author: "Bruce Wayne",
  },
  {
    text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
  },
  {
    text: "The most important thing is to be honest with yourself about where you are.",
    author: "Joe Rogan",
  },
  {
    text: "Do nothing that is of no use.",
    author: "Miyamoto Musashi",
  },
  {
    text: "Today is victory over yourself of yesterday. Tomorrow is your victory over lesser men.",
    author: "Miyamoto Musashi",
  },
  {
    text: "I don't stop when I'm tired. I stop when I'm done.",
    author: "David Goggins",
  },
  {
    text: "Train your mind the way you train your body. Every single day.",
    author: "Bruce Wayne",
  },
]

export function pickQuote(seed?: number): DisciplineQuote {
  const i =
    seed === undefined
      ? Math.floor(Math.random() * DISCIPLINE_QUOTES.length)
      : Math.abs(seed) % DISCIPLINE_QUOTES.length
  return DISCIPLINE_QUOTES[i]
}