import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { inject, injectable } from "tsyringe";


@injectable()
class ListRentalsByUserUseCase {
    constructor(
        @inject("RentalsRepository")
        private RentalsRepository: IRentalsRepository
    ) {}

    async execute(user_id: string): Promise<Rental[]> {
        const rentalsByUser = await this.RentalsRepository.findByUser(user_id);

        return rentalsByUser;
    }
}

export { ListRentalsByUserUseCase }