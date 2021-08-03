import { Connection, createConnection } from "typeorm"
import Auth from "../entity/Auth"

class AuthController {
  async listAuth() {
    let conn: Connection | undefined = undefined
    try {
      conn = await createConnection('postgresTestConn')
    } catch (error) {
      console.error('error on createConnection...', error)
      if (conn?.isConnected) {
        await conn.close()
      }
    }
    let listOfAuth: Auth[] | undefined = undefined
    if (conn) {
      const authRepository = conn.getRepository(Auth)
      try {
        listOfAuth = await authRepository.find()
      } catch (error) {
        console.error(error)
      } finally {
        await conn.close()
      }
    }
    return listOfAuth
  }

  async findAuthByEmail(email: string) {
    let conn: Connection | undefined = undefined
    try {
      conn = await createConnection('postgresTestConn')
    } catch (error) {
      console.error('error on createConnection...', error)
      if (conn?.isConnected) {
        await conn.close()
      }
    }
    let found: Auth | undefined = undefined
    if (conn) {
      const authRepository = conn.getRepository(Auth)
      const authToFind = new Auth()
      authToFind.email = email
      try {
        found = await authRepository.findOne(authToFind)
      } catch (error) {
        console.error(error)
      } finally {
        await conn.close()
      }
    }
    return found
  }

  async findAuthById(id: number) {
    let conn: Connection | undefined = undefined
    try {
      conn = await createConnection('postgresTestConn')
    } catch (error) {
      console.error('error on createConnection...', error)
      if (conn?.isConnected) {
        await conn.close()
      }
    }
    let found: Auth | undefined = undefined
    if (conn) {
      const authRepository = conn.getRepository(Auth)
      const authToFind = new Auth()
      authToFind.id = id
      try {
        found = await authRepository.findOne(authToFind)
      } catch (error) {
        console.error(error)
      } finally {
        await conn.close()
      }
    }
    return found
  }

  async saveAuth({name, email, password}:
    {name: string, email: string, password: string}) {
    let conn: Connection | undefined = undefined
    try {
      conn = await createConnection('postgresTestConn')
    } catch (error) {
      console.error('error on createConnection...', error)
      if (conn?.isConnected) {
        await conn.close()
      }
    }
    let saved: Auth | undefined = undefined
    if (conn) {
      const authRepository = conn.getRepository(Auth)
      const newAuth = new Auth()
      newAuth.name = name
      newAuth.email = email
      newAuth.password = password
      try {
        saved = await authRepository.save(newAuth)
      } catch (error) {
        console.error(error)
      } finally {
        await conn.close()
      }
    }
    return saved
  }
}

export default AuthController
