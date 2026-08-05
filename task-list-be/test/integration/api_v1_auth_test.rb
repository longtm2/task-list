require "test_helper"

class ApiV1AuthTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(name: "Ava Stone", email: "ava@example.com", password: "tasklist123")
  end

  test "signs in, returns the current user and signs out" do
    post "/api/v1/auth/login", params: { email: @user.email, password: "tasklist123" }, as: :json

    assert_response :success
    user = JSON.parse(response.body)
    assert_equal @user.id, user.fetch("id")
    assert_not user.key?("token")

    get "/api/v1/auth/me"

    assert_response :success
    assert_equal @user.email, JSON.parse(response.body).fetch("email")

    delete "/api/v1/auth/logout"

    assert_response :no_content

    get "/api/v1/auth/me"

    assert_response :unauthorized
  end

  test "rejects invalid credentials and missing task authentication" do
    post "/api/v1/auth/login", params: { email: @user.email, password: "incorrect" }, as: :json

    assert_response :unauthorized

    get "/api/v1/tasks"

    assert_response :unauthorized
  end
end
