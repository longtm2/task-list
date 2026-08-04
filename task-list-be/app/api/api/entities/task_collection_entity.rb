module Api
  module Entities
    class TaskCollectionEntity < Grape::Entity
      expose :tasks,
        using: Api::Entities::TaskEntity,
        documentation: { type: "Array", desc: "Paginated tasks", is_array: true }
      expose :pagination,
        using: Api::Entities::PaginationEntity,
        documentation: { type: "Object", desc: "Pagination metadata" }
    end
  end
end
