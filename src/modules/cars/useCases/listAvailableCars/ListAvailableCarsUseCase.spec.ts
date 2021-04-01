import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase"


let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
    });
 
    it("should be able to list all available cars", async () => {
        const car = await carsRepositoryInMemory.create({
            "name": "Audi A3",
            "description": "teste",
            "daily_rate": 100,
            "license_plate": "ABC-1234",
            "fine_amount": 50,
            "brand": "Audi",
            "category_id": "0add7d29-f1aa-41e6-93a3-478f1b5602e2"
        });

        const cars = await listAvailableCarsUseCase.execute({});

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by branch", async () => {
        const car = await carsRepositoryInMemory.create({
            "name": "Audi A4",
            "description": "teste",
            "daily_rate": 100,
            "license_plate": "ABC-1234",
            "fine_amount": 50,
            "brand": "Audi",
            "category_id": "0add7d29-f1aa-41e6-93a3-478f1b5602e2"
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: "Audi",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            "name": "Audi A5",
            "description": "teste",
            "daily_rate": 100,
            "license_plate": "ABC-1234",
            "fine_amount": 50,
            "brand": "Audi",
            "category_id": "0add7d29-f1aa-41e6-93a3-478f1b5602e2"
        });

        const cars = await listAvailableCarsUseCase.execute({
            name: "Audi A5",
        });

        expect(cars).toEqual([car]);
    });

    it("should be able to list all available cars by category", async () => {
        const car = await carsRepositoryInMemory.create({
            "name": "Audi A6",
            "description": "teste",
            "daily_rate": 100,
            "license_plate": "ABC-1234",
            "fine_amount": 50,
            "brand": "Audi",
            "category_id": "12345"
        });

        const cars = await listAvailableCarsUseCase.execute({
            category_id: "12345",
        });

        expect(cars).toEqual([car]);
    });
})