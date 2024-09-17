export interface ITokenSender {
	sendVerificationEmail(toEmail: string): Promise<void>;
	sendResetPasswordEmail(email: string, token: string): Promise<void>;
}
