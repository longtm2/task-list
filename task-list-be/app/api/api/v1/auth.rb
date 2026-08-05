module Api
  module V1
    class Auth < Grape::API
      helpers Api::V1::Helpers::AuthenticationHelpers

      resource :auth do
        desc "Sign in with email and password" do
          success Api::Entities::UserEntity
          failure [ [ 401, "Unauthorized", Api::Entities::ErrorEntity ] ]
        end
        params do
          requires :email, type: String, desc: "User email"
          requires :password, type: String, desc: "User password"
        end
        post :login do
          user = User.find_for_database_authentication(email: params[:email].to_s.strip.downcase)
          error!({ errors: { credentials: [ "are invalid" ] } }, 401) unless user&.valid_password?(params[:password])

          env.fetch("warden").set_user(user, scope: :user)
          status :ok
          present user, with: Api::Entities::UserEntity
        end

        desc "Return the authenticated user" do
          success Api::Entities::UserEntity
          failure [ [ 401, "Unauthorized", Api::Entities::ErrorEntity ] ]
        end
        get :me do
          present current_user, with: Api::Entities::UserEntity
        end

        desc "Sign out and clear the current Devise session" do
          failure [ [ 401, "Unauthorized", Api::Entities::ErrorEntity ] ]
        end
        delete :logout do
          env.fetch("warden").logout(:user)
          status 204
        end
      end
    end
  end
end
