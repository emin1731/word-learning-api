import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../interfaces/config/config.service.interface';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { ITokenSender } from '../interfaces/common/token-sender';

@injectable()
export class TokenSender implements ITokenSender {
	private transporter: nodemailer.Transporter;
	private jwtSecret: string;

	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {
		this.transporter = nodemailer.createTransport({
			service: this.configService.get('NODEMAILER_SERVICE'),
			host: this.configService.get('NODEMAILER_HOST'),
			port: +this.configService.get('NODEMAILER_PORT'),
			auth: {
				user: this.configService.get('NODEMAILER_USERNAME'),
				pass: this.configService.get('NODEMAILER_PASSWORD'),
			},
			tls: {
				rejectUnauthorized: false, // Add this if there are issues with SSL certificates
			},
			// logger: true, // Enable logging
			// debug: true, // Enable debug output
		});

		// Get JWT secret from config
		this.jwtSecret = this.configService.get('JWT_SECRET');
	}

	public async sendVerificationEmail(toEmail: string): Promise<void> {
		try {
			const token = jwt.sign(
				{
					data: 'Token Data',
				},
				this.jwtSecret,
				{ expiresIn: '10m' },
			);

			const mailConfigurations = {
				from: this.configService.get('EMAIL_USERNAME'), // Sender email from config
				to: toEmail, // Recipient email
				subject: 'Verify Your Email - Learn!', // Email subject
				html: `
					<div style="font-family: Arial, sans-serif; color: #7D5A50;">
						<div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #F9F6F7;">
							<h2 style="text-align: center; color: #7D5A50;">Email Verification</h2>
							<p>Hi,</p>
							<p>Thank you for visiting <strong>Learn!</strong>. To complete the process and verify your email, please click the button below:</p>
							<div style="text-align: center; margin: 30px 0;">
								<a href="http://localhost:${this.configService.get('CLIENT_PORT') || 8001}/verify/${token}" 
								   style="background-color: #FFE8D6; color: #7D5A50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
							</div>
							<p>If you didn't request this, you can safely ignore this email.</p>
							<p>Thanks,<br>The Learn! Team</p>
							<hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">
							<p style="text-align: center; font-size: 12px; color: #777;">
								If you're having trouble with the button, copy and paste the following link into your browser:<br>
								<a href="http://localhost:${this.configService.get('CLIENT_PORT') || 8001}/verify/${token}" style="color: #7D5A50;">
									http://localhost:${this.configService.get('CLIENT_PORT') || 8001}/verify/${token}
								</a>
							</p>
						</div>
					</div>
				`,
			};

			const info = await this.transporter.sendMail(mailConfigurations);
			console.log('Email Sent Successfully', info);
		} catch (error) {
			console.error('Error sending email', error);
			throw new Error('Email could not be sent.');
		}
	}
	async sendResetPasswordEmail(email: string, token: string): Promise<void> {
		const resetPasswordUrl = `http://localhost:${this.configService.get('CLIENT_PORT') || 5173}/reset-password?token=${token}`;

		const mailOptions = {
			from: this.configService.get('EMAIL_USERNAME'),
			to: email, // Receiver's email
			subject: 'Reset Your Password - Learn!',
			html: `
				<div style="font-family: Arial, sans-serif; color: #7D5A50;">
					<div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #F9F6F7;">
						<h2 style="text-align: center; color: #7D5A50;">Password Reset</h2>
						<p>Hi,</p>
						<p>You recently requested to reset your password for your <strong>Learn!</strong> account. Please click the button below to reset it:</p>
						<div style="text-align: center; margin: 30px 0;">
							<a href="${resetPasswordUrl}" style="background-color: #FFE8D6; color: #7D5A50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
						</div>
						<p>If you didn't request this, you can safely ignore this email. Your password will not be changed.</p>
						<p>Thanks,<br>The Learn! Team</p>
						<hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">
						<p style="text-align: center; font-size: 12px; color: #777;">
							If you're having trouble with the button, copy and paste the following link into your browser:<br>
							<a href="${resetPasswordUrl}" style="color: #7D5A50;">${resetPasswordUrl}</a>
						</p>
					</div>
				</div>
			`,
		};

		try {
			const info = await this.transporter.sendMail(mailOptions);
			console.log(`Email sent: ${info.response}`);
		} catch (error) {
			throw new Error(`[TokenSender] Error sending email: ${error}`);
		}
	}
}
