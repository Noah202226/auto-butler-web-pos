// lib/appwrite.ts

import { Client, Account, Databases } from "appwrite";

export const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;

export { ID } from "appwrite";

// NEXT_PUBLIC_APPWRITE_PROJECT_ID = "68d0e534000b65cac408";
// NEXT_PUBLIC_APPWRITE_PROJECT_NAME = "dental-care2";
// NEXT_PUBLIC_APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
