class Rack::Attack
    throttle('req/ip', limit: 5000, period: 1.hour) do |req|
      req.ip
    end
  
    self.throttled_responder = lambda do |_env|
      [429, { 'Content-Type' => 'text/plain' }, ["Rate limit exceeded."]]
    end
  end