const getKey = (vname1: string, vname2?: string) => {
  return `1-${vname1}` + (vname2 ? `-2-${vname2}` : '')
}

export default getKey
