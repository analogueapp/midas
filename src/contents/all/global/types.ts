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
  collection: string
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
  selected? : boolean
  shared: boolean
}

export interface Log {
  id: number
  currentPrimers: Primer[]
}

export interface Knot {
  id: number
  body: string
  bodyText: string
  postedAt: string
  private?: boolean
  logId?: number
  updatedAt?: string
  createdAt?: string
  responses?: any[]
  like?: Like
  likesCount?: number
  totalResponses?: number
  user?: User
  episode?: any
  log?: Log
  pinned?: boolean
}

export interface Like {
  id: number
  user_id: number
  likeable_id: number
  likeable_type: string
  created_at?: string
  updated_at?: string
}
