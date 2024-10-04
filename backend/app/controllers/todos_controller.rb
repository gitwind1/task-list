class TodosController < ApplicationController
  before_action :set_list_id
  
  def index
    todo_service = TodoService.new(@list_id)
    render json: todo_service.all
  end

  def create
    todo_service = TodoService.new(@list_id)
    new_todo = {
        id: SecureRandom.uuid,
        text: params[:text],
        completed: false
    }
    todos = todo_service.add(new_todo)
    broadcast(todos)
    render json: new_todo, status: :created
  end

  def update
    todo_service = TodoService.new(@list_id)
    todo_id = params[:id]
    attributes = todo_params
    todos = todo_service.update(todo_id, attributes)
    broadcast(todos)
    head :no_content
  end

  def destroy
    todo_service = TodoService.new(@list_id)
    todo_id = params[:id]
    todos = todo_service.remove(todo_id)
    broadcast(todos)
    head :no_content
  end

  private

  def set_list_id
    @list_id = params[:list_id]
  end

  def todo_params
    params.require(:todo).permit(:text, :completed)
  end

  def broadcast(todos)
    ActionCable.server.broadcast("todo_list_#{@list_id}", todos)
  end
end
