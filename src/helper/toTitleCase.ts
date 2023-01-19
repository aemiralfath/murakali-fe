export default function toTitleCase(str: string) {
  const sentence = str.split(' ')
  if (sentence.length === 1) {
    sentence[0] = sentence[0][0].toUpperCase() + sentence[0].slice(1)
    return sentence.join(' ')
  }

  for (let i = 0; i < sentence.length; i++) {
    sentence[i] =
      sentence[i][0].toUpperCase() + sentence[i].slice(1).toLowerCase()
  }
  return sentence.join(' ')
}
