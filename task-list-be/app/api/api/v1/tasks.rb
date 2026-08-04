module Api
  module V1
    class Tasks < Grape::API
      helpers do
        def task_params
          attributes = declared(params, include_missing: false)[:task]
          error!({ errors: { task: [ "is required" ] } }, 400) unless attributes.respond_to?(:slice)

          attributes.slice(:user_id, :title, :description, :due_at)
        end

        def update_task_params
          attributes = declared(params, include_missing: false)[:task]
          error!({ errors: { task: [ "is required" ] } }, 400) unless attributes.respond_to?(:slice)

          attributes.slice(:title, :description, :due_at)
        end

        def find_task
          Task.find_by(id: params[:id]) || error!({ errors: { task: [ "not found" ] } }, 404)
        end
      end

      resource :tasks do
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
              error!({ errors: task.errors.to_hash(true) }, 422)
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
          task = Task.new(task_params)

          if task.save
            status :created
            present task, with: Api::Entities::TaskEntity
          else
            error!({ errors: task.errors.to_hash(true) }, 422)
          end
        end
      end
    end
  end
end
