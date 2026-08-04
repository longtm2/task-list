module Api
  module V1
    class Tasks < Grape::API
      helpers Api::V1::Helpers::TaskHelpers

      resource :tasks do
        desc "List all tasks" do
          success Api::Entities::TaskEntity
        end
        params do
          optional :due_by_today, type: Boolean, desc: "Only include tasks due by the end of today"
        end
        get do
          present tasks_collection, with: Api::Entities::TaskEntity
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
            task.mark_completed!

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
            optional :user_id, type: Integer, desc: "User id"
            optional :title, type: String, desc: "Task title"
            optional :description, type: String, desc: "Task description"
            optional :due_at, type: String, desc: "Date and time the task should be completed"
          end
        end
        post do
          task = Task.new(create_task_params)

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
