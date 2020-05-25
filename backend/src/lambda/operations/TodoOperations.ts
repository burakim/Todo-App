import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DatabaseOperations } from './databaseOperations';
import { getUserId } from '../utils';
import { TodoItem } from "../../models/TodoItem";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";

const dbOperationFunctions = new DatabaseOperations();

export async function getAllTodos(
  event: APIGatewayProxyEvent
): Promise<TodoItem[]> {
  return dbOperationFunctions.getAllTodes(getUserId(event));
}

export function createTodo(
  event: APIGatewayProxyEvent
): Promise<TodoItem> {
    console.log("Creating todo Item");
  const newTodo: CreateTodoRequest =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  return  dbOperationFunctions.createTodo({
    userId: getUserId(event),
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  });
}
export async function generateUploadUrl(
  event: APIGatewayProxyEvent
): Promise<string> {
    console.log("Creating upload url");
  return dbOperationFunctions.generateUploadUrl(
    event.pathParameters.todoId, 
    getUserId(event));
}
export async function updateTodo(event: APIGatewayProxyEvent) {
    console.log("Updating todo Item");
  return dbOperationFunctions.updateTodo(
    getUserId(event),
    event.pathParameters.todoId,
    JSON.parse(event.body)
      );
}
export async function deleteTodo(event: APIGatewayProxyEvent) {
    console.log("Deleting todo Item");
  return dbOperationFunctions.deleteTodo(event.pathParameters.todoId, getUserId(event));
}