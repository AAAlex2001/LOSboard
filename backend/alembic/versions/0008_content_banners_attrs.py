"""content pages, footer links, banners, dynamic attributes

Revision ID: 0008_content_banners_attrs
Revises: 0007_admin_moderation
Create Date: 2026-06-04 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0008_content_banners_attrs"
down_revision: Union[str, None] = "0007_admin_moderation"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "content_pages",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("slug", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("body", sa.Text(), nullable=False, server_default=""),
        sa.Column(
            "is_published", sa.Boolean(), nullable=False, server_default=sa.true()
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_by_id",
            sa.Integer(),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
    )

    op.create_table(
        "footer_links",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("url", sa.String(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "is_active", sa.Boolean(), nullable=False, server_default=sa.true()
        ),
    )

    op.create_table(
        "banners",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=False),
        sa.Column("link_url", sa.String(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "is_active", sa.Boolean(), nullable=False, server_default=sa.true()
        ),
        sa.Column("starts_at", sa.DateTime(), nullable=True),
        sa.Column("ends_at", sa.DateTime(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.create_index("ix_banners_is_active", "banners", ["is_active"])
    op.create_index("ix_banners_sort_order", "banners", ["sort_order"])

    op.create_table(
        "attributes",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("key", sa.String(), nullable=False),
        sa.Column("kind", sa.String(), nullable=False, server_default="text"),
        sa.Column("options", sa.JSON(), nullable=True),
        sa.Column(
            "is_required", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "category_id",
            sa.Integer(),
            sa.ForeignKey("categories.id", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column(
            "subcategory_id",
            sa.Integer(),
            sa.ForeignKey("subcategories.id", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.UniqueConstraint(
            "category_id", "subcategory_id", "key",
            name="uq_attribute_scope_key",
        ),
    )
    op.create_index("ix_attributes_category", "attributes", ["category_id"])
    op.create_index("ix_attributes_subcategory", "attributes", ["subcategory_id"])

    op.create_table(
        "advertisement_attribute_values",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "advertisement_id",
            sa.Integer(),
            sa.ForeignKey("advertisements.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "attribute_id",
            sa.Integer(),
            sa.ForeignKey("attributes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("value", sa.String(), nullable=False),
        sa.UniqueConstraint(
            "advertisement_id", "attribute_id", name="uq_ad_attribute"
        ),
    )
    op.create_index(
        "ix_ad_attr_values_ad",
        "advertisement_attribute_values",
        ["advertisement_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_ad_attr_values_ad", table_name="advertisement_attribute_values"
    )
    op.drop_table("advertisement_attribute_values")

    op.drop_index("ix_attributes_subcategory", table_name="attributes")
    op.drop_index("ix_attributes_category", table_name="attributes")
    op.drop_table("attributes")

    op.drop_index("ix_banners_sort_order", table_name="banners")
    op.drop_index("ix_banners_is_active", table_name="banners")
    op.drop_table("banners")

    op.drop_table("footer_links")
    op.drop_table("content_pages")
