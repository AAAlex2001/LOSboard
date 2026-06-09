"""Set explicit ON DELETE on all foreign keys

Revision ID: 0042_fk_ondelete
Revises: 0041_contacts_2col_layout
Create Date: 2026-06-09 14:30:00.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = "0042_fk_ondelete"
down_revision: Union[str, None] = "0041_contacts_2col_layout"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


FK_CHANGES = [
    ("advertisements", "owner_id", "users", "id", "RESTRICT"),
    ("advertisements", "category_id", "categories", "id", "RESTRICT"),
    ("advertisements", "subcategory_id", "subcategories", "id", "RESTRICT"),
    ("advertisements", "moderated_by_id", "users", "id", "SET NULL"),
    ("subcategories", "category_id", "categories", "id", "CASCADE"),
    ("conversations", "advertisement_id", "advertisements", "id", "RESTRICT"),
    ("conversations", "buyer_id", "users", "id", "CASCADE"),
    ("conversations", "seller_id", "users", "id", "CASCADE"),
    ("messages", "conversation_id", "conversations", "id", "CASCADE"),
    ("messages", "sender_id", "users", "id", "CASCADE"),
    ("liked_advertisements", "advertisement_id", "advertisements", "id", "CASCADE"),
    ("liked_advertisements", "user_id", "users", "id", "CASCADE"),
    ("viewed_advertisements", "advertisement_id", "advertisements", "id", "CASCADE"),
    ("viewed_advertisements", "user_id", "users", "id", "CASCADE"),
    ("complaints", "reporter_id", "users", "id", "RESTRICT"),
    ("complaints", "resolved_by_id", "users", "id", "SET NULL"),
    ("content_pages", "updated_by_id", "users", "id", "SET NULL"),
]


def upgrade() -> None:
    for table, column, ref_table, ref_column, action in FK_CHANGES:
        constraint = f"{table}_{column}_fkey"
        op.drop_constraint(constraint, table, type_="foreignkey")
        op.create_foreign_key(
            constraint,
            table,
            ref_table,
            [column],
            [ref_column],
            ondelete=action,
        )


def downgrade() -> None:
    for table, column, ref_table, ref_column, _ in FK_CHANGES:
        constraint = f"{table}_{column}_fkey"
        op.drop_constraint(constraint, table, type_="foreignkey")
        op.create_foreign_key(
            constraint,
            table,
            ref_table,
            [column],
            [ref_column],
        )
