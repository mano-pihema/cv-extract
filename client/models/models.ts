export interface QueryForm {
  list: string[]
  extract: string[]
  summarize: string[]
  [attribute: string]: string[]
}
