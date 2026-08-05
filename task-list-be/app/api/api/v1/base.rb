module Api
  module V1
    class Base < Grape::API
      include Grape::Kaminari

      prefix :api
      version "v1", using: :path
      format :json
      default_format :json
      content_type :json, "application/json"

      rescue_from Grape::Exceptions::ValidationErrors do |error|
        error_response(message: Api::Root.validation_error_payload(error), status: 400)
      end

      mount Api::V1::Health
      mount Api::V1::Auth
      mount Api::V1::Tasks

      add_swagger_documentation(
        api_version: "v1",
        consumes: [ "application/json", "multipart/form-data" ],
        doc_version: "v1",
        hide_documentation_path: true,
        hide_format: true,
        info: {
          title: "Task List API",
          version: "v1"
        },
        mount_path: "/swagger_doc",
        produces: [ "application/json" ]
      )
    end
  end
end
