require "test_helper"

class ApiV1HealthTest < ActionDispatch::IntegrationTest
  test "returns healthy status" do
    get "/api/v1/health"

    assert_response :success
    assert_equal "application/json", response.media_type
    assert_equal(
      {
        "status" => "ok",
        "service" => "task-list-api"
      },
      JSON.parse(response.body)
    )
  end
end
