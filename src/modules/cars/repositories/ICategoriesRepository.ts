import { Category } from "../entities/Category";

interface ICreateRepositoryDTO {
    name: string;
    description: string;
}

interface ICategoriesRepository {
    findByName(name: string): Promise<Category>;
    list(): Promise<Category[]>;
    create({name, description}: ICreateRepositoryDTO): Promise<void>;
}

export { ICategoriesRepository, ICreateRepositoryDTO }