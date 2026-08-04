require "test_helper"

class SwaggerDocsTest < ActionDispatch::IntegrationTest
  test "serves the OpenAPI document" do
    get "/api/v1/swagger_doc"

    assert_response :success
    assert_equal "application/json", response.media_type

    document = JSON.parse(response.body)
    assert_equal "2.0", document.fetch("swagger")
    assert_includes document.fetch("paths"), "/api/v1/health"
    assert_includes document.fetch("paths"), "/api/v1/tasks"
  end
end
