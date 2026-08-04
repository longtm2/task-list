module Api
  module V1
    class HealthController < Api::BaseController
      def show
        render json: {
          status: "ok",
          service: "task-list-api"
        }
      end
    end
  end
end
