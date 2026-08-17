import asyncio
import os
import smtplib
import socket
import ssl
from email.message import EmailMessage
from email.utils import formatdate, make_msgid


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
    message["Reply-To"] = sender
    message["Date"] = formatdate(localtime=True)
    message["Message-ID"] = make_msgid(domain=sender.rsplit("@", 1)[-1])
    message.set_content(text_body)
    if html_body:
        message.add_alternative(html_body, subtype="html")

    def deliver() -> None:
        original_getaddrinfo = socket.getaddrinfo

        def ipv4_only(*args, **kwargs):
            results = original_getaddrinfo(*args, **kwargs)
            return [item for item in results if item[0] == socket.AF_INET]

        socket.getaddrinfo = ipv4_only
        try:
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
        finally:
            socket.getaddrinfo = original_getaddrinfo

    await asyncio.to_thread(deliver)
