Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  resources :lists, only: [] do
    resources :todos, only: [:index, :create, :update, :destroy]
  end
end
