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

  test "lists all tasks sorted by due date" do
    overdue_task = @user.tasks.create!(
      title: "Follow up overdue task",
      description: "Check the task that missed its due date.",
      due_at: 1.day.ago.change(usec: 0)
    )
    today_task = @user.tasks.create!(
      title: "Finish today's task",
      description: "Complete the task before the end of today.",
      due_at: Time.zone.today.end_of_day.change(usec: 0)
    )
    future_task = @user.tasks.create!(
      title: "Prepare future task",
      description: "Prepare the task due later this week.",
      due_at: 3.days.from_now.change(usec: 0)
    )

    get "/api/v1/tasks"

    assert_response :success
    assert_equal "application/json", response.media_type

    body = JSON.parse(response.body)
    tasks = body.fetch("tasks")
    pagination = body.fetch("pagination")

    assert_equal [ overdue_task.id, today_task.id, @task.id, future_task.id ], tasks.map { |task| task.fetch("id") }
    assert_equal true, tasks.find { |task| task.fetch("id") == overdue_task.id }.fetch("overdue")
    assert_equal false, tasks.find { |task| task.fetch("id") == today_task.id }.fetch("overdue")
    assert_equal 1, pagination.fetch("page")
    assert_equal 10, pagination.fetch("per_page")
    assert_equal 4, pagination.fetch("total_count")
    assert_equal 1, pagination.fetch("total_pages")
    assert_equal false, pagination.fetch("has_next")
    assert_equal false, pagination.fetch("has_previous")
  end

  test "limits listed tasks to those due by the end of today" do
    overdue_task = @user.tasks.create!(
      title: "Follow up overdue task",
      description: "Check the task that missed its due date.",
      due_at: 1.day.ago.change(usec: 0)
    )
    today_task = @user.tasks.create!(
      title: "Finish today's task",
      description: "Complete the task before the end of today.",
      due_at: Time.zone.today.end_of_day.change(usec: 0)
    )

    get "/api/v1/tasks", params: { due_by_today: true }

    assert_response :success

    body = JSON.parse(response.body)
    assert_equal [ overdue_task.id, today_task.id ], body.fetch("tasks").map { |task| task.fetch("id") }
    assert_equal 2, body.fetch("pagination").fetch("total_count")
  end

  test "paginates listed tasks" do
    Task.delete_all
    tasks = 12.times.map do |index|
      @user.tasks.create!(
        title: "Task #{index + 1}",
        description: "Paginated task #{index + 1}",
        due_at: (index + 1).hours.from_now.change(usec: 0)
      )
    end

    get "/api/v1/tasks", params: { page: 2, per_page: 5 }

    assert_response :success

    body = JSON.parse(response.body)
    pagination = body.fetch("pagination")

    assert_equal tasks[5, 5].map(&:id), body.fetch("tasks").map { |task| task.fetch("id") }
    assert_equal 2, pagination.fetch("page")
    assert_equal 5, pagination.fetch("per_page")
    assert_equal 12, pagination.fetch("total_count")
    assert_equal 3, pagination.fetch("total_pages")
    assert_equal true, pagination.fetch("has_next")
    assert_equal true, pagination.fetch("has_previous")
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

  test "edits a task" do
    due_at = 3.days.from_now.change(usec: 0)

    patch "/api/v1/tasks/#{@task.id}", params: {
      task: {
        title: "Update board packet review",
        description: "Review the updated packet and confirm due-date changes.",
        due_at: due_at.iso8601
      }
    }, as: :json

    assert_response :success
    assert_equal "application/json", response.media_type

    body = JSON.parse(response.body)
    task = @task.reload

    assert_equal @task.id, body.fetch("id")
    assert_equal @user.id, body.fetch("user_id")
    assert_equal "Update board packet review", task.title
    assert_equal "Update board packet review", body.fetch("title")
    assert_equal "Review the updated packet and confirm due-date changes.", task.description
    assert_equal "Review the updated packet and confirm due-date changes.", body.fetch("description")
    assert_equal due_at.iso8601, task.due_at.iso8601
    assert_equal due_at.iso8601, body.fetch("due_at")
  end

  test "does not allow editing task user" do
    other_user = User.create!(name: "Minh Tran", email: "minh@example.com")

    patch "/api/v1/tasks/#{@task.id}", params: {
      task: {
        user_id: other_user.id,
        title: "Review packet owner",
        description: "Confirm the task owner cannot be changed through update.",
        due_at: 2.days.from_now.iso8601
      }
    }, as: :json

    assert_response :success
    assert_equal @user.id, @task.reload.user_id
    assert_equal @user.id, JSON.parse(response.body).fetch("user_id")
  end

  test "returns validation errors when editing a task" do
    patch "/api/v1/tasks/#{@task.id}", params: {
      task: {
        title: "",
        description: "",
        due_at: ""
      }
    }, as: :json

    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert_includes body.fetch("errors"), "title"
    assert_includes body.fetch("errors"), "description"
    assert_includes body.fetch("errors"), "due_at"
  end

  test "requires task params when editing a task" do
    patch "/api/v1/tasks/#{@task.id}", params: {}, as: :json

    assert_response :bad_request
    assert_equal(
      { "errors" => { "task" => [ "is required" ] } },
      JSON.parse(response.body)
    )
  end

  test "returns not found when editing a missing task" do
    patch "/api/v1/tasks/0", params: {
      task: {
        title: "Missing task",
        description: "This task does not exist.",
        due_at: 1.day.from_now.iso8601
      }
    }, as: :json

    assert_response :not_found
    assert_equal(
      { "errors" => { "task" => [ "not found" ] } },
      JSON.parse(response.body)
    )
  end

  test "deletes a task" do
    assert_difference "Task.count", -1 do
      delete "/api/v1/tasks/#{@task.id}"
    end

    assert_response :no_content
    assert_empty response.body
    assert_nil Task.find_by(id: @task.id)
  end

  test "returns not found when deleting a missing task" do
    assert_no_difference "Task.count" do
      delete "/api/v1/tasks/0"
    end

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
