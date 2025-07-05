import type { Board } from "~/models/board";
import type { Category } from "~/models/category";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function balanceCategoriesPerRounds(
  board: Board,
  maxPerRound = 5,
  dailyDouble: boolean,
): Board {
  const round1Ids = new Set(board.settings.round1Cat);
  const round2Ids = new Set(board.settings.round2Cat);

  const assignedRound1 = board.categories.filter(cat => round1Ids.has(cat.id));
  const assignedRound2 = board.categories.filter(cat => round2Ids.has(cat.id));
  const unassigned = board.categories.filter(
    cat => !round1Ids.has(cat.id) && !round2Ids.has(cat.id)
  );

  // Create new arrays starting with existing assigned IDs (clone to avoid mutation)
  const newRound1Cat = [...board.settings.round1Cat];
  const newRound2Cat = [...board.settings.round2Cat];

  // Calculate difference in rounds (round1 - round2)
  let diff = assignedRound1.length - assignedRound2.length;

  const shuffledUnassigned = shuffleArray(unassigned);

  for (const cat of shuffledUnassigned) {
    if (diff > 0 && newRound2Cat.length < maxPerRound) {
      newRound2Cat.push(cat.id);
      diff--;
    } else if (diff < 0 && newRound1Cat.length < maxPerRound) {
      newRound1Cat.push(cat.id);
      diff++;
    } else {
      // counts equal or no balancing needed, just assign to any round with space
      if (newRound1Cat.length < maxPerRound) {
        newRound1Cat.push(cat.id);
      } else if (newRound2Cat.length < maxPerRound) {
        newRound2Cat.push(cat.id);
      } else {
        console.warn(`Category ${cat.id} could not be assigned (max per round reached).`);
      }
    }
  }
  if (!dailyDouble) {
    return {
      ...board,
      settings: {
        ...board.settings,
        round1Cat: newRound1Cat,
        round2Cat: newRound2Cat,
      },
    };
  }
  // Daily Double picker


  const round1CatSet = new Set(newRound1Cat);
  const round2CatSet = new Set(newRound2Cat);

  const round1Cards: { catIndex: number; cardIndex: number }[] = [];
  const round2Cards: { catIndex: number; cardIndex: number }[] = [];

  // Build a cloned category list 
  const newCategories = board.categories.map((category, catIndex) => {
    const newCards = category.cards.map((card, cardIndex) => {
      // Collect card references
      if (card.question.trim() !== '') {
        if (round1CatSet.has(category.id)) {
          round1Cards.push({ catIndex, cardIndex });
        } else if (round2CatSet.has(category.id)) {
          round2Cards.push({ catIndex, cardIndex });
        }
      }

      return { ...card }; // shallow clone
    });

    return {
      ...category,
      cards: newCards,
    };
  });

  // Pick random indices
  const pick = <T>(arr: T[], count: number): T[] =>
    shuffleArray(arr).slice(0, count);

  const round1DDs = pick(round1Cards, 1);
  const round2DDs = pick(round2Cards, 2);

  // Apply dailyDouble flags
  for (const { catIndex, cardIndex } of [...round1DDs, ...round2DDs]) {
    newCategories[catIndex].cards[cardIndex].dailyDouble = true;
  }
  return {
    ...board,
    categories: newCategories,
    settings: {
      ...board.settings,
      round1Cat: newRound1Cat,
      round2Cat: newRound2Cat,
    },
  };
}