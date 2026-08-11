from services.email.smtp import send_email


async def send_verification_email(to_email: str, code: str) -> None:
    """Отправляет письмо с кодом подтверждения регистрации."""
    subject = "Код подтверждения — Land of Soul"
    text = (
        f"Ваш код подтверждения: {code}\n\n"
        "Введите его на сайте, чтобы завершить регистрацию. "
        "Код действует 15 минут.\n\n"
        "Если вы не регистрировались на Land of Soul, просто игнорируйте это письмо."
    )
    html = (
        "<div style=\"font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;"
        "padding:24px;color:#1E1E1E\">"
        "<h1 style=\"font-size:20px;color:#1129BD;margin:0 0 12px\">Подтверждение почты</h1>"
        "<p style=\"font-size:15px;margin:0 0 16px\">Введите этот код на сайте, "
        "чтобы завершить регистрацию:</p>"
        f"<div style=\"font-size:32px;font-weight:700;letter-spacing:8px;"
        f"color:#1129BD;margin:0 0 16px\">{code}</div>"
        "<p style=\"font-size:13px;color:#6c757d;margin:0\">Код действует 15 минут. "
        "Если вы не регистрировались на Land of Soul, просто игнорируйте это письмо.</p>"
        "</div>"
    )
    await send_email(to_email, subject, text, html)


async def send_password_reset_email(to_email: str, code: str) -> None:
    """Отправляет письмо с кодом для восстановления пароля."""
    subject = "Восстановление пароля — Land of Soul"
    text = (
        f"Код для восстановления пароля: {code}\n\n"
        "Введите его на сайте, чтобы задать новый пароль. "
        "Код действует 15 минут.\n\n"
        "Если вы не запрашивали смену пароля, просто игнорируйте это письмо."
    )
    html = (
        "<div style=\"font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;"
        "padding:24px;color:#1E1E1E\">"
        "<h1 style=\"font-size:20px;color:#1129BD;margin:0 0 12px\">Восстановление пароля</h1>"
        "<p style=\"font-size:15px;margin:0 0 16px\">Введите этот код на сайте, "
        "чтобы задать новый пароль:</p>"
        f"<div style=\"font-size:32px;font-weight:700;letter-spacing:8px;"
        f"color:#1129BD;margin:0 0 16px\">{code}</div>"
        "<p style=\"font-size:13px;color:#6c757d;margin:0\">Код действует 15 минут. "
        "Если вы не запрашивали смену пароля, просто игнорируйте это письмо.</p>"
        "</div>"
    )
    await send_email(to_email, subject, text, html)
