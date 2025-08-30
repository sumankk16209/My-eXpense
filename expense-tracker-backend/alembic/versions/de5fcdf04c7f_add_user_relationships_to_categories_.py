"""Add user relationships to categories and expenses

Revision ID: de5fcdf04c7f
Revises: 116a57a8a60e
Create Date: 2024-12-23 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'de5fcdf04c7f'
down_revision = '116a57a8a60e'
branch_labels = None
depends_on = None


def upgrade():
    # Get the default user ID
    connection = op.get_bind()
    result = connection.execute(sa.text("SELECT id FROM users WHERE username = 'default_user'"))
    user_result = result.fetchone()
    
    if user_result is None:
        # No default user exists, create one
        connection.execute(sa.text("""
            INSERT INTO users (email, username, hashed_password, full_name, is_active)
            VALUES ('default@example.com', 'default_user', 'default_hashed_password', 'Default User', 'active')
        """))
        connection.commit()
        
        # Get the newly created user ID
        result = connection.execute(sa.text("SELECT id FROM users WHERE username = 'default_user'"))
        default_user_id = result.fetchone()[0]
    else:
        default_user_id = user_result[0]
    
    # Add new columns to categories table
    op.add_column('categories', sa.Column('description', sa.String(), nullable=True))
    op.add_column('categories', sa.Column('color', sa.String(), nullable=True))
    op.add_column('categories', sa.Column('user_id', sa.Integer(), nullable=True))
    op.add_column('categories', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))
    op.add_column('categories', sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True))
    
    # Update existing categories to belong to default user
    connection.execute(sa.text("UPDATE categories SET user_id = :user_id"), {"user_id": default_user_id})
    
    # Make user_id NOT NULL after updating existing data
    op.alter_column('categories', 'user_id', nullable=False)
    
    # Add foreign key constraint
    op.create_foreign_key('fk_categories_user_id', 'categories', 'users', ['user_id'], ['id'])
    
    # Add new columns to expenses table
    op.add_column('expenses', sa.Column('user_id', sa.Integer(), nullable=True))
    op.add_column('expenses', sa.Column('notes', sa.String(), nullable=True))
    op.add_column('expenses', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))
    op.add_column('expenses', sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True))
    
    # Update existing expenses to belong to default user
    connection.execute(sa.text("UPDATE expenses SET user_id = :user_id"), {"user_id": default_user_id})
    
    # Make user_id NOT NULL after updating existing data
    op.alter_column('expenses', 'user_id', nullable=False)
    
    # Add foreign key constraint
    op.create_foreign_key('fk_expenses_user_id', 'expenses', 'users', ['user_id'], ['id'])
    
    # Make other required fields NOT NULL
    op.alter_column('expenses', 'description', nullable=False)
    op.alter_column('expenses', 'amount', nullable=False)
    op.alter_column('expenses', 'category_id', nullable=False)
    op.alter_column('categories', 'name', nullable=False)


def downgrade():
    # Remove foreign key constraints
    op.drop_constraint('fk_expenses_user_id', 'expenses', type_='foreignkey')
    op.drop_constraint('fk_categories_user_id', 'categories', type_='foreignkey')
    
    # Remove columns from expenses table
    op.drop_column('expenses', 'updated_at')
    op.drop_column('expenses', 'created_at')
    op.drop_column('expenses', 'notes')
    op.drop_column('expenses', 'user_id')
    
    # Remove columns from categories table
    op.drop_column('categories', 'updated_at')
    op.drop_column('categories', 'created_at')
    op.drop_column('categories', 'user_id')
    op.drop_column('categories', 'color')
    op.drop_column('categories', 'description')
