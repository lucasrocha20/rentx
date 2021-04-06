import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            driver_license: "000123",
            email: "user@teste.com",
            password: "1234",
            name: "User Test"
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate an non exist user", async () => {
        await expect(authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "1234"
            })
        ).rejects.toEqual(new AppError("Email or password incorrect!"));
    });

    it("should not be able to authneticate with incorrect password", async () => {
        const user: ICreateUserDTO = {
            driver_license: "9999",
            email: "user@user.com",
            password: "1234",
            name: "User Test Error",
        };

        await createUserUseCase.execute(user);

        await expect(authenticateUserUseCase.execute({
            email: user.email,
            password: "incorrectPassword",
        })
        ).rejects.toEqual(new AppError("Email or password incorrect!"));
    });

    
});