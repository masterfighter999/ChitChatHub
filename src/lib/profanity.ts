const badWords = [
  "badword1",
  "profane",
  "inappropriate",
  "offensive",
  "ugly",
  "terrible",
];

const profanityRegex = new RegExp(badWords.join("|"), "gi");

export function filterProfanity(text: string): string {
  return text.replace(profanityRegex, (match) => "*".repeat(match.length));
}
