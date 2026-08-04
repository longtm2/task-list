module Api
  module V1
    class Health < Grape::API
      desc "Health check" do
        success Api::Entities::HealthEntity
      end
      get :health do
        present(
          {
            status: "ok",
            service: "task-list-api"
          },
          with: Api::Entities::HealthEntity
        )
      end
    end
  end
end
