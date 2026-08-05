class Task < ApplicationRecord
  belongs_to :user
  belongs_to :created_by, class_name: "User", foreign_key: :user_id
  belongs_to :completed_by, class_name: "User", optional: true
  has_many_attached :attachments

  validates :title, :description, :due_at, presence: true

  scope :ordered_by_due_at, -> { order(:due_at, :id) }
  scope :incomplete, -> { where(completed_at: nil) }
  scope :completed, -> { where.not(completed_at: nil) }
  scope :overdue, -> { incomplete.where(due_at: ...Time.current) }
  scope :due_by_end_of_today, -> { where(due_at: ..Time.zone.today.end_of_day) }

  def self.for_list(due_by_today: false, due_from: nil, due_to: nil, query: nil, status: nil)
    tasks = ordered_by_due_at.with_attached_attachments.includes(:created_by, :completed_by)
    tasks = tasks.due_by_end_of_today if due_by_today
    tasks = tasks.where(due_at: due_from.beginning_of_day..) if due_from.present?
    tasks = tasks.where(due_at: ..due_to.end_of_day) if due_to.present?
    tasks = tasks.matching(query) if query.present?
    tasks = tasks.with_status(status) if status.present?
    tasks
  end

  scope :matching, ->(query) do
    sanitized_query = sanitize_sql_like(query.to_s.strip)
    where("tasks.title ILIKE :query OR tasks.description ILIKE :query", query: "%#{sanitized_query}%")
  end

  scope :with_status, ->(status) do
    case status
    when "completed" then completed
    when "overdue" then overdue
    when "open" then incomplete
    else all
    end
  end

  def completed?
    completed_at.present?
  end

  def overdue?
    !completed? && due_at.past?
  end

  def mark_completed!(completed_by:)
    return true if completed?

    update!(completed_at: Time.current, completed_by:)
  end
end
