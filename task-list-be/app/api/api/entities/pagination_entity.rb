module Api
  module Entities
    class PaginationEntity < Grape::Entity
      expose :page, documentation: { type: "Integer", desc: "Current page" }
      expose :per_page, documentation: { type: "Integer", desc: "Number of records per page" }
      expose :total_count, documentation: { type: "Integer", desc: "Total number of records" }
      expose :total_pages, documentation: { type: "Integer", desc: "Total number of pages" }
      expose :has_next, documentation: { type: "Boolean", desc: "Whether there is a next page" }
      expose :has_previous, documentation: { type: "Boolean", desc: "Whether there is a previous page" }
    end
  end
end
