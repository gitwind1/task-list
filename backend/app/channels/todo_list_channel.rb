class TodoListChannel < ApplicationCable::Channel
  def subscribed
    stream_from "todo_list_#{params[:list_id]}"
  end

  def unsubscribed
  end
end
