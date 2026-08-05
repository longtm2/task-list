require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "normalizes email before validation" do
    user = User.new(name: "Ava Stone", email: "  AVA@example.COM ", password: "tasklist123")

    assert user.valid?
    assert_equal "ava@example.com", user.email
  end

  test "authenticates passwords through Devise" do
    user = User.create!(name: "Ava Stone", email: "ava@example.com", password: "tasklist123")

    assert user.valid_password?("tasklist123")
    assert_not user.valid_password?("incorrect")
  end
end
