import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'test', name: 'auth', synchronize: false })
// @ts-ignore
class Auth {
  @PrimaryGeneratedColumn("increment", { name: 'id' })
  // @ts-ignore
  id: number

  @Column({ name: 'name' })
  // @ts-ignore
  name: string

  @Column({ name: 'email', nullable: false, unique: true })
  // @ts-ignore
  email: string

  @Column({ name: 'password', nullable: false })
  // @ts-ignore
  password: string
}

export default Auth
