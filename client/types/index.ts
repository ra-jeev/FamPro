import { Models } from 'appwrite';

type Response = {
  status: string;
};

export interface Family extends Models.Team<Models.Preferences> {
  members: Models.Membership[];
}

export interface Jar extends Models.Document {}
export interface Transaction extends Models.Document {}

export interface FamilyResponse extends Response {
  family?: Family;
}

export interface JarsResponse extends Response {
  total: number;
  jars?: Jar[];
}

export interface TransactionsResponse extends Response {
  total: number;
  transactions?: Transaction[];
}
