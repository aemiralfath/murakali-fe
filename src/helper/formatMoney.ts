const formatMoney = (value: number): string => {
  return value.toLocaleString('id-ID')
}

export const formatMoneyK = (value: number): string => {
  const inThousand = (value / 1000).toFixed(2)
  return Number(inThousand).toLocaleString('id-ID')
}

export default formatMoney
