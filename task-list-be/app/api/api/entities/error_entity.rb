module Api
  module Entities
    class ErrorEntity < Grape::Entity
      expose :errors, documentation: { type: "Object", desc: "Error details keyed by field" }
    end
  end
end
