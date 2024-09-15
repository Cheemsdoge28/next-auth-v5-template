import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailStyles = `
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
    }
    .email-wrapper {
        width: 100%;
        background-color: #f9f9f9;
        padding: 30px 0;
    }
    .email-content {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h1 {
        color: #1a202c;
        font-size: 26px;
        margin-bottom: 16px;
        font-weight: 600;
    }
    p {
        margin: 0 0 16px;
        line-height: 1.5;
        color: #4a5568;
    }
    a {
        color: #111111;
        text-decoration: none;
        font-weight: 500;
    }
    a:hover {
        text-decoration: underline;
    }
    .button {
        display: inline-block;
        padding: 14px 24px;
        margin: 12px 0;
        background-color: #3182ce;
        color: #ffffff;
        text-align: center;
        text-decoration: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
    }
    .button:hover {
        background-color: #2b6cb0;
    }
    .footer {
        font-size: 14px;
        color: #718096;
        margin-top: 20px;
        text-align: center;
    }
    @media (max-width: 600px) {
        .email-content {
            padding: 15px;
        }
        .button {
            padding: 12px 20px;
            font-size: 15px;
        }
    }
`;

export const sendVerificationMail = async (email: string, token: string, name?: string) => {
    if (!name) name = "User";
    const confirmLink = `${process.env.DOMAIN_NAME}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify Your Email Address",
        html: `
            <html>
            <head>
                <style>${emailStyles}</style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="email-content">
                        <h1>Hello ${name},</h1>
                        <p>Thank you for registering with us! To complete your account setup, please verify your email address by clicking the button below:</p>
                        <p><a href="${confirmLink}" class="button">Verify Your Email Address</a></p>
                        <p>If you didn’t create an account with us, please ignore this email.</p>
                        <p>If you encounter any issues or have questions, feel free to reach out to our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
                        <p class="footer">Best regards,<br>The ${process.env.COMPANY_NAME} Team</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });
};

export const sendPasswordResetMail = async (email: string, token: string, name?: string) => {
    if (!name) name = "User";
    const resetLink = `${process.env.DOMAIN_NAME}/auth/new-password?token=${token}`;

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset Your Password",
            html: `
                <html>
                <head>
                    <style>${emailStyles}</style>
                </head>
                <body>
                    <div class="email-wrapper">
                        <div class="email-content">
                            <h1>Hello ${name},</h1>
                            <p>We received a request to reset the password for your account. Click the button below to set a new password:</p>
                            <p><a href="${resetLink}" class="button">Reset Your Password</a></p>
                            <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
                            <p>If you have any questions or need further assistance, reach out to us at <a href="mailto:support@example.com">support@example.com</a>.</p>
                            <p class="footer">Best regards,<br>The ${process.env.COMPANY_NAME} Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

    } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Unable to send the password reset email. Please try again later.");
    }
};

export const sendSecurityAlertMail = async (email: string) => {
    const supportEmail = "support@example.com";

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Security Alert: Password Reset Attempt",
            html: `
                <html>
                <head>
                    <style>${emailStyles}</style>
                </head>
                <body>
                    <div class="email-wrapper">
                        <div class="email-content">
                            <h1>Security Alert</h1>
                            <p>We received a request to reset the password for an account associated with this email address, but it appears that there is no account registered with us under this email.</p>
                            <p>If this was you, please check that you are using the correct email address or create a new account if you haven't already.</p>
                            <p>If you did not request this, you can safely ignore this email. However, if you are concerned about unauthorized access, please contact our support team at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
                            <p class="footer">Best regards,<br>The ${process.env.COMPANY_NAME} Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

    } catch (error) {
        console.error("Failed to send security alert email:", error);
        throw new Error("Unable to send the security alert email. Please try again later.");
    }
};

// New method to send 2FA token email
export const sendTwoFactorAuthMail = async (email: string, token: string) => {

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Your 2FA Token",
            html: `
                <html>
                <head>
                    <style>${emailStyles}</style>
                </head>
                <body>
                    <div class="email-wrapper">
                        <div class="email-content">
                            <h1>Two-Factor Authentication Token</h1>
                            <p>Here is your 2FA token for authentication:</p>
                            <p><strong>${token}</strong></p>
                            <p>Use this token to complete your authentication process. If you did not request this, please ignore this email.</p>
                            <p>If you encounter any issues or have questions, feel free to reach out to our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
                            <p class="footer">Best regards,<br>The ${process.env.COMPANY_NAME} Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

    } catch (error) {
        console.error("Failed to send 2FA token email:", error);
        throw new Error("Unable to send the 2FA token email. Please try again later.");
    }
};
