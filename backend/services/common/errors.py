"""Централизованные текстовые сообщения HTTPException.

Цель — одинаковая формулировка по всему API + одно место для правок.
Использовать в use_case'ах: ``raise HTTPException(404, AD_NOT_FOUND)``.
"""

AUTH_REQUIRED = "Требуется авторизация"
INVALID_CREDENTIALS = "Неверный email или пароль"
ACCOUNT_BANNED = "Аккаунт заблокирован"
TOKEN_REVOKED = "Токен отозван"
USER_NOT_FOUND = "Пользователь не найден"

AD_NOT_FOUND = "Объявление не найдено"
AD_ACCESS_DENIED_DELETE = "Нельзя удалить чужое объявление"
AD_ACCESS_DENIED_EDIT = "Нельзя редактировать чужое объявление"
AD_ALREADY_DELETED = "Объявление уже удалено"

CATEGORY_NOT_FOUND = "Категория не найдена"
SUBCATEGORY_NOT_FOUND = "Подкатегория не найдена"
CATEGORY_MISMATCH = "Подкатегория не относится к выбранной категории"

CONVERSATION_NOT_FOUND = "Диалог не найден"
SELF_CONVERSATION_FORBIDDEN = "Нельзя написать самому себе"
CONVERSATION_NOT_PARTICIPANT = "Нет доступа к диалогу"
MESSAGE_EMPTY = "Сообщение не может быть пустым"

COMPLAINT_REASON_INVALID = "Неверная причина жалобы"
COMPLAINT_SELF_FORBIDDEN = "Нельзя пожаловаться на собственное объявление"

CONTENT_PAGE_NOT_FOUND = "Страница не найдена"
SITE_SETTINGS_NOT_SET = "Настройки сайта не заданы"
