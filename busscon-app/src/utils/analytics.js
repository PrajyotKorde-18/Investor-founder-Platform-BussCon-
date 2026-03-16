/**
 * Calculates the Investor Interest Score for a given Startup Idea.
 * Interview context: This is the kind of business logic Rule Engine you'd build at Forma.ai.
 * 
 * Score Weights:
 * - View: 1 pt
 * - Like/Save: 3 pts
 * - Message: 5 pts
 * - Meeting: 10 pts
 */
export function calculateInterestScore(interactions) {
  let score = 0;
  
  interactions.forEach(interaction => {
    switch (interaction.action_type) {
      case 'Viewed':
        score += 1;
        break;
      case 'Liked':
        score += 3;
        break;
      case 'MessageSent':
        score += 5;
        break;
      case 'MeetingScheduled':
        score += 10;
        break;
      default:
        break;
    }
  });

  return score;
}

/**
 * Calculates Funding-Readiness Score based on completed checklist items.
 */
export function calculateFundingReadiness(checklist) {
  const totalItems = Object.keys(checklist).length;
  if (totalItems === 0) return 0;

  const completedItems = Object.values(checklist).filter(item => item === true).length;
  return Math.round((completedItems / totalItems) * 100);
}
