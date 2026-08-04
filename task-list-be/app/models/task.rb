class Task < ApplicationRecord
  belongs_to :user

  validates :title, :description, :due_at, presence: true

  scope :ordered_by_due_at, -> { order(:due_at, :id) }
  scope :incomplete, -> { where(completed_at: nil) }
  scope :completed, -> { where.not(completed_at: nil) }
  scope :overdue, -> { incomplete.where(due_at: ...Time.current) }
  scope :due_by_end_of_today, -> { where(due_at: ..Time.zone.today.end_of_day) }

  def self.for_list(due_by_today: false)
    tasks = ordered_by_due_at
    due_by_today ? tasks.due_by_end_of_today : tasks
  end

  def completed?
    completed_at.present?
  end

  def overdue?
    !completed? && due_at.past?
  end

  def mark_completed!
    return true if completed?

    update!(completed_at: Time.current)
  end
end
