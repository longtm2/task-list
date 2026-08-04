require "test_helper"
require "yaml"

class SwaggerDocsTest < ActionDispatch::IntegrationTest
  test "serves the OpenAPI document" do
    get "/api-docs/v1/swagger.yaml"

    assert_response :success
    assert_equal "text/yaml", response.media_type

    document = YAML.safe_load(response.body)
    assert_equal "3.0.3", document.fetch("openapi")
    assert_includes document.fetch("paths"), "/api/v1/health"
  end
end
