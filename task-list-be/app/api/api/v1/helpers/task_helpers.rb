module Api
  module V1
    module Helpers
      module TaskHelpers
        CREATE_ATTRIBUTES = %i[user_id title description due_at].freeze
        UPDATE_ATTRIBUTES = %i[title description due_at].freeze

        def create_task_params
          permitted_task_params(CREATE_ATTRIBUTES)
        end

        def update_task_params
          permitted_task_params(UPDATE_ATTRIBUTES)
        end

        def find_task
          Task.find_by(id: params[:id]) || render_error(:task, "not found", 404)
        end

        def render_validation_errors(record)
          error!({ errors: record.errors.to_hash(true) }, 422)
        end

        def tasks_collection
          Task.for_list(due_by_today: declared(params, include_missing: false)[:due_by_today])
        end

        private

        def permitted_task_params(attributes)
          task_attributes.slice(*attributes)
        end

        def task_attributes
          attributes = declared(params, include_missing: false)[:task]
          return attributes if attributes.respond_to?(:slice)

          render_error(:task, "is required", 400)
        end

        def render_error(field, message, status)
          error!({ errors: { field => [ message ] } }, status)
        end
      end
    end
  end
end
