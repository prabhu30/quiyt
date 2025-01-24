import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("678fc23300192c3386c5");

export const account = new Account(client);
export const databases = new Databases(client);
