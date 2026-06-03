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
  // Session Management
  //
  List = 'list', // list sessions
  Retrieve = 'retrieve', // retrieve session info (not messages)
  Create = 'create', // create a new session
  Delete = 'delete', // delete a session
  Setting = 'setting', // session config: update session settings
  Control = 'control', // session lifecycle: start, stop, restart, logout, authenticate
  App = 'app', // manage apps
  //
  // Session Operations
  //
  Read = 'read', // read session data (messages, contacts, chats, groups, etc.)
  Send = 'send', // send messages + manage session entities (groups, labels, channels, contacts, profile)
}

export type SessionActions = Partial<
  Record<
    Extract<
      Action,
      | Action.Delete
      | Action.Setting
      | Action.Control
      | Action.App
      | Action.Read
      | Action.Send
    >,
    boolean
  >
>;

type Subjects =
  | InferSubjects<typeof session | typeof server | 'session' | 'server'>
  | 'all';
type Actions = keyof typeof Action | Action | `${Action}`;
export type AppAbility = MongoAbility<[Actions, Subjects]>;
