module Api
  module Entities
    class UserEntity < Grape::Entity
      expose :id, documentation: { type: "Integer", desc: "User id" }
      expose :name, documentation: { type: "String", desc: "User name" }
      expose :email, documentation: { type: "String", desc: "User email" }
    end
  end
end
