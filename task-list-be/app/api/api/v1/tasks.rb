module Api
  module V1
    class Tasks < Grape::API
      include Grape::Kaminari

      helpers Api::V1::Helpers::TaskHelpers
      helpers Api::V1::Helpers::AuthenticationHelpers

      resource :tasks do
        before { authenticate! }

        desc "List all tasks" do
          success Api::Entities::TaskCollectionEntity
        end
        params do
          optional :due_by_today, type: Boolean, desc: "Only include tasks due by the end of today"
          optional :status, type: String, values: %w[open completed overdue], desc: "Filter by task status"
          optional :due_from, type: Date, desc: "Only include tasks due on or after this date"
          optional :due_to, type: Date, desc: "Only include tasks due on or before this date"
          optional :query, type: String, desc: "Search title and description"
          use :pagination, per_page: 10, max_per_page: 50
        end
        get do
          present paginated_tasks_collection, with: Api::Entities::TaskCollectionEntity
        end

        params do
          requires :id, type: Integer, desc: "Task id"
        end
        route_param :id do
          desc "Open a single task" do
            success Api::Entities::TaskEntity
            failure [
              [ 404, "Not Found", Api::Entities::ErrorEntity ]
            ]
          end
          get do
            present find_task, with: Api::Entities::TaskEntity
          end

          desc "Edit a task" do
            success Api::Entities::TaskEntity
            failure [
              [ 400, "Bad Request", Api::Entities::ErrorEntity ],
              [ 404, "Not Found", Api::Entities::ErrorEntity ],
              [ 422, "Validation Error", Api::Entities::ErrorEntity ]
            ]
          end
          params do
            optional :task, type: Hash, desc: "Task attributes" do
              optional :title, type: String, desc: "Task title"
              optional :description, type: String, desc: "Task description"
              optional :due_at, type: String, desc: "Date and time the task should be completed"
            end
          end
          patch do
            task = find_task

            if task.update(update_task_params)
              present task, with: Api::Entities::TaskEntity
            else
              render_validation_errors(task)
            end
          end

          desc "Upload a supporting file" do
            consumes [ "multipart/form-data" ]
            success Api::Entities::AttachmentEntity
            failure [
              [ 404, "Not Found", Api::Entities::ErrorEntity ]
            ]
          end
          params do
            requires :file, type: File, desc: "Supporting file"
          end
          post :attachments do
            task = find_task
            uploaded_file = supporting_file
            task.attachments.attach(
              io: uploaded_file.fetch(:tempfile),
              filename: uploaded_file.fetch(:filename),
              content_type: uploaded_file.fetch(:type)
            )
            attachment = task.attachments_attachments.order(:id).last

            present attachment, with: Api::Entities::AttachmentEntity
          end

          params do
            requires :attachment_id, type: Integer, desc: "Attachment id"
          end
          desc "Download a supporting file" do
            failure [ [ 404, "Not Found", Api::Entities::ErrorEntity ] ]
          end
          get "attachments/:attachment_id/download" do
            attachment = find_attachment(find_task)
            redirect Rails.application.routes.url_helpers.rails_blob_url(
              attachment.blob,
              disposition: "attachment",
              host: request.env.fetch("HTTP_HOST"),
              protocol: request.env.fetch("rack.url_scheme")
            )
          end

          params do
            requires :attachment_id, type: Integer, desc: "Attachment id"
          end
          desc "Delete a supporting file" do
            failure [ [ 404, "Not Found", Api::Entities::ErrorEntity ] ]
          end
          delete "attachments/:attachment_id" do
            find_attachment(find_task).purge
            status 204
          end

          desc "Delete a task" do
            failure [
              [ 404, "Not Found", Api::Entities::ErrorEntity ]
            ]
          end
          delete do
            find_task.destroy!
            status 204
          end

          desc "Mark a task as completed" do
            success Api::Entities::TaskEntity
            failure [
              [ 404, "Not Found", Api::Entities::ErrorEntity ]
            ]
          end
          patch :complete do
            task = find_task
            task.mark_completed!(completed_by: current_user)

            present task, with: Api::Entities::TaskEntity
          end
        end

        desc "Create a task" do
          success Api::Entities::TaskEntity
          failure [
            [ 400, "Bad Request", Api::Entities::ErrorEntity ],
            [ 422, "Validation Error", Api::Entities::ErrorEntity ]
          ]
        end
        params do
          optional :task, type: Hash, desc: "Task attributes" do
            optional :title, type: String, desc: "Task title"
            optional :description, type: String, desc: "Task description"
            optional :due_at, type: String, desc: "Date and time the task should be completed"
          end
        end
        post do
          task = current_user.tasks.new(create_task_params)

          if task.save
            status :created
            present task, with: Api::Entities::TaskEntity
          else
            render_validation_errors(task)
          end
        end
      end
    end
  end
end
