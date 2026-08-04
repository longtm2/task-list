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

        def paginated_tasks_collection
          tasks = paginate(tasks_collection)

          {
            tasks:,
            pagination: pagination_metadata(tasks)
          }
        end

        private

        def pagination_metadata(tasks)
          {
            page: tasks.current_page,
            per_page: tasks.limit_value,
            total_count: tasks.total_count,
            total_pages: tasks.total_pages,
            has_next: tasks.next_page.present?,
            has_previous: tasks.prev_page.present?
          }
        end

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
