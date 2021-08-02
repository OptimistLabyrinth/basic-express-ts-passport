export type User = {
  id: string,
  name: string,
  email: string,
  password: string
}

const users: User[] = []

function getUserByEmail(email: string) {
  return users.find(user => user.email === email)
}

function getUserById(id: string) {
  return users.find(user => user.id === id)
}

export default users
export { getUserByEmail, getUserById }
