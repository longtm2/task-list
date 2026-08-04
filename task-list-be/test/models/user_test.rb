require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "normalizes email before validation" do
    user = User.new(name: "Ava Stone", email: "  AVA@example.COM ")

    assert user.valid?
    assert_equal "ava@example.com", user.email
  end
end
