module Api
  module V1
    class Tasks < Grape::API
      helpers do
        def task_params
          attributes = declared(params, include_missing: false)[:task]
          error!({ errors: { task: [ "is required" ] } }, 400) unless attributes.respond_to?(:slice)

          attributes.slice(:user_id, :title, :description, :due_at)
        end
      end

      resource :tasks do
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
