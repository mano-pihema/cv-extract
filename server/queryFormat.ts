export function formatQuery(query) {
  const formattedQuery = {}

  for (const key in query) {
    query[key].map((attribute) => {
      if (key == 'list') {
        formattedQuery[
          `${key}_${attribute}`
        ] = `${key} ${attribute} without prefix numbers or dash,seperate with double commas, limit responses to 1 sentence`
      } else {
        formattedQuery[`${key}_${attribute}`] = `${key} ${attribute} section`
      }
    })
  }

  console.log('formated query', formattedQuery)
  return formattedQuery
}
