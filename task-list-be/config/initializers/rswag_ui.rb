Rswag::Ui.configure do |config|
  endpoint_path = "/api-docs/v1/swagger.yaml"

  if config.respond_to?(:openapi_endpoint)
    config.openapi_endpoint endpoint_path, "Task List API V1"
  else
    config.swagger_endpoint endpoint_path, "Task List API V1"
  end
end
