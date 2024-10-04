class TodoService
  def initialize(list_id)
    @redis = Redis.new(url: ENV.fetch("REDIS_URL", "redis://localhost:6379/1"))
    @list_key = "todo_list:#{list_id}"
  end

  def all
    todos = @redis.get(@list_key)
    todos ? JSON.parse(todos) : []
  end

  def add(todo)
    todos = all
    todos << todo
    save(todos)
  end

  def update(todo_id, attributes)
    todos = all
    todos.map! do |todo|
      if todo['id'] == todo_id
        todo.merge(attributes)
      else
        todo
      end
    end
    save(todos)
  end

  def remove(todo_id)
    todos = all.reject { |todo| todo['id'] == todo_id }
    save(todos)
  end

  private

  def save(todos)
    @redis.set(@list_key, todos.to_json)
    todos
  end
end  
