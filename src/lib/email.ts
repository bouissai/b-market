// lib/email.ts
import nodemailer from 'nodemailer';

interface VerificationEmailProps {
	email: string;
	token: string;
	firstname: string;
	lastname: string;
}

export async function sendVerificationEmail({
	email,
	token,
	firstname,
	lastname,
}: VerificationEmailProps) {
	// Configuration de nodemailer
	// Pour le développement, vous pouvez utiliser un service comme Mailtrap ou Ethereal
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_SERVER_HOST,
		port: Number(process.env.EMAIL_SERVER_PORT),
		auth: {
			user: process.env.EMAIL_SERVER_USER,
			pass: process.env.EMAIL_SERVER_PASSWORD,
		},
		secure: process.env.NODE_ENV === 'production',
	});

	const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
	const displayName = firstname + ' ' + lastname || 'utilisateur';

	// Contenu de l'email
	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to: email,
		subject: 'Vérification de votre adresse email',
		text: `Bonjour ${displayName},\n\nMerci de vous être inscrit. Veuillez vérifier votre email en cliquant sur le lien suivant: ${verificationUrl}\n\nCe lien expirera dans 24 heures.`,
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Vérification de votre adresse email</h2>
        <p>Bonjour ${displayName},</p>
        <p>Merci de vous être inscrit. Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Vérifier mon email
          </a>
        </div>
        <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Cordialement,<br>L'équipe du site</p>
      </div>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		return { success: true };
	} catch (error) {
		console.error('Error sending email:', error);
		return { success: false, error };
	}
}
