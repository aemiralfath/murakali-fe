export default function toTitleCase(str: string) {
  const sentence = str.split(' ')
  if (sentence.length === 1) {
    if (sentence[0]) {
      sentence[0] = (sentence[0][0] ?? '').toUpperCase() + sentence[0].slice(1)
    }
    return sentence.join(' ')
  }

  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i]) {
      const tempSentence = sentence[i] ?? ''
      sentence[i] =
        (tempSentence[0] ?? '').toUpperCase() +
        tempSentence.slice(1).toLowerCase()
    }
  }
  return sentence.join(' ')
}
