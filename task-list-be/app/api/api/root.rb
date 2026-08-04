module Api
  class Root < Grape::API
    format :json
    default_format :json
    content_type :json, "application/json"

    rescue_from Grape::Exceptions::ValidationErrors do |error|
      error_response(message: Api::Root.validation_error_payload(error), status: 400)
    end

    mount Api::V1::Base

    def self.validation_error_payload(error)
      errors = error.full_messages.each_with_object({}) do |message, result|
        field, detail = message.split(" ", 2)
        detail = "is required" if detail == "is missing"
        result[field] ||= []
        result[field] << detail
      end

      { errors: errors }
    end
  end
end
