require "test_helper"

class TaskTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(name: "Ava Stone", email: "ava@example.com")
  end

  test "detects overdue incomplete tasks" do
    task = @user.tasks.create!(
      title: "Prepare board report",
      description: "Collect the open task summary.",
      due_at: 1.hour.ago
    )

    assert task.overdue?
    assert_includes Task.overdue, task
  end

  test "completed tasks are not overdue" do
    task = @user.tasks.create!(
      title: "Review checklist",
      description: "Check the release checklist.",
      due_at: 1.hour.ago,
      completed_at: Time.current
    )

    assert task.completed?
    assert_not task.overdue?
    assert_not_includes Task.overdue, task
  end

  test "orders tasks by due date" do
    later_task = @user.tasks.create!(
      title: "Later task",
      description: "Due later.",
      due_at: 2.days.from_now
    )
    earlier_task = @user.tasks.create!(
      title: "Earlier task",
      description: "Due earlier.",
      due_at: 1.day.from_now
    )

    assert_equal [ earlier_task, later_task ], Task.ordered_by_due_at.to_a
  end
end
