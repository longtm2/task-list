class User < ApplicationRecord
  devise :database_authenticatable, :validatable

  has_many :tasks, dependent: :destroy
  has_many :completed_tasks,
    class_name: "Task",
    foreign_key: :completed_by_id,
    inverse_of: :completed_by,
    dependent: :nullify

  before_validation :normalize_email

  validates :name, presence: true

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end
