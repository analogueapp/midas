export interface Creator {
  id: number
  bio: string
  username: string
  name: string
  isActive: boolean
  image: string
  following: boolean
  diedAt: string
}

export interface User {
  id: number
  username: string
  name: string
  type: string
  onboard: number
  token: string
  algoliaId: number
  algoliaKey: string
  code: string
  email: string
  bio: string
  image: string
}

export interface Content {
  id: number
  body: string
  createdAt: string
  creators: Creator[]
  form: string
  formDisplay: string
  formSlug: string
  logged: boolean
  image: string
  originUrl: string
  origin: string
  publishedAt: string
  title: string
  slug: string
}

export interface Primer {
  id: number
  title: string
  slug: string
  createdAt: string
  updatedAt: string
  description: string
  image: string
  users: User[]
  private: boolean
  logsCount: number
  shared: boolean
}

export interface Log {
  id: number
  currentPrimers: Primer[]
}
