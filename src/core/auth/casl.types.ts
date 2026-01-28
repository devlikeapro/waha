import { InferSubjects, MongoAbility } from '@casl/ability';

export class session {
  constructor(public name: string) {}
}

export class server {}

export enum Action {
  //
  // CASL
  //
  Manage = 'manage', // it's a special action in casl, meaning "any actions"
  //
  // Session
  //
  List = 'list', // list sessions
  Read = 'read', // read session info (not messages)
  Create = 'create', // create a new session
  Delete = 'delete', // delete a session
  Use = 'use', // all actions - send a message, retrieve, manage session status
}

type Subjects =
  | InferSubjects<typeof session | typeof server | 'session' | 'server'>
  | 'all';
type Actions = keyof typeof Action | Action | `${Action}`;
export type AppAbility = MongoAbility<[Actions, Subjects]>;
