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
		// Initialize the transporter with configuration from the config service
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: this.configService.get('EMAIL_USERNAME'),
				pass: this.configService.get('EMAIL_PASSWORD'),
			},
		});

		// Get JWT secret from config
		this.jwtSecret = this.configService.get('JWT_SECRET');
	}

	// Method to send an email verification token
	public async sendVerificationEmail(toEmail: string): Promise<void> {
		try {
			// Create a JWT token that expires in 10 minutes
			const token = jwt.sign(
				{
					data: 'Token Data',
				},
				this.jwtSecret,
				{ expiresIn: '10m' },
			);

			// Configure the email details
			const mailConfigurations = {
				from: this.configService.get('EMAIL_USERNAME'), // Sender email from config
				to: toEmail, // Recipient email
				subject: 'Email Verification', // Email subject
				text: `Hi! There, You have recently visited our website and entered your email.
               Please follow the given link to verify your email:
               http://localhost:${this.configService.get('CLIENT_PORT') || 8001}/verify/${token} 
               Thanks`,
			};

			// Send the email
			const info = await this.transporter.sendMail(mailConfigurations);
			console.log('Email Sent Successfully', info);
		} catch (error) {
			console.error('Error sending email', error);
			throw new Error('Email could not be sent.');
		}
	}
	async sendResetPasswordEmail(email: string, token: string): Promise<void> {
		const resetPasswordUrl = `http://localhost:${this.configService.get('CLIENT_PORT') || 8001}/reset-password?token=${token}`;

		const mailOptions = {
			from: this.configService.get('EMAIL_USERNAME'),
			to: email, // Receiver's email
			subject: 'Reset Password', // Email subject
			html: `<p>You requested a password reset.</p>
				 <p>Click this link to reset your password: 
				 <a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>
				 <p>If you did not request this, please ignore this email.</p>`,
		};

		try {
			const info = await this.transporter.sendMail(mailOptions);
			console.log(`Email sent: ${info.response}`);
		} catch (error) {
			console.error(`Error sending email: ${error}`);
			throw new Error('Could not send reset password email.');
		}
	}
}
