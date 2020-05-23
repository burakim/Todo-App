import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../../models/TodoItem";
import { TodoUpdate } from "../../models/TodoUpdate";

const XAWS = AWSXRay.captureAWS(AWS);

export class DatabaseOperations {
    private docClient: DocumentClient = createDynamoDBClient();
    private S3;
    private todosTable;
    private bucket;
    private index;

  constructor() {
    this.docClient = createDynamoDBClient(),
    this.S3 = createS3Bucket();
    this.todosTable = "todoTable";
    this.bucket = "todo-attachments";
    this.index = "todoSecondaryIndex";
  }

  async getAllTodes(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.index,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      })
      .promise();
    return result.Items as TodoItem[];
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise();
    return todo;
  }

  async deleteTodo(todoId: string, userId: string) {
    const deletedTodo = await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: { userId, todoId }
      })
      .promise();
    return deletedTodo;
  }
  async updateTodo(userId: string, todoId: string, updatedTodo: TodoUpdate) {
    const updtedTodo = await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: "set name=:todoName, dueDate=:dueDate, done=:done",
        ExpressionAttributeValues: {
          ":todoName": updatedTodo.name,
          ":dueDate": updatedTodo.dueDate,
          ":done": updatedTodo.done
        },
        ReturnValues: "UPDATED_NEW"
      })
      .promise();
    return updtedTodo;
  }
  async generateUploadUrl(todoId: string, userId: string): Promise<string> {
    const uploadUrl = this.S3.getSignedUrl("putObject", {
      Bucket: this.bucket,
      Key: todoId,
      Expires: 3600
    });
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: "set attachmentUrl=:URL",
        ExpressionAttributeValues: {
          ":URL": uploadUrl.split("?")[0]
        },
        ReturnValues: "UPDATED_NEW"
      })
      .promise();

    return uploadUrl;
  }
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient();
}

function createS3Bucket() {
  return new XAWS.S3({
    signatureVersion: "v4"
  });
}