export type IdeaGroup = { slug: string; title: string; intro: string; questions: string[] };

/** Question ideas: shown as chips on the home page and in full on /ideas. */
export const IDEA_GROUPS: IdeaGroup[] = [
  {
    slug: "about-you",
    title: "About you",
    intro: "Find out how people see you when they don't have to be polite.",
    questions: [
      "What was your first impression of me?",
      "Describe me in three words",
      "Rate my vibe out of 10",
      "What do people get wrong about me?",
      "What's my most annoying habit?",
      "What's one thing I'm better at than I think?",
      "Which song reminds you of me?",
      "If I were a food, what would I be?",
      "What should I stop doing?",
      "What's something you've always wanted to tell me?",
    ],
  },
  {
    slug: "crushes-and-love",
    title: "Crushes and love",
    intro: "The questions everyone wants answered and nobody asks out loud.",
    questions: [
      "Who loves me?",
      "Do you have a crush on me?",
      "Who should I ask out?",
      "Would you date me? Be honest",
      "What's my type, in your opinion?",
      "Who in our group is secretly in love?",
      "What's the best date idea you've never tried?",
      "Describe your perfect partner",
    ],
  },
  {
    slug: "friends",
    title: "Friends and groups",
    intro: "Good for class groups, hostel rooms and old friends.",
    questions: [
      "Which of my friends is the funniest?",
      "What's your favourite memory with me?",
      "Who in our group would survive a zombie apocalypse?",
      "What inside joke should never die?",
      "Who's the real leader of our group?",
      "What should our next trip be?",
      "Who texts back the slowest?",
      "What's one thing our group should do more often?",
    ],
  },
  {
    slug: "honest-feedback",
    title: "Honest feedback",
    intro: "For creators, students and teams who want the truth, not compliments.",
    questions: [
      "What should I post more of?",
      "What's one thing I could do better at work?",
      "Was my last presentation any good?",
      "What's your honest opinion of my style?",
      "What should I learn next?",
      "What's holding me back?",
      "Which of my projects do you like most?",
      "What would you change about my profile?",
    ],
  },
  {
    slug: "fun-and-random",
    title: "Fun and random",
    intro: "Easy questions that get lots of answers.",
    questions: [
      "Tell me a secret",
      "Confess something to me",
      "What's your unpopular opinion?",
      "What's the last thing that made you laugh?",
      "What's your guilty pleasure show?",
      "Recommend me a movie",
      "What's the best advice you've ever got?",
      "What would you do with a million rupees?",
      "Chai or coffee?",
      "What's your hidden talent?",
    ],
  },
];

export const HOME_IDEAS = [
  "Who loves me?",
  "What was your first impression of me?",
  "Rate my vibe out of 10",
  "What should I stop doing?",
  "Tell me a secret",
];
