module Api
  module Entities
    class TaskEntity < Grape::Entity
      format_with(:iso8601) { |datetime| datetime&.iso8601 }

      expose :id, documentation: { type: "Integer", desc: "Task id" }
      expose :user_id, documentation: { type: "Integer", desc: "Owner user id" }
      expose :created_by, using: Api::Entities::UserEntity, documentation: { type: "User", desc: "Task creator" }
      expose :completed_by, using: Api::Entities::UserEntity, documentation: { type: "User", desc: "User who completed the task" }
      expose :title, documentation: { type: "String", desc: "Task title" }
      expose :description, documentation: { type: "String", desc: "Task description" }
      expose :due_at, format_with: :iso8601, documentation: { type: "DateTime", desc: "Task due date and time" }
      expose :created_at, format_with: :iso8601, documentation: { type: "DateTime", desc: "Task creation date and time" }
      expose :updated_at, format_with: :iso8601, documentation: { type: "DateTime", desc: "Task last update date and time" }
      expose :completed_at, format_with: :iso8601, documentation: { type: "DateTime", desc: "Task completion date and time" }
      expose :completed, documentation: { type: "Boolean", desc: "Whether the task is completed" } do |task|
        task.completed?
      end
      expose :overdue, documentation: { type: "Boolean", desc: "Whether the task is overdue" } do |task|
        task.overdue?
      end
      expose :attachments, using: Api::Entities::AttachmentEntity, documentation: { type: "Array[Attachment]", desc: "Supporting files" }
    end
  end
end
