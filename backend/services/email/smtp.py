import asyncio
import os
import smtplib
import ssl
from email.message import EmailMessage


async def send_email(
    to_email: str,
    subject: str,
    text_body: str,
    html_body: str | None = None,
) -> None:
    """Отправляет письмо через SMTP в отдельном треде, чтобы не блокировать event loop."""
    host = os.environ.get("SMTP_HOST", "").strip()
    user = os.environ.get("SMTP_USER", "").strip()
    password = os.environ.get("SMTP_PASSWORD", "")
    if not host or not user or not password:
        raise RuntimeError(
            "SMTP не настроен: задайте SMTP_HOST, SMTP_USER и SMTP_PASSWORD"
        )

    port = int(os.environ.get("SMTP_PORT", "465"))
    sender = os.environ.get("SMTP_FROM", "").strip() or user
    sender_name = os.environ.get("SMTP_FROM_NAME", "").strip()
    use_ssl = os.environ.get("SMTP_SSL", "1").strip().lower() in {"1", "true", "yes"}

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{sender_name} <{sender}>" if sender_name else sender
    message["To"] = to_email
    message.set_content(text_body)
    if html_body:
        message.add_alternative(html_body, subtype="html")

    def deliver() -> None:
        context = ssl.create_default_context()
        if use_ssl:
            with smtplib.SMTP_SSL(host, port, context=context, timeout=20) as server:
                server.login(user, password)
                server.send_message(message)
        else:
            with smtplib.SMTP(host, port, timeout=20) as server:
                server.starttls(context=context)
                server.login(user, password)
                server.send_message(message)

    await asyncio.to_thread(deliver)
