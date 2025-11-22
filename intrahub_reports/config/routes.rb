Rails.application.routes.draw do
  get "/api/metrics", to: "metrics#index"
end
