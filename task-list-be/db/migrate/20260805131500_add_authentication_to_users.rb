class AddAuthenticationToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :password_digest, :string
    add_column :users, :authentication_token_digest, :string

    add_index :users, :authentication_token_digest, unique: true
  end
end
