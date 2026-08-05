module Api
  module V1
    module Helpers
      module AuthenticationHelpers
        def authenticate!
          current_user
        end

        def current_user
          @current_user ||= env.fetch("warden").user(:user) || render_unauthorized
        end

        private

        def render_unauthorized
          error!({ errors: { authentication: [ "is invalid or missing" ] } }, 401)
        end
      end
    end
  end
end
