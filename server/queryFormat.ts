export function formatQuery(query) {
  const formattedQuery = {}
  for (const key in query) {
    query[key].map(
      (attribute) =>
        (formattedQuery[`${key}_${attribute}`] = `${key} ${attribute}`)
    )
  }
  console.log('formated query', formattedQuery)
  return formattedQuery
}
