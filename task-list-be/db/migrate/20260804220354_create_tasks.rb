class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description, null: false
      t.datetime :due_at, null: false
      t.datetime :completed_at

      t.timestamps
    end

    add_index :tasks, :due_at
    add_index :tasks, :completed_at
  end
end
