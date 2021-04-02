import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { inject } from "tsyringe";


interface IRequest {
    car_id: string;
    images_name: string[];
}

class UploadCarImagesUseCase {
    constructor(
        @inject("CarsImageRepository")
        private carsImagesRepository: ICarsImagesRepository
    ) {}

    async execute({car_id, images_name}: IRequest): Promise<void> {
        images_name.map(async image => {
            await this.carsImagesRepository.create(car_id, image);
        })
    }
}

export { UploadCarImagesUseCase };