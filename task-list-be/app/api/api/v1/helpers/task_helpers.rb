module Api
  module V1
    module Helpers
      module TaskHelpers
        CREATE_ATTRIBUTES = %i[title description due_at].freeze
        MAXIMUM_ATTACHMENT_SIZE = 10.megabytes
        UPDATE_ATTRIBUTES = %i[title description due_at].freeze

        def create_task_params
          permitted_task_params(CREATE_ATTRIBUTES)
        end

        def update_task_params
          permitted_task_params(UPDATE_ATTRIBUTES)
        end

        def find_task
          current_user.tasks.with_attached_attachments.includes(:created_by, :completed_by).find_by(id: params[:id]) || render_error(:task, "not found", 404)
        end

        def find_attachment(task)
          task.attachments_attachments.find_by(id: params[:attachment_id]) || render_error(:attachment, "not found", 404)
        end

        def supporting_file
          uploaded_file = params.fetch(:file)
          return uploaded_file if uploaded_file.fetch(:tempfile).size <= MAXIMUM_ATTACHMENT_SIZE

          render_error(:file, "must be 10 MB or smaller", 422)
        end

        def render_validation_errors(record)
          error!({ errors: record.errors.to_hash(true) }, 422)
        end

        def tasks_collection
          current_user.tasks.for_list(**task_list_filters)
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

        def task_list_filters
          declared(params, include_missing: false)
            .slice(:due_by_today, :due_from, :due_to, :query, :status)
            .each_with_object({}) do |(key, value), filters|
              filters[key.to_sym] = value
            end
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
