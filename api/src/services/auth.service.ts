import bcrypt from 'bcryptjs'
import { UserRepository } from '../repositories/user.repository.js'

export class AuthService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  // Registra usuário
  async registerUser({ name, email, password }: any) {
    const userExists = await this.userRepository.findByEmail(email)
    
    if (userExists) {
      throw new Error('E-mail já cadastrado!')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword
    })

    return user
  }

  // Faz login
  async login({ email, password }: any) {
    const user = await this.userRepository.findByEmail(email)
    
    if (!user) {
      throw new Error('Credenciais inválidas.')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas.')
    }

    return user
  }
}
