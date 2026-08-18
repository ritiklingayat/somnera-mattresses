package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.service.EmailService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class BrevoEmailServiceImpl
        implements EmailService {


    private final RestClient.Builder
            restClientBuilder;


    @Value("${brevo.api.url}")
    private String brevoApiUrl;


    @Value("${brevo.api.key}")
    private String brevoApiKey;


    @Value("${brevo.sender.email}")
    private String senderEmail;


    @Value("${brevo.sender.name}")
    private String senderName;


    // ==============================
    // REGISTRATION OTP
    // ==============================

    @Override
    public void sendRegistrationOtp(
            String recipientEmail,
            String recipientName,
            String otp
    ) {

        String subject =
                "Your Somnera registration OTP";


        String htmlContent = """
                <div style="font-family:Arial,sans-serif;
                            max-width:600px;
                            margin:auto;
                            padding:24px;
                            border:1px solid #eeeeee;
                            border-radius:12px;">

                    <h2 style="color:#222222;">
                        Verify your email
                    </h2>

                    <p>Hello %s,</p>

                    <p>
                        Use the following OTP to complete
                        your Somnera Mattress registration:
                    </p>

                    <div style="font-size:32px;
                                font-weight:bold;
                                letter-spacing:8px;
                                padding:18px;
                                background:#f5f5f5;
                                text-align:center;
                                border-radius:8px;">
                        %s
                    </div>

                    <p>
                        This OTP will expire shortly.
                        Do not share it with anyone.
                    </p>

                    <p>Somnera Mattresses</p>
                </div>
                """
                .formatted(
                        escapeHtml(
                                recipientName
                        ),
                        escapeHtml(
                                otp
                        )
                );


        sendEmail(
                recipientEmail,
                recipientName,
                subject,
                htmlContent
        );
    }


    // ==============================
    // WELCOME EMAIL
    // ==============================

    @Override
    public void sendWelcomeEmail(
            String recipientEmail,
            String recipientName
    ) {

        String subject =
                "Welcome to Somnera Mattresses";


        String htmlContent = """
                <div style="font-family:Arial,sans-serif;
                            max-width:600px;
                            margin:auto;
                            padding:24px;">

                    <h2>Welcome to Somnera Mattresses!</h2>

                    <p>Hello %s,</p>

                    <p>
                        Your account has been created successfully.
                    </p>

                    <p>
                        You can now explore mattresses,
                        manage your account and place orders.
                    </p>

                    <p>Thank you for joining Somnera.</p>
                </div>
                """
                .formatted(
                        escapeHtml(
                                recipientName
                        )
                );


        sendEmail(
                recipientEmail,
                recipientName,
                subject,
                htmlContent
        );
    }


    // ==============================
// PASSWORD RESET OTP
// ==============================

    @Override
    public void sendPasswordResetOtp(
            String recipientEmail,
            String recipientName,
            String otp
    ) {

        String subject =
                "Your Somnera password reset OTP";


        String htmlContent = """
            <div style="
                font-family:Arial,sans-serif;
                max-width:600px;
                margin:auto;
                padding:24px;
                border:1px solid #eeeeee;
                border-radius:12px;
                background:#ffffff;
            ">

                <h2 style="
                    color:#222222;
                    margin-top:0;
                ">
                    Reset your password
                </h2>

                <p>
                    Hello %s,
                </p>

                <p>
                    We received a request to reset
                    your Somnera account password.
                </p>

                <p>
                    Use the following OTP to reset
                    your password:
                </p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    padding:18px;
                    margin:20px 0;
                    background:#f5f5f5;
                    text-align:center;
                    border-radius:8px;
                    color:#222222;
                ">
                    %s
                </div>

                <p>
                    This OTP will expire shortly.
                </p>

                <p>
                    Do not share this OTP with anyone.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <p style="
                    margin-top:25px;
                ">
                    Somnera Mattresses
                </p>

            </div>
            """
                .formatted(
                        escapeHtml(
                                recipientName
                        ),
                        escapeHtml(
                                otp
                        )
                );


        sendEmail(
                recipientEmail,
                recipientName,
                subject,
                htmlContent
        );
    }


    // ==============================
    // PASSWORD CHANGED EMAIL
    // ==============================

    @Override
    public void sendPasswordChangedEmail(
            String recipientEmail,
            String recipientName
    ) {

        String subject =
                "Your Somnera password was changed";


        String htmlContent = """
                <div style="font-family:Arial,sans-serif;
                            max-width:600px;
                            margin:auto;
                            padding:24px;">

                    <h2>Password changed successfully</h2>

                    <p>Hello %s,</p>

                    <p>
                        Your Somnera account password
                        has been changed successfully.
                    </p>

                    <p>
                        If you did not make this change,
                        please contact support immediately.
                    </p>
                </div>
                """
                .formatted(
                        escapeHtml(
                                recipientName
                        )
                );


        sendEmail(
                recipientEmail,
                recipientName,
                subject,
                htmlContent
        );
    }


    // ==============================
    // DISTRIBUTOR REQUEST EMAIL
    // ==============================

    @Override
    public void sendDistributorRequestNotification(
            String fullName,
            String applicantEmail,
            String phoneNumber,
            String targetLocation,
            String investmentRange,
            String businessExperience
    ) {

        String recipientEmail =
                "somneramattresses@gmail.com";


        String recipientName =
                "Somnera Mattresses";


        String subject =
                "New Distributor Partnership Request - "
                        + fullName;


        String htmlContent = """
                <div style="
                    font-family:Arial,sans-serif;
                    max-width:650px;
                    margin:auto;
                    padding:30px;
                    border:1px solid #eeeeee;
                    border-radius:12px;
                    background:#ffffff;
                ">

                    <h2 style="
                        margin-top:0;
                        color:#222222;
                    ">
                        New Distributor Partnership Request
                    </h2>

                    <p>
                        A new distributor partnership application
                        has been submitted on the Somnera Mattresses website.
                    </p>

                    <table style="
                        width:100%%;
                        border-collapse:collapse;
                        margin-top:20px;
                    ">

                        <tr>
                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                                width:35%%;
                            ">
                                <strong>Full Name</strong>
                            </td>

                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                            ">
                                %s
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                            ">
                                <strong>Email</strong>
                            </td>

                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                            ">
                                %s
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                            ">
                                <strong>Phone Number</strong>
                            </td>

                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                            ">
                                %s
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                            ">
                                <strong>Target City / Location</strong>
                            </td>

                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                            ">
                                %s
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                            ">
                                <strong>Investment Range</strong>
                            </td>

                            <td style="
                                padding:10px;
                                border-bottom:1px solid #eeeeee;
                            ">
                                %s
                            </td>
                        </tr>

                    </table>

                    <h3 style="
                        margin-top:25px;
                        color:#222222;
                    ">
                        Business Experience
                    </h3>

                    <div style="
                        background:#f7f7f7;
                        padding:16px;
                        border-radius:8px;
                        line-height:1.6;
                    ">
                        %s
                    </div>

                    <p style="
                        margin-top:30px;
                        color:#777777;
                        font-size:13px;
                    ">
                        This email was automatically generated
                        from the Somnera Mattresses Distributor
                        Partnership form.
                    </p>

                </div>
                """
                .formatted(
                        escapeHtml(
                                fullName
                        ),
                        escapeHtml(
                                applicantEmail
                        ),
                        escapeHtml(
                                phoneNumber
                        ),
                        escapeHtml(
                                targetLocation
                        ),
                        escapeHtml(
                                investmentRange
                        ),
                        escapeHtml(
                                businessExperience
                        )
                );


        sendEmailWithReplyTo(
                recipientEmail,
                recipientName,
                subject,
                htmlContent,
                applicantEmail,
                fullName
        );
    }


    // ==============================
    // NORMAL EMAIL
    // ==============================

    private void sendEmail(
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent
    ) {

        validateConfiguration();


        Map<String, Object> requestBody =
                Map.of(

                        "sender",
                        Map.of(
                                "name",
                                senderName,
                                "email",
                                senderEmail
                        ),

                        "to",
                        List.of(
                                Map.of(
                                        "email",
                                        recipientEmail,
                                        "name",
                                        recipientName
                                )
                        ),

                        "subject",
                        subject,

                        "htmlContent",
                        htmlContent
                );


        sendBrevoRequest(
                requestBody
        );
    }


    // ==============================
    // EMAIL WITH REPLY-TO
    // ==============================

    private void sendEmailWithReplyTo(
            String recipientEmail,
            String recipientName,
            String subject,
            String htmlContent,
            String replyToEmail,
            String replyToName
    ) {

        validateConfiguration();


        Map<String, Object> requestBody =
                new HashMap<>();


        requestBody.put(
                "sender",
                Map.of(
                        "name",
                        senderName,
                        "email",
                        senderEmail
                )
        );


        requestBody.put(
                "to",
                List.of(
                        Map.of(
                                "email",
                                recipientEmail,
                                "name",
                                recipientName
                        )
                )
        );


        requestBody.put(
                "subject",
                subject
        );


        requestBody.put(
                "htmlContent",
                htmlContent
        );


        if (
                StringUtils.hasText(
                        replyToEmail
                )
        ) {

            requestBody.put(
                    "replyTo",
                    Map.of(
                            "email",
                            replyToEmail,
                            "name",
                            StringUtils.hasText(
                                    replyToName
                            )
                                    ? replyToName
                                    : replyToEmail
                    )
            );
        }


        sendBrevoRequest(
                requestBody
        );
    }


    // ==============================
    // SEND REQUEST TO BREVO
    // ==============================

    private void sendBrevoRequest(
            Map<String, Object> requestBody
    ) {

        try {

            restClientBuilder
                    .baseUrl(
                            brevoApiUrl
                    )
                    .build()
                    .post()
                    .uri(
                            "/smtp/email"
                    )
                    .header(
                            "api-key",
                            brevoApiKey
                    )
                    .contentType(
                            MediaType.APPLICATION_JSON
                    )
                    .body(
                            requestBody
                    )
                    .retrieve()
                    .toBodilessEntity();


        } catch (
                RestClientException exception
        ) {

            throw new BadRequestException(
                    "Unable to send email. Please try again."
            );
        }
    }


    // ==============================
    // VALIDATE BREVO CONFIG
    // ==============================

    private void validateConfiguration() {

        if (
                !StringUtils.hasText(
                        brevoApiKey
                )
                        ||
                        !StringUtils.hasText(
                                senderEmail
                        )
        ) {

            throw new IllegalStateException(
                    "Brevo email configuration is missing"
            );
        }
    }


    // ==============================
    // ESCAPE HTML
    // ==============================

    private String escapeHtml(
            String value
    ) {

        if (value == null) {

            return "";
        }


        return value

                .replace(
                        "&",
                        "&amp;"
                )

                .replace(
                        "<",
                        "&lt;"
                )

                .replace(
                        ">",
                        "&gt;"
                )

                .replace(
                        "\"",
                        "&quot;"
                )

                .replace(
                        "'",
                        "&#39;"
                );
    }
}