import { UserRepository } from '../repositories/user.repository.js'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  // Lista usuários para colaboração
  async getUsers(userId: string) {
    return this.userRepository.getAll(userId);
  }
}
