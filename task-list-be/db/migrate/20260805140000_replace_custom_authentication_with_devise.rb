class ReplaceCustomAuthenticationWithDevise < ActiveRecord::Migration[8.1]
  def change
    rename_column :users, :password_digest, :encrypted_password
    remove_index :users, :authentication_token_digest
    remove_column :users, :authentication_token_digest
  end
end
