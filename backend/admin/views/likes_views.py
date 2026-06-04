"""Технические таблицы: лайки и просмотры объявлений (для дебага/статистики)."""

from sqladmin import ModelView

from admin.views.common import AdminOnly
from models.advertisement import LikedAdvertisement, ViewedAdvertisement


class LikedAdvertisementAdmin(AdminOnly, ModelView, model=LikedAdvertisement):
    name = "лайк"
    name_plural = "Лайки объявлений"
    icon = "fa-solid fa-heart"
    column_list = [
        LikedAdvertisement.id,
        LikedAdvertisement.user,
        LikedAdvertisement.advertisement,
    ]
    column_sortable_list = [LikedAdvertisement.id]
    column_labels = {
        LikedAdvertisement.id: "ID",
        LikedAdvertisement.user_id: "ID пользователя",
        LikedAdvertisement.advertisement_id: "ID объявления",
        LikedAdvertisement.user: "Пользователь",
        LikedAdvertisement.advertisement: "Объявление",
    }


class ViewedAdvertisementAdmin(AdminOnly, ModelView, model=ViewedAdvertisement):
    name = "просмотр"
    name_plural = "Просмотры объявлений"
    icon = "fa-solid fa-eye"
    column_list = [
        ViewedAdvertisement.id,
        ViewedAdvertisement.user,
        ViewedAdvertisement.advertisement,
        ViewedAdvertisement.viewed_at,
    ]
    column_sortable_list = [ViewedAdvertisement.id, ViewedAdvertisement.viewed_at]
    column_labels = {
        ViewedAdvertisement.id: "ID",
        ViewedAdvertisement.user_id: "ID пользователя",
        ViewedAdvertisement.advertisement_id: "ID объявления",
        ViewedAdvertisement.viewed_at: "Просмотрено",
        ViewedAdvertisement.user: "Пользователь",
        ViewedAdvertisement.advertisement: "Объявление",
    }
