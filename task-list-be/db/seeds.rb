users = [
  { name: "Ava Stone", email: "ava.stone@boardpackager.example" },
  { name: "Minh Tran", email: "minh.tran@boardpackager.example" }
].index_by { |attributes| attributes[:email] }

users.each_value do |attributes|
  User.find_or_create_by!(email: attributes[:email]) do |user|
    user.name = attributes[:name]
  end
end

ava = User.find_by!(email: "ava.stone@boardpackager.example")
minh = User.find_by!(email: "minh.tran@boardpackager.example")
time_on = ->(date, hour) { Time.zone.local(date.year, date.month, date.day, hour) }
today = Time.zone.today

tasks = [
  {
    user: ava,
    title: "Prepare weekly priorities",
    description: "Create the task priority list for the team meeting.",
    due_at: time_on.call(today, 17),
    completed_at: nil
  },
  {
    user: ava,
    title: "Follow up overdue vendor task",
    description: "Contact the vendor and update the overdue status.",
    due_at: time_on.call(2.days.ago.to_date, 10),
    completed_at: nil
  },
  {
    user: ava,
    title: "Review completed onboarding checklist",
    description: "Confirm the checklist items completed last week.",
    due_at: time_on.call(1.day.ago.to_date, 15),
    completed_at: time_on.call(1.day.ago.to_date, 14)
  },
  {
    user: minh,
    title: "Draft sprint planning notes",
    description: "Prepare notes for the next sprint planning session.",
    due_at: time_on.call(3.days.from_now.to_date, 11),
    completed_at: nil
  },
  {
    user: minh,
    title: "Update release task board",
    description: "Move release tasks into the correct due-date order.",
    due_at: time_on.call(1.week.from_now.to_date, 16),
    completed_at: nil
  }
]

tasks.each do |attributes|
  task = Task.find_or_initialize_by(user: attributes[:user], title: attributes[:title])
  task.assign_attributes(attributes.except(:user, :title))
  task.save!
end
