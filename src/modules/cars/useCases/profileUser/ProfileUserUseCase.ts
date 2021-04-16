import { IUserResponseDTO } from "@modules/accounts/dtos/IUsersDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../accounts/repositories/IUsersRepository";

@injectable()
class ProfileUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute(id: string): Promise<IUserResponseDTO> {
        const user = await this.usersRepository.findById(id);
        return UserMap.toDTO(user);
    }
}

export { ProfileUserUseCase }