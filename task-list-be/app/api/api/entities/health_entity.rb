module Api
  module Entities
    class HealthEntity < Grape::Entity
      expose :status, documentation: { type: "String", desc: "Health status" }
      expose :service, documentation: { type: "String", desc: "Service name" }
    end
  end
end
