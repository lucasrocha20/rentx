import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
    sub: string;
    email: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokenRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute(token: string): Promise<string> {
        const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;
        const user_id = sub;

        const usertoken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

        if(!usertoken) {
            throw new AppError("Refresh Token does not exists!");
        }

        await this.usersTokensRepository.deleteById(usertoken.id)

        const refresh_token = sign({email}, auth.secret_refresh_token,{
            subject: sub,
            expiresIn: auth.expires_refresh_token_days
        });

        const expires_date = this.dateProvider.addDays(auth.expires_refresh_token_days)

        await this.usersTokensRepository.create({
            expires_date,
            refresh_token,
            user_id
        })

        return refresh_token;
    }
}

export { RefreshTokenUseCase }