Rswag::Api.configure do |config|
  if config.respond_to?(:openapi_root=)
    config.openapi_root = Rails.root.join("swagger").to_s
  else
    config.swagger_root = Rails.root.join("swagger").to_s
  end
end
