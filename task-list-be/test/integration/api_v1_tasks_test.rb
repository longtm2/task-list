require "test_helper"

class ApiV1TasksTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(name: "Ava Stone", email: "ava@example.com")
    @task = @user.tasks.create!(
      title: "Review board packet",
      description: "Open and review the latest board packet tasks.",
      due_at: 1.day.from_now.change(usec: 0)
    )
  end

  test "opens a single task" do
    get "/api/v1/tasks/#{@task.id}"

    assert_response :success
    assert_equal "application/json", response.media_type

    body = JSON.parse(response.body)
    assert_equal @task.id, body.fetch("id")
    assert_equal @user.id, body.fetch("user_id")
    assert_equal "Review board packet", body.fetch("title")
    assert_equal "Open and review the latest board packet tasks.", body.fetch("description")
    assert_equal @task.due_at.iso8601, body.fetch("due_at")
    assert_equal @task.created_at.iso8601, body.fetch("created_at")
    assert_equal false, body.fetch("completed")
    assert_equal false, body.fetch("overdue")
  end

  test "returns not found when opening a missing task" do
    get "/api/v1/tasks/0"

    assert_response :not_found
    assert_equal(
      { "errors" => { "task" => [ "not found" ] } },
      JSON.parse(response.body)
    )
  end

  test "marks a task as completed" do
    patch "/api/v1/tasks/#{@task.id}/complete"

    assert_response :success
    assert_equal "application/json", response.media_type

    body = JSON.parse(response.body)
    task = @task.reload

    assert task.completed?
    assert_equal @task.id, body.fetch("id")
    assert_equal true, body.fetch("completed")
    assert_equal false, body.fetch("overdue")
    assert_equal task.completed_at.iso8601, body.fetch("completed_at")
  end

  test "returns not found when completing a missing task" do
    patch "/api/v1/tasks/0/complete"

    assert_response :not_found
    assert_equal(
      { "errors" => { "task" => [ "not found" ] } },
      JSON.parse(response.body)
    )
  end

  test "creates a task" do
    due_at = 2.days.from_now.change(usec: 0)

    assert_difference "Task.count", 1 do
      post "/api/v1/tasks", params: {
        task: {
          user_id: @user.id,
          title: "Prepare weekly priorities",
          description: "Create the task priority list for the team meeting.",
          due_at: due_at.iso8601
        }
      }, as: :json
    end

    assert_response :created
    assert_equal "application/json", response.media_type

    body = JSON.parse(response.body)
    task = Task.find(body.fetch("id"))

    assert_equal @user.id, body.fetch("user_id")
    assert_equal "Prepare weekly priorities", body.fetch("title")
    assert_equal "Create the task priority list for the team meeting.", body.fetch("description")
    assert_equal task.due_at.iso8601, body.fetch("due_at")
    assert_equal task.created_at.iso8601, body.fetch("created_at")
    assert_nil body.fetch("completed_at")
    assert_equal false, body.fetch("completed")
    assert_equal false, body.fetch("overdue")
  end

  test "returns validation errors" do
    assert_no_difference "Task.count" do
      post "/api/v1/tasks", params: {
        task: {
          user_id: @user.id,
          title: "",
          description: "",
          due_at: ""
        }
      }, as: :json
    end

    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert_includes body.fetch("errors"), "title"
    assert_includes body.fetch("errors"), "description"
    assert_includes body.fetch("errors"), "due_at"
  end

  test "requires task params" do
    assert_no_difference "Task.count" do
      post "/api/v1/tasks", params: {}, as: :json
    end

    assert_response :bad_request
    assert_equal(
      { "errors" => { "task" => [ "is required" ] } },
      JSON.parse(response.body)
    )
  end
end
