type User = {
  name: string
  email: string
  password: string
  age: string
  career: string
  gender: string

  progress: {
    level1: number
    level2: number
    level3: number
  }
}

export const userDB: User[] = []

export function getUserByEmail(email: string): User | undefined {
  return userDB.find(user => user.email === email)
}

export function updateUserProgress(email: string, newProgress: User["progress"]) {
  const user = userDB.find(user => user.email === email)
  if (user) {
    user.progress = newProgress
  }
}

export function addUser(user: User) {
  userDB.push(user)
}

export function getAllUsers() {
  return userDB
}

