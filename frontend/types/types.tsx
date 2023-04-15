export type Individual = {
  id: number
  name: string
  rank: string
  progress: number
}

export type Team = {
  id: number
  name: string
  mission: string
  progress: number
  score: number
  individuals: Individual[]
}

export type Activity = {
  id: number
  description: string
  specialAnnouncement?: Boolean
}
