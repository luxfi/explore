export default function useScoreLevelAndColor(score: number) {
  let scoreColor: string;
  let scoreLevel: string;
  if (score >= 80) {
    scoreColor = 'var(--color-green-600)';
    scoreLevel = 'GREAT';
  } else if (score >= 30) {
    scoreColor = 'var(--color-purple-600)';
    scoreLevel = 'AVERAGE';
  } else {
    scoreColor = 'var(--color-red-600)';
    scoreLevel = 'LOW';
  }
  return { scoreColor, scoreLevel };
}
