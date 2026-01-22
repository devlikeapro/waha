// source: gows.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

goog.exportSymbol('proto.messages.AudioInfo', null, global);
goog.exportSymbol('proto.messages.ButtonReplyRequest', null, global);
goog.exportSymbol('proto.messages.CancelEventMessageRequest', null, global);
goog.exportSymbol('proto.messages.ChatFilter', null, global);
goog.exportSymbol('proto.messages.ChatLabelRequest', null, global);
goog.exportSymbol('proto.messages.ChatPresence', null, global);
goog.exportSymbol('proto.messages.ChatPresenceRequest', null, global);
goog.exportSymbol('proto.messages.ChatUnreadRequest', null, global);
goog.exportSymbol('proto.messages.CheckPhonesRequest', null, global);
goog.exportSymbol('proto.messages.CheckPhonesResponse', null, global);
goog.exportSymbol('proto.messages.CreateGroupRequest', null, global);
goog.exportSymbol('proto.messages.CreateNewsletterRequest', null, global);
goog.exportSymbol('proto.messages.DeleteLabelRequest', null, global);
goog.exportSymbol('proto.messages.DownloadMediaRequest', null, global);
goog.exportSymbol('proto.messages.DownloadMediaResponse', null, global);
goog.exportSymbol('proto.messages.EditMessageRequest', null, global);
goog.exportSymbol('proto.messages.Empty', null, global);
goog.exportSymbol('proto.messages.EntityByIdRequest', null, global);
goog.exportSymbol('proto.messages.EventJson', null, global);
goog.exportSymbol('proto.messages.EventLocation', null, global);
goog.exportSymbol('proto.messages.EventMessage', null, global);
goog.exportSymbol('proto.messages.GetChatsRequest', null, global);
goog.exportSymbol('proto.messages.GetContactsRequest', null, global);
goog.exportSymbol('proto.messages.GetLabelsRequest', null, global);
goog.exportSymbol('proto.messages.GetLidsRequest', null, global);
goog.exportSymbol('proto.messages.GetMessagesRequest', null, global);
goog.exportSymbol('proto.messages.GetNewsletterMessagesByInviteRequest', null, global);
goog.exportSymbol('proto.messages.GroupCodeRequest', null, global);
goog.exportSymbol('proto.messages.JidBoolRequest', null, global);
goog.exportSymbol('proto.messages.JidRequest', null, global);
goog.exportSymbol('proto.messages.JidStringRequest', null, global);
goog.exportSymbol('proto.messages.Json', null, global);
goog.exportSymbol('proto.messages.JsonList', null, global);
goog.exportSymbol('proto.messages.Label', null, global);
goog.exportSymbol('proto.messages.LinkPreview', null, global);
goog.exportSymbol('proto.messages.ListMessage', null, global);
goog.exportSymbol('proto.messages.Location', null, global);
goog.exportSymbol('proto.messages.LogLevel', null, global);
goog.exportSymbol('proto.messages.MarkReadRequest', null, global);
goog.exportSymbol('proto.messages.Media', null, global);
goog.exportSymbol('proto.messages.MediaType', null, global);
goog.exportSymbol('proto.messages.MessageFilters', null, global);
goog.exportSymbol('proto.messages.MessageReaction', null, global);
goog.exportSymbol('proto.messages.MessageRequest', null, global);
goog.exportSymbol('proto.messages.MessageResponse', null, global);
goog.exportSymbol('proto.messages.NewMessageIDResponse', null, global);
goog.exportSymbol('proto.messages.Newsletter', null, global);
goog.exportSymbol('proto.messages.NewsletterInfoRequest', null, global);
goog.exportSymbol('proto.messages.NewsletterList', null, global);
goog.exportSymbol('proto.messages.NewsletterListRequest', null, global);
goog.exportSymbol('proto.messages.NewsletterSearchPageResult', null, global);
goog.exportSymbol('proto.messages.NewsletterToggleFollowRequest', null, global);
goog.exportSymbol('proto.messages.NewsletterToggleMuteRequest', null, global);
goog.exportSymbol('proto.messages.OptionalBool', null, global);
goog.exportSymbol('proto.messages.OptionalDouble', null, global);
goog.exportSymbol('proto.messages.OptionalInt64', null, global);
goog.exportSymbol('proto.messages.OptionalString', null, global);
goog.exportSymbol('proto.messages.OptionalUInt32', null, global);
goog.exportSymbol('proto.messages.OptionalUInt64', null, global);
goog.exportSymbol('proto.messages.Pagination', null, global);
goog.exportSymbol('proto.messages.PairCodeRequest', null, global);
goog.exportSymbol('proto.messages.PairCodeResponse', null, global);
goog.exportSymbol('proto.messages.ParticipantAction', null, global);
goog.exportSymbol('proto.messages.PhoneInfo', null, global);
goog.exportSymbol('proto.messages.PollMessage', null, global);
goog.exportSymbol('proto.messages.PollVoteMessage', null, global);
goog.exportSymbol('proto.messages.Presence', null, global);
goog.exportSymbol('proto.messages.PresenceRequest', null, global);
goog.exportSymbol('proto.messages.ProfileNameRequest', null, global);
goog.exportSymbol('proto.messages.ProfilePictureRequest', null, global);
goog.exportSymbol('proto.messages.ProfilePictureResponse', null, global);
goog.exportSymbol('proto.messages.ProfileStatusRequest', null, global);
goog.exportSymbol('proto.messages.ReceiptType', null, global);
goog.exportSymbol('proto.messages.RejectCallRequest', null, global);
goog.exportSymbol('proto.messages.RevokeMessageRequest', null, global);
goog.exportSymbol('proto.messages.Row', null, global);
goog.exportSymbol('proto.messages.SearchNewslettersByTextRequest', null, global);
goog.exportSymbol('proto.messages.SearchNewslettersByViewRequest', null, global);
goog.exportSymbol('proto.messages.SearchPage', null, global);
goog.exportSymbol('proto.messages.SearchPageResult', null, global);
goog.exportSymbol('proto.messages.Section', null, global);
goog.exportSymbol('proto.messages.Session', null, global);
goog.exportSymbol('proto.messages.SessionConfig', null, global);
goog.exportSymbol('proto.messages.SessionIgnoreJidsConfig', null, global);
goog.exportSymbol('proto.messages.SessionLogConfig', null, global);
goog.exportSymbol('proto.messages.SessionProxyConfig', null, global);
goog.exportSymbol('proto.messages.SessionStateResponse', null, global);
goog.exportSymbol('proto.messages.SessionStoreConfig', null, global);
goog.exportSymbol('proto.messages.SetPictureRequest', null, global);
goog.exportSymbol('proto.messages.SetProfilePictureRequest', null, global);
goog.exportSymbol('proto.messages.SortBy', null, global);
goog.exportSymbol('proto.messages.SortBy.Order', null, global);
goog.exportSymbol('proto.messages.StartSessionRequest', null, global);
goog.exportSymbol('proto.messages.SubscribePresenceRequest', null, global);
goog.exportSymbol('proto.messages.UpdateContactRequest', null, global);
goog.exportSymbol('proto.messages.UpdateParticipantsRequest', null, global);
goog.exportSymbol('proto.messages.UpsertLabelRequest', null, global);
goog.exportSymbol('proto.messages.vCardContact', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.OptionalString = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.OptionalString, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.OptionalString.displayName = 'proto.messages.OptionalString';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.OptionalUInt32 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.OptionalUInt32, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.OptionalUInt32.displayName = 'proto.messages.OptionalUInt32';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.OptionalUInt64 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.OptionalUInt64, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.OptionalUInt64.displayName = 'proto.messages.OptionalUInt64';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.OptionalInt64 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.OptionalInt64, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.OptionalInt64.displayName = 'proto.messages.OptionalInt64';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.OptionalBool = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.OptionalBool, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.OptionalBool.displayName = 'proto.messages.OptionalBool';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.OptionalDouble = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.OptionalDouble, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.OptionalDouble.displayName = 'proto.messages.OptionalDouble';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.JidRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.JidRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.JidRequest.displayName = 'proto.messages.JidRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.JidStringRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.JidStringRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.JidStringRequest.displayName = 'proto.messages.JidStringRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.JidBoolRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.JidBoolRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.JidBoolRequest.displayName = 'proto.messages.JidBoolRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.EventJson = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.EventJson, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.EventJson.displayName = 'proto.messages.EventJson';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.PairCodeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.PairCodeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.PairCodeRequest.displayName = 'proto.messages.PairCodeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.PairCodeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.PairCodeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.PairCodeResponse.displayName = 'proto.messages.PairCodeResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Empty = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.Empty, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Empty.displayName = 'proto.messages.Empty';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SessionLogConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SessionLogConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SessionLogConfig.displayName = 'proto.messages.SessionLogConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SessionStoreConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SessionStoreConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SessionStoreConfig.displayName = 'proto.messages.SessionStoreConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SessionProxyConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SessionProxyConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SessionProxyConfig.displayName = 'proto.messages.SessionProxyConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SessionIgnoreJidsConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SessionIgnoreJidsConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SessionIgnoreJidsConfig.displayName = 'proto.messages.SessionIgnoreJidsConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SessionConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SessionConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SessionConfig.displayName = 'proto.messages.SessionConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.StartSessionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.StartSessionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.StartSessionRequest.displayName = 'proto.messages.StartSessionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SessionStateResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SessionStateResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SessionStateResponse.displayName = 'proto.messages.SessionStateResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Session = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.Session, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Session.displayName = 'proto.messages.Session';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ProfileNameRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.ProfileNameRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ProfileNameRequest.displayName = 'proto.messages.ProfileNameRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ProfileStatusRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.ProfileStatusRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ProfileStatusRequest.displayName = 'proto.messages.ProfileStatusRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SetProfilePictureRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SetProfilePictureRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SetProfilePictureRequest.displayName = 'proto.messages.SetProfilePictureRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.CreateGroupRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.CreateGroupRequest.repeatedFields_, null);
};
goog.inherits(proto.messages.CreateGroupRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.CreateGroupRequest.displayName = 'proto.messages.CreateGroupRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SetPictureRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SetPictureRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SetPictureRequest.displayName = 'proto.messages.SetPictureRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.UpdateParticipantsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.UpdateParticipantsRequest.repeatedFields_, null);
};
goog.inherits(proto.messages.UpdateParticipantsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.UpdateParticipantsRequest.displayName = 'proto.messages.UpdateParticipantsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.GroupCodeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.GroupCodeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.GroupCodeRequest.displayName = 'proto.messages.GroupCodeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.AudioInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.AudioInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.AudioInfo.displayName = 'proto.messages.AudioInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Media = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.Media, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Media.displayName = 'proto.messages.Media';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.LinkPreview = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.LinkPreview, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.LinkPreview.displayName = 'proto.messages.LinkPreview';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.vCardContact = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.vCardContact, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.vCardContact.displayName = 'proto.messages.vCardContact';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.EventLocation = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.EventLocation, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.EventLocation.displayName = 'proto.messages.EventLocation';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Location = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.Location, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Location.displayName = 'proto.messages.Location';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.EventMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.EventMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.EventMessage.displayName = 'proto.messages.EventMessage';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.MessageRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.MessageRequest.repeatedFields_, null);
};
goog.inherits(proto.messages.MessageRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.MessageRequest.displayName = 'proto.messages.MessageRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Row = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.Row, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Row.displayName = 'proto.messages.Row';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Section = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.Section.repeatedFields_, null);
};
goog.inherits(proto.messages.Section, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Section.displayName = 'proto.messages.Section';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ListMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.ListMessage.repeatedFields_, null);
};
goog.inherits(proto.messages.ListMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ListMessage.displayName = 'proto.messages.ListMessage';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.MessageReaction = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.MessageReaction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.MessageReaction.displayName = 'proto.messages.MessageReaction';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.MessageResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.MessageResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.MessageResponse.displayName = 'proto.messages.MessageResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.NewMessageIDResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.NewMessageIDResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.NewMessageIDResponse.displayName = 'proto.messages.NewMessageIDResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ProfilePictureRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.ProfilePictureRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ProfilePictureRequest.displayName = 'proto.messages.ProfilePictureRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ProfilePictureResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.ProfilePictureResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ProfilePictureResponse.displayName = 'proto.messages.ProfilePictureResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ButtonReplyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.ButtonReplyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ButtonReplyRequest.displayName = 'proto.messages.ButtonReplyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.PresenceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.PresenceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.PresenceRequest.displayName = 'proto.messages.PresenceRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ChatPresenceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.ChatPresenceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ChatPresenceRequest.displayName = 'proto.messages.ChatPresenceRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SubscribePresenceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SubscribePresenceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SubscribePresenceRequest.displayName = 'proto.messages.SubscribePresenceRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.MarkReadRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.MarkReadRequest.repeatedFields_, null);
};
goog.inherits(proto.messages.MarkReadRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.MarkReadRequest.displayName = 'proto.messages.MarkReadRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.CheckPhonesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.CheckPhonesRequest.repeatedFields_, null);
};
goog.inherits(proto.messages.CheckPhonesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.CheckPhonesRequest.displayName = 'proto.messages.CheckPhonesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ChatUnreadRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.ChatUnreadRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ChatUnreadRequest.displayName = 'proto.messages.ChatUnreadRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.PhoneInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.PhoneInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.PhoneInfo.displayName = 'proto.messages.PhoneInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.CheckPhonesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.CheckPhonesResponse.repeatedFields_, null);
};
goog.inherits(proto.messages.CheckPhonesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.CheckPhonesResponse.displayName = 'proto.messages.CheckPhonesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.RevokeMessageRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.RevokeMessageRequest.repeatedFields_, null);
};
goog.inherits(proto.messages.RevokeMessageRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.RevokeMessageRequest.displayName = 'proto.messages.RevokeMessageRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.EditMessageRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.EditMessageRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.EditMessageRequest.displayName = 'proto.messages.EditMessageRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.NewsletterListRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.NewsletterListRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.NewsletterListRequest.displayName = 'proto.messages.NewsletterListRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Newsletter = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.Newsletter, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Newsletter.displayName = 'proto.messages.Newsletter';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.NewsletterList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.NewsletterList.repeatedFields_, null);
};
goog.inherits(proto.messages.NewsletterList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.NewsletterList.displayName = 'proto.messages.NewsletterList';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.NewsletterInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.NewsletterInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.NewsletterInfoRequest.displayName = 'proto.messages.NewsletterInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.GetNewsletterMessagesByInviteRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.GetNewsletterMessagesByInviteRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.GetNewsletterMessagesByInviteRequest.displayName = 'proto.messages.GetNewsletterMessagesByInviteRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SearchPage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SearchPage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SearchPage.displayName = 'proto.messages.SearchPage';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SearchNewslettersByViewRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.SearchNewslettersByViewRequest.repeatedFields_, null);
};
goog.inherits(proto.messages.SearchNewslettersByViewRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SearchNewslettersByViewRequest.displayName = 'proto.messages.SearchNewslettersByViewRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SearchNewslettersByTextRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.SearchNewslettersByTextRequest.repeatedFields_, null);
};
goog.inherits(proto.messages.SearchNewslettersByTextRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SearchNewslettersByTextRequest.displayName = 'proto.messages.SearchNewslettersByTextRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SearchPageResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SearchPageResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SearchPageResult.displayName = 'proto.messages.SearchPageResult';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.NewsletterSearchPageResult = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.NewsletterSearchPageResult, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.NewsletterSearchPageResult.displayName = 'proto.messages.NewsletterSearchPageResult';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.CreateNewsletterRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.CreateNewsletterRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.CreateNewsletterRequest.displayName = 'proto.messages.CreateNewsletterRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.NewsletterToggleMuteRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.NewsletterToggleMuteRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.NewsletterToggleMuteRequest.displayName = 'proto.messages.NewsletterToggleMuteRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.NewsletterToggleFollowRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.NewsletterToggleFollowRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.NewsletterToggleFollowRequest.displayName = 'proto.messages.NewsletterToggleFollowRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.DownloadMediaRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.DownloadMediaRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.DownloadMediaRequest.displayName = 'proto.messages.DownloadMediaRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.DownloadMediaResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.DownloadMediaResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.DownloadMediaResponse.displayName = 'proto.messages.DownloadMediaResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.EntityByIdRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.EntityByIdRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.EntityByIdRequest.displayName = 'proto.messages.EntityByIdRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Json = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.Json, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Json.displayName = 'proto.messages.Json';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.JsonList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.JsonList.repeatedFields_, null);
};
goog.inherits(proto.messages.JsonList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.JsonList.displayName = 'proto.messages.JsonList';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Pagination = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.Pagination, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Pagination.displayName = 'proto.messages.Pagination';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.SortBy = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.SortBy, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.SortBy.displayName = 'proto.messages.SortBy';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.MessageFilters = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.MessageFilters, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.MessageFilters.displayName = 'proto.messages.MessageFilters';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.GetMessagesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.GetMessagesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.GetMessagesRequest.displayName = 'proto.messages.GetMessagesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.UpdateContactRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.UpdateContactRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.UpdateContactRequest.displayName = 'proto.messages.UpdateContactRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.GetContactsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.GetContactsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.GetContactsRequest.displayName = 'proto.messages.GetContactsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ChatFilter = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.ChatFilter.repeatedFields_, null);
};
goog.inherits(proto.messages.ChatFilter, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ChatFilter.displayName = 'proto.messages.ChatFilter';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.GetChatsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.GetChatsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.GetChatsRequest.displayName = 'proto.messages.GetChatsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.GetLabelsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.GetLabelsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.GetLabelsRequest.displayName = 'proto.messages.GetLabelsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.Label = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.Label, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.Label.displayName = 'proto.messages.Label';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.UpsertLabelRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.UpsertLabelRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.UpsertLabelRequest.displayName = 'proto.messages.UpsertLabelRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.DeleteLabelRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.DeleteLabelRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.DeleteLabelRequest.displayName = 'proto.messages.DeleteLabelRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.ChatLabelRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.ChatLabelRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.ChatLabelRequest.displayName = 'proto.messages.ChatLabelRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.CancelEventMessageRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.CancelEventMessageRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.CancelEventMessageRequest.displayName = 'proto.messages.CancelEventMessageRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.GetLidsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.GetLidsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.GetLidsRequest.displayName = 'proto.messages.GetLidsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.RejectCallRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.messages.RejectCallRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.RejectCallRequest.displayName = 'proto.messages.RejectCallRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.PollMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.PollMessage.repeatedFields_, null);
};
goog.inherits(proto.messages.PollMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.PollMessage.displayName = 'proto.messages.PollMessage';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.messages.PollVoteMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.messages.PollVoteMessage.repeatedFields_, null);
};
goog.inherits(proto.messages.PollVoteMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.messages.PollVoteMessage.displayName = 'proto.messages.PollVoteMessage';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.OptionalString.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.OptionalString.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.OptionalString} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalString.toObject = function(includeInstance, msg) {
  var f, obj = {
    value: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.OptionalString}
 */
proto.messages.OptionalString.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.OptionalString;
  return proto.messages.OptionalString.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.OptionalString} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.OptionalString}
 */
proto.messages.OptionalString.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.OptionalString.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.OptionalString.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.OptionalString} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalString.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValue();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string value = 1;
 * @return {string}
 */
proto.messages.OptionalString.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.OptionalString} returns this
 */
proto.messages.OptionalString.prototype.setValue = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.OptionalUInt32.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.OptionalUInt32.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.OptionalUInt32} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalUInt32.toObject = function(includeInstance, msg) {
  var f, obj = {
    value: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.OptionalUInt32}
 */
proto.messages.OptionalUInt32.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.OptionalUInt32;
  return proto.messages.OptionalUInt32.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.OptionalUInt32} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.OptionalUInt32}
 */
proto.messages.OptionalUInt32.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.OptionalUInt32.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.OptionalUInt32.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.OptionalUInt32} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalUInt32.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValue();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
};


/**
 * optional uint32 value = 1;
 * @return {number}
 */
proto.messages.OptionalUInt32.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.OptionalUInt32} returns this
 */
proto.messages.OptionalUInt32.prototype.setValue = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.OptionalUInt64.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.OptionalUInt64.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.OptionalUInt64} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalUInt64.toObject = function(includeInstance, msg) {
  var f, obj = {
    value: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.OptionalUInt64}
 */
proto.messages.OptionalUInt64.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.OptionalUInt64;
  return proto.messages.OptionalUInt64.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.OptionalUInt64} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.OptionalUInt64}
 */
proto.messages.OptionalUInt64.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.OptionalUInt64.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.OptionalUInt64.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.OptionalUInt64} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalUInt64.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValue();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
};


/**
 * optional uint64 value = 1;
 * @return {number}
 */
proto.messages.OptionalUInt64.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.OptionalUInt64} returns this
 */
proto.messages.OptionalUInt64.prototype.setValue = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.OptionalInt64.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.OptionalInt64.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.OptionalInt64} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalInt64.toObject = function(includeInstance, msg) {
  var f, obj = {
    value: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.OptionalInt64}
 */
proto.messages.OptionalInt64.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.OptionalInt64;
  return proto.messages.OptionalInt64.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.OptionalInt64} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.OptionalInt64}
 */
proto.messages.OptionalInt64.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.OptionalInt64.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.OptionalInt64.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.OptionalInt64} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalInt64.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValue();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
};


/**
 * optional int64 value = 1;
 * @return {number}
 */
proto.messages.OptionalInt64.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.OptionalInt64} returns this
 */
proto.messages.OptionalInt64.prototype.setValue = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.OptionalBool.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.OptionalBool.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.OptionalBool} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalBool.toObject = function(includeInstance, msg) {
  var f, obj = {
    value: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.OptionalBool}
 */
proto.messages.OptionalBool.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.OptionalBool;
  return proto.messages.OptionalBool.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.OptionalBool} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.OptionalBool}
 */
proto.messages.OptionalBool.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.OptionalBool.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.OptionalBool.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.OptionalBool} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalBool.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValue();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool value = 1;
 * @return {boolean}
 */
proto.messages.OptionalBool.prototype.getValue = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.OptionalBool} returns this
 */
proto.messages.OptionalBool.prototype.setValue = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.OptionalDouble.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.OptionalDouble.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.OptionalDouble} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalDouble.toObject = function(includeInstance, msg) {
  var f, obj = {
    value: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.OptionalDouble}
 */
proto.messages.OptionalDouble.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.OptionalDouble;
  return proto.messages.OptionalDouble.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.OptionalDouble} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.OptionalDouble}
 */
proto.messages.OptionalDouble.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.OptionalDouble.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.OptionalDouble.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.OptionalDouble} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.OptionalDouble.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValue();
  if (f !== 0.0) {
    writer.writeDouble(
      1,
      f
    );
  }
};


/**
 * optional double value = 1;
 * @return {number}
 */
proto.messages.OptionalDouble.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.messages.OptionalDouble} returns this
 */
proto.messages.OptionalDouble.prototype.setValue = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.JidRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.JidRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.JidRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.JidRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.JidRequest}
 */
proto.messages.JidRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.JidRequest;
  return proto.messages.JidRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.JidRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.JidRequest}
 */
proto.messages.JidRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.JidRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.JidRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.JidRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.JidRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.JidRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.JidRequest} returns this
*/
proto.messages.JidRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.JidRequest} returns this
 */
proto.messages.JidRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.JidRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.JidRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.JidRequest} returns this
 */
proto.messages.JidRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.JidStringRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.JidStringRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.JidStringRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.JidStringRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    value: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.JidStringRequest}
 */
proto.messages.JidStringRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.JidStringRequest;
  return proto.messages.JidStringRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.JidStringRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.JidStringRequest}
 */
proto.messages.JidStringRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.JidStringRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.JidStringRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.JidStringRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.JidStringRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValue();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.JidStringRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.JidStringRequest} returns this
*/
proto.messages.JidStringRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.JidStringRequest} returns this
 */
proto.messages.JidStringRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.JidStringRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.JidStringRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.JidStringRequest} returns this
 */
proto.messages.JidStringRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string value = 3;
 * @return {string}
 */
proto.messages.JidStringRequest.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.JidStringRequest} returns this
 */
proto.messages.JidStringRequest.prototype.setValue = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.JidBoolRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.JidBoolRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.JidBoolRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.JidBoolRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    value: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.JidBoolRequest}
 */
proto.messages.JidBoolRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.JidBoolRequest;
  return proto.messages.JidBoolRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.JidBoolRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.JidBoolRequest}
 */
proto.messages.JidBoolRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.JidBoolRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.JidBoolRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.JidBoolRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.JidBoolRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValue();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.JidBoolRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.JidBoolRequest} returns this
*/
proto.messages.JidBoolRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.JidBoolRequest} returns this
 */
proto.messages.JidBoolRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.JidBoolRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.JidBoolRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.JidBoolRequest} returns this
 */
proto.messages.JidBoolRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool value = 3;
 * @return {boolean}
 */
proto.messages.JidBoolRequest.prototype.getValue = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.JidBoolRequest} returns this
 */
proto.messages.JidBoolRequest.prototype.setValue = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.EventJson.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.EventJson.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.EventJson} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EventJson.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: jspb.Message.getFieldWithDefault(msg, 2, ""),
    event: jspb.Message.getFieldWithDefault(msg, 1, ""),
    data: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.EventJson}
 */
proto.messages.EventJson.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.EventJson;
  return proto.messages.EventJson.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.EventJson} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.EventJson}
 */
proto.messages.EventJson.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSession(value);
      break;
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEvent(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.EventJson.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.EventJson.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.EventJson} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EventJson.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getEvent();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getData();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string session = 2;
 * @return {string}
 */
proto.messages.EventJson.prototype.getSession = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EventJson} returns this
 */
proto.messages.EventJson.prototype.setSession = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string event = 1;
 * @return {string}
 */
proto.messages.EventJson.prototype.getEvent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EventJson} returns this
 */
proto.messages.EventJson.prototype.setEvent = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string data = 3;
 * @return {string}
 */
proto.messages.EventJson.prototype.getData = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EventJson} returns this
 */
proto.messages.EventJson.prototype.setData = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.PairCodeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.PairCodeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.PairCodeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PairCodeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    phone: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.PairCodeRequest}
 */
proto.messages.PairCodeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.PairCodeRequest;
  return proto.messages.PairCodeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.PairCodeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.PairCodeRequest}
 */
proto.messages.PairCodeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPhone(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.PairCodeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.PairCodeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.PairCodeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PairCodeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getPhone();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.PairCodeRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.PairCodeRequest} returns this
*/
proto.messages.PairCodeRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.PairCodeRequest} returns this
 */
proto.messages.PairCodeRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.PairCodeRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string phone = 2;
 * @return {string}
 */
proto.messages.PairCodeRequest.prototype.getPhone = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.PairCodeRequest} returns this
 */
proto.messages.PairCodeRequest.prototype.setPhone = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.PairCodeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.PairCodeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.PairCodeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PairCodeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    code: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.PairCodeResponse}
 */
proto.messages.PairCodeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.PairCodeResponse;
  return proto.messages.PairCodeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.PairCodeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.PairCodeResponse}
 */
proto.messages.PairCodeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.PairCodeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.PairCodeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.PairCodeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PairCodeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCode();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string code = 1;
 * @return {string}
 */
proto.messages.PairCodeResponse.prototype.getCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.PairCodeResponse} returns this
 */
proto.messages.PairCodeResponse.prototype.setCode = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Empty.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Empty.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Empty} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Empty.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Empty}
 */
proto.messages.Empty.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Empty;
  return proto.messages.Empty.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Empty} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Empty}
 */
proto.messages.Empty.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Empty.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Empty.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Empty} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Empty.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SessionLogConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SessionLogConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SessionLogConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionLogConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    level: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SessionLogConfig}
 */
proto.messages.SessionLogConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SessionLogConfig;
  return proto.messages.SessionLogConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SessionLogConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SessionLogConfig}
 */
proto.messages.SessionLogConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.messages.LogLevel} */ (reader.readEnum());
      msg.setLevel(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SessionLogConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SessionLogConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SessionLogConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionLogConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLevel();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional LogLevel level = 1;
 * @return {!proto.messages.LogLevel}
 */
proto.messages.SessionLogConfig.prototype.getLevel = function() {
  return /** @type {!proto.messages.LogLevel} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.messages.LogLevel} value
 * @return {!proto.messages.SessionLogConfig} returns this
 */
proto.messages.SessionLogConfig.prototype.setLevel = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SessionStoreConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SessionStoreConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SessionStoreConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionStoreConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    dialect: jspb.Message.getFieldWithDefault(msg, 2, ""),
    address: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SessionStoreConfig}
 */
proto.messages.SessionStoreConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SessionStoreConfig;
  return proto.messages.SessionStoreConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SessionStoreConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SessionStoreConfig}
 */
proto.messages.SessionStoreConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDialect(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SessionStoreConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SessionStoreConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SessionStoreConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionStoreConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDialect();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string dialect = 2;
 * @return {string}
 */
proto.messages.SessionStoreConfig.prototype.getDialect = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SessionStoreConfig} returns this
 */
proto.messages.SessionStoreConfig.prototype.setDialect = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string address = 3;
 * @return {string}
 */
proto.messages.SessionStoreConfig.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SessionStoreConfig} returns this
 */
proto.messages.SessionStoreConfig.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SessionProxyConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SessionProxyConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SessionProxyConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionProxyConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    url: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SessionProxyConfig}
 */
proto.messages.SessionProxyConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SessionProxyConfig;
  return proto.messages.SessionProxyConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SessionProxyConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SessionProxyConfig}
 */
proto.messages.SessionProxyConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUrl(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SessionProxyConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SessionProxyConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SessionProxyConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionProxyConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUrl();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string url = 1;
 * @return {string}
 */
proto.messages.SessionProxyConfig.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SessionProxyConfig} returns this
 */
proto.messages.SessionProxyConfig.prototype.setUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SessionIgnoreJidsConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SessionIgnoreJidsConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SessionIgnoreJidsConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionIgnoreJidsConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    status: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    groups: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
    newsletters: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
    broadcast: jspb.Message.getBooleanFieldWithDefault(msg, 4, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SessionIgnoreJidsConfig}
 */
proto.messages.SessionIgnoreJidsConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SessionIgnoreJidsConfig;
  return proto.messages.SessionIgnoreJidsConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SessionIgnoreJidsConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SessionIgnoreJidsConfig}
 */
proto.messages.SessionIgnoreJidsConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setStatus(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setGroups(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setNewsletters(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setBroadcast(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SessionIgnoreJidsConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SessionIgnoreJidsConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SessionIgnoreJidsConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionIgnoreJidsConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStatus();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getGroups();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getNewsletters();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getBroadcast();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
};


/**
 * optional bool status = 1;
 * @return {boolean}
 */
proto.messages.SessionIgnoreJidsConfig.prototype.getStatus = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.SessionIgnoreJidsConfig} returns this
 */
proto.messages.SessionIgnoreJidsConfig.prototype.setStatus = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional bool groups = 2;
 * @return {boolean}
 */
proto.messages.SessionIgnoreJidsConfig.prototype.getGroups = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.SessionIgnoreJidsConfig} returns this
 */
proto.messages.SessionIgnoreJidsConfig.prototype.setGroups = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional bool newsletters = 3;
 * @return {boolean}
 */
proto.messages.SessionIgnoreJidsConfig.prototype.getNewsletters = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.SessionIgnoreJidsConfig} returns this
 */
proto.messages.SessionIgnoreJidsConfig.prototype.setNewsletters = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * optional bool broadcast = 4;
 * @return {boolean}
 */
proto.messages.SessionIgnoreJidsConfig.prototype.getBroadcast = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.SessionIgnoreJidsConfig} returns this
 */
proto.messages.SessionIgnoreJidsConfig.prototype.setBroadcast = function(value) {
  return jspb.Message.setProto3BooleanField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SessionConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SessionConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SessionConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    store: (f = msg.getStore()) && proto.messages.SessionStoreConfig.toObject(includeInstance, f),
    log: (f = msg.getLog()) && proto.messages.SessionLogConfig.toObject(includeInstance, f),
    proxy: (f = msg.getProxy()) && proto.messages.SessionProxyConfig.toObject(includeInstance, f),
    ignore: (f = msg.getIgnore()) && proto.messages.SessionIgnoreJidsConfig.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SessionConfig}
 */
proto.messages.SessionConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SessionConfig;
  return proto.messages.SessionConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SessionConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SessionConfig}
 */
proto.messages.SessionConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.SessionStoreConfig;
      reader.readMessage(value,proto.messages.SessionStoreConfig.deserializeBinaryFromReader);
      msg.setStore(value);
      break;
    case 2:
      var value = new proto.messages.SessionLogConfig;
      reader.readMessage(value,proto.messages.SessionLogConfig.deserializeBinaryFromReader);
      msg.setLog(value);
      break;
    case 3:
      var value = new proto.messages.SessionProxyConfig;
      reader.readMessage(value,proto.messages.SessionProxyConfig.deserializeBinaryFromReader);
      msg.setProxy(value);
      break;
    case 4:
      var value = new proto.messages.SessionIgnoreJidsConfig;
      reader.readMessage(value,proto.messages.SessionIgnoreJidsConfig.deserializeBinaryFromReader);
      msg.setIgnore(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SessionConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SessionConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SessionConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStore();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.SessionStoreConfig.serializeBinaryToWriter
    );
  }
  f = message.getLog();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.SessionLogConfig.serializeBinaryToWriter
    );
  }
  f = message.getProxy();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.messages.SessionProxyConfig.serializeBinaryToWriter
    );
  }
  f = message.getIgnore();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.messages.SessionIgnoreJidsConfig.serializeBinaryToWriter
    );
  }
};


/**
 * optional SessionStoreConfig store = 1;
 * @return {?proto.messages.SessionStoreConfig}
 */
proto.messages.SessionConfig.prototype.getStore = function() {
  return /** @type{?proto.messages.SessionStoreConfig} */ (
    jspb.Message.getWrapperField(this, proto.messages.SessionStoreConfig, 1));
};


/**
 * @param {?proto.messages.SessionStoreConfig|undefined} value
 * @return {!proto.messages.SessionConfig} returns this
*/
proto.messages.SessionConfig.prototype.setStore = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SessionConfig} returns this
 */
proto.messages.SessionConfig.prototype.clearStore = function() {
  return this.setStore(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SessionConfig.prototype.hasStore = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional SessionLogConfig log = 2;
 * @return {?proto.messages.SessionLogConfig}
 */
proto.messages.SessionConfig.prototype.getLog = function() {
  return /** @type{?proto.messages.SessionLogConfig} */ (
    jspb.Message.getWrapperField(this, proto.messages.SessionLogConfig, 2));
};


/**
 * @param {?proto.messages.SessionLogConfig|undefined} value
 * @return {!proto.messages.SessionConfig} returns this
*/
proto.messages.SessionConfig.prototype.setLog = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SessionConfig} returns this
 */
proto.messages.SessionConfig.prototype.clearLog = function() {
  return this.setLog(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SessionConfig.prototype.hasLog = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional SessionProxyConfig proxy = 3;
 * @return {?proto.messages.SessionProxyConfig}
 */
proto.messages.SessionConfig.prototype.getProxy = function() {
  return /** @type{?proto.messages.SessionProxyConfig} */ (
    jspb.Message.getWrapperField(this, proto.messages.SessionProxyConfig, 3));
};


/**
 * @param {?proto.messages.SessionProxyConfig|undefined} value
 * @return {!proto.messages.SessionConfig} returns this
*/
proto.messages.SessionConfig.prototype.setProxy = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SessionConfig} returns this
 */
proto.messages.SessionConfig.prototype.clearProxy = function() {
  return this.setProxy(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SessionConfig.prototype.hasProxy = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional SessionIgnoreJidsConfig ignore = 4;
 * @return {?proto.messages.SessionIgnoreJidsConfig}
 */
proto.messages.SessionConfig.prototype.getIgnore = function() {
  return /** @type{?proto.messages.SessionIgnoreJidsConfig} */ (
    jspb.Message.getWrapperField(this, proto.messages.SessionIgnoreJidsConfig, 4));
};


/**
 * @param {?proto.messages.SessionIgnoreJidsConfig|undefined} value
 * @return {!proto.messages.SessionConfig} returns this
*/
proto.messages.SessionConfig.prototype.setIgnore = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SessionConfig} returns this
 */
proto.messages.SessionConfig.prototype.clearIgnore = function() {
  return this.setIgnore(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SessionConfig.prototype.hasIgnore = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.StartSessionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.StartSessionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.StartSessionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.StartSessionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    config: (f = msg.getConfig()) && proto.messages.SessionConfig.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.StartSessionRequest}
 */
proto.messages.StartSessionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.StartSessionRequest;
  return proto.messages.StartSessionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.StartSessionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.StartSessionRequest}
 */
proto.messages.StartSessionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto.messages.SessionConfig;
      reader.readMessage(value,proto.messages.SessionConfig.deserializeBinaryFromReader);
      msg.setConfig(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.StartSessionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.StartSessionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.StartSessionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.StartSessionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getConfig();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.SessionConfig.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.messages.StartSessionRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.StartSessionRequest} returns this
 */
proto.messages.StartSessionRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional SessionConfig config = 2;
 * @return {?proto.messages.SessionConfig}
 */
proto.messages.StartSessionRequest.prototype.getConfig = function() {
  return /** @type{?proto.messages.SessionConfig} */ (
    jspb.Message.getWrapperField(this, proto.messages.SessionConfig, 2));
};


/**
 * @param {?proto.messages.SessionConfig|undefined} value
 * @return {!proto.messages.StartSessionRequest} returns this
*/
proto.messages.StartSessionRequest.prototype.setConfig = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.StartSessionRequest} returns this
 */
proto.messages.StartSessionRequest.prototype.clearConfig = function() {
  return this.setConfig(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.StartSessionRequest.prototype.hasConfig = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SessionStateResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SessionStateResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SessionStateResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionStateResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    found: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    connected: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SessionStateResponse}
 */
proto.messages.SessionStateResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SessionStateResponse;
  return proto.messages.SessionStateResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SessionStateResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SessionStateResponse}
 */
proto.messages.SessionStateResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setFound(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setConnected(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SessionStateResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SessionStateResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SessionStateResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SessionStateResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFound();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getConnected();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional bool found = 1;
 * @return {boolean}
 */
proto.messages.SessionStateResponse.prototype.getFound = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.SessionStateResponse} returns this
 */
proto.messages.SessionStateResponse.prototype.setFound = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional bool connected = 2;
 * @return {boolean}
 */
proto.messages.SessionStateResponse.prototype.getConnected = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.SessionStateResponse} returns this
 */
proto.messages.SessionStateResponse.prototype.setConnected = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Session.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Session.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Session} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Session.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Session}
 */
proto.messages.Session.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Session;
  return proto.messages.Session.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Session} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Session}
 */
proto.messages.Session.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Session.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Session.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Session} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Session.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.messages.Session.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Session} returns this
 */
proto.messages.Session.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ProfileNameRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ProfileNameRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ProfileNameRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ProfileNameRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    name: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ProfileNameRequest}
 */
proto.messages.ProfileNameRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ProfileNameRequest;
  return proto.messages.ProfileNameRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ProfileNameRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ProfileNameRequest}
 */
proto.messages.ProfileNameRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ProfileNameRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ProfileNameRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ProfileNameRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ProfileNameRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.ProfileNameRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.ProfileNameRequest} returns this
*/
proto.messages.ProfileNameRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.ProfileNameRequest} returns this
 */
proto.messages.ProfileNameRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.ProfileNameRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.messages.ProfileNameRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ProfileNameRequest} returns this
 */
proto.messages.ProfileNameRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ProfileStatusRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ProfileStatusRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ProfileStatusRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ProfileStatusRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    status: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ProfileStatusRequest}
 */
proto.messages.ProfileStatusRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ProfileStatusRequest;
  return proto.messages.ProfileStatusRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ProfileStatusRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ProfileStatusRequest}
 */
proto.messages.ProfileStatusRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ProfileStatusRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ProfileStatusRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ProfileStatusRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ProfileStatusRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getStatus();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.ProfileStatusRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.ProfileStatusRequest} returns this
*/
proto.messages.ProfileStatusRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.ProfileStatusRequest} returns this
 */
proto.messages.ProfileStatusRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.ProfileStatusRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string status = 2;
 * @return {string}
 */
proto.messages.ProfileStatusRequest.prototype.getStatus = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ProfileStatusRequest} returns this
 */
proto.messages.ProfileStatusRequest.prototype.setStatus = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SetProfilePictureRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SetProfilePictureRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SetProfilePictureRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SetProfilePictureRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    picture: msg.getPicture_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SetProfilePictureRequest}
 */
proto.messages.SetProfilePictureRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SetProfilePictureRequest;
  return proto.messages.SetProfilePictureRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SetProfilePictureRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SetProfilePictureRequest}
 */
proto.messages.SetProfilePictureRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPicture(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SetProfilePictureRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SetProfilePictureRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SetProfilePictureRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SetProfilePictureRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getPicture_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.SetProfilePictureRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.SetProfilePictureRequest} returns this
*/
proto.messages.SetProfilePictureRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SetProfilePictureRequest} returns this
 */
proto.messages.SetProfilePictureRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SetProfilePictureRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bytes picture = 2;
 * @return {!(string|Uint8Array)}
 */
proto.messages.SetProfilePictureRequest.prototype.getPicture = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes picture = 2;
 * This is a type-conversion wrapper around `getPicture()`
 * @return {string}
 */
proto.messages.SetProfilePictureRequest.prototype.getPicture_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPicture()));
};


/**
 * optional bytes picture = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPicture()`
 * @return {!Uint8Array}
 */
proto.messages.SetProfilePictureRequest.prototype.getPicture_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPicture()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.messages.SetProfilePictureRequest} returns this
 */
proto.messages.SetProfilePictureRequest.prototype.setPicture = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.CreateGroupRequest.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.CreateGroupRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.CreateGroupRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.CreateGroupRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CreateGroupRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    participantsList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.CreateGroupRequest}
 */
proto.messages.CreateGroupRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.CreateGroupRequest;
  return proto.messages.CreateGroupRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.CreateGroupRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.CreateGroupRequest}
 */
proto.messages.CreateGroupRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addParticipants(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.CreateGroupRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.CreateGroupRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.CreateGroupRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CreateGroupRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getParticipantsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.CreateGroupRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.CreateGroupRequest} returns this
*/
proto.messages.CreateGroupRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.CreateGroupRequest} returns this
 */
proto.messages.CreateGroupRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.CreateGroupRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.messages.CreateGroupRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.CreateGroupRequest} returns this
 */
proto.messages.CreateGroupRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated string participants = 3;
 * @return {!Array<string>}
 */
proto.messages.CreateGroupRequest.prototype.getParticipantsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.CreateGroupRequest} returns this
 */
proto.messages.CreateGroupRequest.prototype.setParticipantsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.CreateGroupRequest} returns this
 */
proto.messages.CreateGroupRequest.prototype.addParticipants = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.CreateGroupRequest} returns this
 */
proto.messages.CreateGroupRequest.prototype.clearParticipantsList = function() {
  return this.setParticipantsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SetPictureRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SetPictureRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SetPictureRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SetPictureRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    picture: msg.getPicture_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SetPictureRequest}
 */
proto.messages.SetPictureRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SetPictureRequest;
  return proto.messages.SetPictureRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SetPictureRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SetPictureRequest}
 */
proto.messages.SetPictureRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPicture(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SetPictureRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SetPictureRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SetPictureRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SetPictureRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getPicture_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.SetPictureRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.SetPictureRequest} returns this
*/
proto.messages.SetPictureRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SetPictureRequest} returns this
 */
proto.messages.SetPictureRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SetPictureRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.SetPictureRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SetPictureRequest} returns this
 */
proto.messages.SetPictureRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bytes picture = 3;
 * @return {!(string|Uint8Array)}
 */
proto.messages.SetPictureRequest.prototype.getPicture = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * optional bytes picture = 3;
 * This is a type-conversion wrapper around `getPicture()`
 * @return {string}
 */
proto.messages.SetPictureRequest.prototype.getPicture_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPicture()));
};


/**
 * optional bytes picture = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPicture()`
 * @return {!Uint8Array}
 */
proto.messages.SetPictureRequest.prototype.getPicture_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPicture()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.messages.SetPictureRequest} returns this
 */
proto.messages.SetPictureRequest.prototype.setPicture = function(value) {
  return jspb.Message.setProto3BytesField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.UpdateParticipantsRequest.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.UpdateParticipantsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.UpdateParticipantsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.UpdateParticipantsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.UpdateParticipantsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    participantsList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
    action: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.UpdateParticipantsRequest}
 */
proto.messages.UpdateParticipantsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.UpdateParticipantsRequest;
  return proto.messages.UpdateParticipantsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.UpdateParticipantsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.UpdateParticipantsRequest}
 */
proto.messages.UpdateParticipantsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addParticipants(value);
      break;
    case 4:
      var value = /** @type {!proto.messages.ParticipantAction} */ (reader.readEnum());
      msg.setAction(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.UpdateParticipantsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.UpdateParticipantsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.UpdateParticipantsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.UpdateParticipantsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getParticipantsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
  f = message.getAction();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.UpdateParticipantsRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.UpdateParticipantsRequest} returns this
*/
proto.messages.UpdateParticipantsRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.UpdateParticipantsRequest} returns this
 */
proto.messages.UpdateParticipantsRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.UpdateParticipantsRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.UpdateParticipantsRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.UpdateParticipantsRequest} returns this
 */
proto.messages.UpdateParticipantsRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated string participants = 3;
 * @return {!Array<string>}
 */
proto.messages.UpdateParticipantsRequest.prototype.getParticipantsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.UpdateParticipantsRequest} returns this
 */
proto.messages.UpdateParticipantsRequest.prototype.setParticipantsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.UpdateParticipantsRequest} returns this
 */
proto.messages.UpdateParticipantsRequest.prototype.addParticipants = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.UpdateParticipantsRequest} returns this
 */
proto.messages.UpdateParticipantsRequest.prototype.clearParticipantsList = function() {
  return this.setParticipantsList([]);
};


/**
 * optional ParticipantAction action = 4;
 * @return {!proto.messages.ParticipantAction}
 */
proto.messages.UpdateParticipantsRequest.prototype.getAction = function() {
  return /** @type {!proto.messages.ParticipantAction} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.messages.ParticipantAction} value
 * @return {!proto.messages.UpdateParticipantsRequest} returns this
 */
proto.messages.UpdateParticipantsRequest.prototype.setAction = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.GroupCodeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.GroupCodeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.GroupCodeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GroupCodeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    code: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.GroupCodeRequest}
 */
proto.messages.GroupCodeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.GroupCodeRequest;
  return proto.messages.GroupCodeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.GroupCodeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.GroupCodeRequest}
 */
proto.messages.GroupCodeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.GroupCodeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.GroupCodeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.GroupCodeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GroupCodeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getCode();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.GroupCodeRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.GroupCodeRequest} returns this
*/
proto.messages.GroupCodeRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GroupCodeRequest} returns this
 */
proto.messages.GroupCodeRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GroupCodeRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string code = 2;
 * @return {string}
 */
proto.messages.GroupCodeRequest.prototype.getCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.GroupCodeRequest} returns this
 */
proto.messages.GroupCodeRequest.prototype.setCode = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.AudioInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.AudioInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.AudioInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.AudioInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    duration: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    waveform: msg.getWaveform_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.AudioInfo}
 */
proto.messages.AudioInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.AudioInfo;
  return proto.messages.AudioInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.AudioInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.AudioInfo}
 */
proto.messages.AudioInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setDuration(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWaveform(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.AudioInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.AudioInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.AudioInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.AudioInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDuration();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = message.getWaveform_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional float duration = 1;
 * @return {number}
 */
proto.messages.AudioInfo.prototype.getDuration = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.messages.AudioInfo} returns this
 */
proto.messages.AudioInfo.prototype.setDuration = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional bytes waveform = 2;
 * @return {!(string|Uint8Array)}
 */
proto.messages.AudioInfo.prototype.getWaveform = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes waveform = 2;
 * This is a type-conversion wrapper around `getWaveform()`
 * @return {string}
 */
proto.messages.AudioInfo.prototype.getWaveform_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWaveform()));
};


/**
 * optional bytes waveform = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWaveform()`
 * @return {!Uint8Array}
 */
proto.messages.AudioInfo.prototype.getWaveform_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWaveform()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.messages.AudioInfo} returns this
 */
proto.messages.AudioInfo.prototype.setWaveform = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Media.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Media.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Media} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Media.toObject = function(includeInstance, msg) {
  var f, obj = {
    content: msg.getContent_asB64(),
    type: jspb.Message.getFieldWithDefault(msg, 2, 0),
    mimetype: jspb.Message.getFieldWithDefault(msg, 3, ""),
    audio: (f = msg.getAudio()) && proto.messages.AudioInfo.toObject(includeInstance, f),
    filename: jspb.Message.getFieldWithDefault(msg, 5, ""),
    contentpath: jspb.Message.getFieldWithDefault(msg, 6, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Media}
 */
proto.messages.Media.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Media;
  return proto.messages.Media.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Media} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Media}
 */
proto.messages.Media.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setContent(value);
      break;
    case 2:
      var value = /** @type {!proto.messages.MediaType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setMimetype(value);
      break;
    case 4:
      var value = new proto.messages.AudioInfo;
      reader.readMessage(value,proto.messages.AudioInfo.deserializeBinaryFromReader);
      msg.setAudio(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setFilename(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setContentpath(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Media.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Media.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Media} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Media.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getContent_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getMimetype();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getAudio();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.messages.AudioInfo.serializeBinaryToWriter
    );
  }
  f = message.getFilename();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getContentpath();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * optional bytes content = 1;
 * @return {!(string|Uint8Array)}
 */
proto.messages.Media.prototype.getContent = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes content = 1;
 * This is a type-conversion wrapper around `getContent()`
 * @return {string}
 */
proto.messages.Media.prototype.getContent_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getContent()));
};


/**
 * optional bytes content = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getContent()`
 * @return {!Uint8Array}
 */
proto.messages.Media.prototype.getContent_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getContent()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.messages.Media} returns this
 */
proto.messages.Media.prototype.setContent = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional MediaType type = 2;
 * @return {!proto.messages.MediaType}
 */
proto.messages.Media.prototype.getType = function() {
  return /** @type {!proto.messages.MediaType} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.messages.MediaType} value
 * @return {!proto.messages.Media} returns this
 */
proto.messages.Media.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional string mimetype = 3;
 * @return {string}
 */
proto.messages.Media.prototype.getMimetype = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Media} returns this
 */
proto.messages.Media.prototype.setMimetype = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional AudioInfo audio = 4;
 * @return {?proto.messages.AudioInfo}
 */
proto.messages.Media.prototype.getAudio = function() {
  return /** @type{?proto.messages.AudioInfo} */ (
    jspb.Message.getWrapperField(this, proto.messages.AudioInfo, 4));
};


/**
 * @param {?proto.messages.AudioInfo|undefined} value
 * @return {!proto.messages.Media} returns this
*/
proto.messages.Media.prototype.setAudio = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.Media} returns this
 */
proto.messages.Media.prototype.clearAudio = function() {
  return this.setAudio(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.Media.prototype.hasAudio = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string filename = 5;
 * @return {string}
 */
proto.messages.Media.prototype.getFilename = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Media} returns this
 */
proto.messages.Media.prototype.setFilename = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string contentPath = 6;
 * @return {string}
 */
proto.messages.Media.prototype.getContentpath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Media} returns this
 */
proto.messages.Media.prototype.setContentpath = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.LinkPreview.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.LinkPreview.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.LinkPreview} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.LinkPreview.toObject = function(includeInstance, msg) {
  var f, obj = {
    url: jspb.Message.getFieldWithDefault(msg, 1, ""),
    title: jspb.Message.getFieldWithDefault(msg, 2, ""),
    description: jspb.Message.getFieldWithDefault(msg, 3, ""),
    image: msg.getImage_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.LinkPreview}
 */
proto.messages.LinkPreview.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.LinkPreview;
  return proto.messages.LinkPreview.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.LinkPreview} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.LinkPreview}
 */
proto.messages.LinkPreview.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUrl(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setImage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.LinkPreview.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.LinkPreview.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.LinkPreview} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.LinkPreview.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUrl();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDescription();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getImage_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
};


/**
 * optional string url = 1;
 * @return {string}
 */
proto.messages.LinkPreview.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.LinkPreview} returns this
 */
proto.messages.LinkPreview.prototype.setUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string title = 2;
 * @return {string}
 */
proto.messages.LinkPreview.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.LinkPreview} returns this
 */
proto.messages.LinkPreview.prototype.setTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string description = 3;
 * @return {string}
 */
proto.messages.LinkPreview.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.LinkPreview} returns this
 */
proto.messages.LinkPreview.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional bytes image = 4;
 * @return {!(string|Uint8Array)}
 */
proto.messages.LinkPreview.prototype.getImage = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes image = 4;
 * This is a type-conversion wrapper around `getImage()`
 * @return {string}
 */
proto.messages.LinkPreview.prototype.getImage_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getImage()));
};


/**
 * optional bytes image = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getImage()`
 * @return {!Uint8Array}
 */
proto.messages.LinkPreview.prototype.getImage_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getImage()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.messages.LinkPreview} returns this
 */
proto.messages.LinkPreview.prototype.setImage = function(value) {
  return jspb.Message.setProto3BytesField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.vCardContact.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.vCardContact.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.vCardContact} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.vCardContact.toObject = function(includeInstance, msg) {
  var f, obj = {
    displayname: jspb.Message.getFieldWithDefault(msg, 1, ""),
    vcard: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.vCardContact}
 */
proto.messages.vCardContact.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.vCardContact;
  return proto.messages.vCardContact.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.vCardContact} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.vCardContact}
 */
proto.messages.vCardContact.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setDisplayname(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setVcard(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.vCardContact.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.vCardContact.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.vCardContact} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.vCardContact.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDisplayname();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getVcard();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string displayName = 1;
 * @return {string}
 */
proto.messages.vCardContact.prototype.getDisplayname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.vCardContact} returns this
 */
proto.messages.vCardContact.prototype.setDisplayname = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string vcard = 3;
 * @return {string}
 */
proto.messages.vCardContact.prototype.getVcard = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.vCardContact} returns this
 */
proto.messages.vCardContact.prototype.setVcard = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.EventLocation.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.EventLocation.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.EventLocation} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EventLocation.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    degreeslongitude: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    degreeslatitude: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.EventLocation}
 */
proto.messages.EventLocation.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.EventLocation;
  return proto.messages.EventLocation.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.EventLocation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.EventLocation}
 */
proto.messages.EventLocation.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setDegreeslongitude(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setDegreeslatitude(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.EventLocation.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.EventLocation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.EventLocation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EventLocation.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeDouble(
      2,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeDouble(
      3,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.messages.EventLocation.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EventLocation} returns this
 */
proto.messages.EventLocation.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional double degreesLongitude = 2;
 * @return {number}
 */
proto.messages.EventLocation.prototype.getDegreeslongitude = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.messages.EventLocation} returns this
 */
proto.messages.EventLocation.prototype.setDegreeslongitude = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.messages.EventLocation} returns this
 */
proto.messages.EventLocation.prototype.clearDegreeslongitude = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.EventLocation.prototype.hasDegreeslongitude = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional double degreesLatitude = 3;
 * @return {number}
 */
proto.messages.EventLocation.prototype.getDegreeslatitude = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.messages.EventLocation} returns this
 */
proto.messages.EventLocation.prototype.setDegreeslatitude = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.messages.EventLocation} returns this
 */
proto.messages.EventLocation.prototype.clearDegreeslatitude = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.EventLocation.prototype.hasDegreeslatitude = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Location.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Location.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Location} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Location.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    degreeslongitude: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    degreeslatitude: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Location}
 */
proto.messages.Location.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Location;
  return proto.messages.Location.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Location} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Location}
 */
proto.messages.Location.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setDegreeslongitude(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setDegreeslatitude(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Location.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Location.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Location} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Location.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDegreeslongitude();
  if (f !== 0.0) {
    writer.writeDouble(
      2,
      f
    );
  }
  f = message.getDegreeslatitude();
  if (f !== 0.0) {
    writer.writeDouble(
      3,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.messages.Location.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Location} returns this
 */
proto.messages.Location.prototype.setName = function(value) {
  return jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.messages.Location} returns this
 */
proto.messages.Location.prototype.clearName = function() {
  return jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.Location.prototype.hasName = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional double degreesLongitude = 2;
 * @return {number}
 */
proto.messages.Location.prototype.getDegreeslongitude = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.messages.Location} returns this
 */
proto.messages.Location.prototype.setDegreeslongitude = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional double degreesLatitude = 3;
 * @return {number}
 */
proto.messages.Location.prototype.getDegreeslatitude = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.messages.Location} returns this
 */
proto.messages.Location.prototype.setDegreeslatitude = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.EventMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.EventMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.EventMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EventMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    description: jspb.Message.getFieldWithDefault(msg, 2, ""),
    starttime: jspb.Message.getFieldWithDefault(msg, 3, 0),
    endtime: jspb.Message.getFieldWithDefault(msg, 4, 0),
    extraguestsallowed: jspb.Message.getBooleanFieldWithDefault(msg, 5, false),
    location: (f = msg.getLocation()) && proto.messages.EventLocation.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.EventMessage}
 */
proto.messages.EventMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.EventMessage;
  return proto.messages.EventMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.EventMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.EventMessage}
 */
proto.messages.EventMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setStarttime(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setEndtime(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setExtraguestsallowed(value);
      break;
    case 6:
      var value = new proto.messages.EventLocation;
      reader.readMessage(value,proto.messages.EventLocation.deserializeBinaryFromReader);
      msg.setLocation(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.EventMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.EventMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.EventMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EventMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getStarttime();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = message.getExtraguestsallowed();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
  f = message.getLocation();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.messages.EventLocation.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.messages.EventMessage.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EventMessage} returns this
 */
proto.messages.EventMessage.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string description = 2;
 * @return {string}
 */
proto.messages.EventMessage.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EventMessage} returns this
 */
proto.messages.EventMessage.prototype.setDescription = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.messages.EventMessage} returns this
 */
proto.messages.EventMessage.prototype.clearDescription = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.EventMessage.prototype.hasDescription = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional int64 startTime = 3;
 * @return {number}
 */
proto.messages.EventMessage.prototype.getStarttime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.EventMessage} returns this
 */
proto.messages.EventMessage.prototype.setStarttime = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional int64 endTime = 4;
 * @return {number}
 */
proto.messages.EventMessage.prototype.getEndtime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.EventMessage} returns this
 */
proto.messages.EventMessage.prototype.setEndtime = function(value) {
  return jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.messages.EventMessage} returns this
 */
proto.messages.EventMessage.prototype.clearEndtime = function() {
  return jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.EventMessage.prototype.hasEndtime = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional bool extraGuestsAllowed = 5;
 * @return {boolean}
 */
proto.messages.EventMessage.prototype.getExtraguestsallowed = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.EventMessage} returns this
 */
proto.messages.EventMessage.prototype.setExtraguestsallowed = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};


/**
 * optional EventLocation location = 6;
 * @return {?proto.messages.EventLocation}
 */
proto.messages.EventMessage.prototype.getLocation = function() {
  return /** @type{?proto.messages.EventLocation} */ (
    jspb.Message.getWrapperField(this, proto.messages.EventLocation, 6));
};


/**
 * @param {?proto.messages.EventLocation|undefined} value
 * @return {!proto.messages.EventMessage} returns this
*/
proto.messages.EventMessage.prototype.setLocation = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.EventMessage} returns this
 */
proto.messages.EventMessage.prototype.clearLocation = function() {
  return this.setLocation(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.EventMessage.prototype.hasLocation = function() {
  return jspb.Message.getField(this, 6) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.MessageRequest.repeatedFields_ = [11,13,19];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.MessageRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.MessageRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.MessageRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MessageRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    text: jspb.Message.getFieldWithDefault(msg, 3, ""),
    media: (f = msg.getMedia()) && proto.messages.Media.toObject(includeInstance, f),
    backgroundcolor: (f = msg.getBackgroundcolor()) && proto.messages.OptionalString.toObject(includeInstance, f),
    font: (f = msg.getFont()) && proto.messages.OptionalUInt32.toObject(includeInstance, f),
    linkpreview: jspb.Message.getBooleanFieldWithDefault(msg, 7, false),
    linkpreviewhighquality: jspb.Message.getBooleanFieldWithDefault(msg, 8, false),
    replyto: jspb.Message.getFieldWithDefault(msg, 9, ""),
    id: jspb.Message.getFieldWithDefault(msg, 10, ""),
    participantsList: (f = jspb.Message.getRepeatedField(msg, 11)) == null ? undefined : f,
    preview: (f = msg.getPreview()) && proto.messages.LinkPreview.toObject(includeInstance, f),
    contactsList: jspb.Message.toObjectList(msg.getContactsList(),
    proto.messages.vCardContact.toObject, includeInstance),
    event: (f = msg.getEvent()) && proto.messages.EventMessage.toObject(includeInstance, f),
    poll: (f = msg.getPoll()) && proto.messages.PollMessage.toObject(includeInstance, f),
    list: (f = msg.getList()) && proto.messages.ListMessage.toObject(includeInstance, f),
    location: (f = msg.getLocation()) && proto.messages.Location.toObject(includeInstance, f),
    pollvote: (f = msg.getPollvote()) && proto.messages.PollVoteMessage.toObject(includeInstance, f),
    mentionsList: (f = jspb.Message.getRepeatedField(msg, 19)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.MessageRequest}
 */
proto.messages.MessageRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.MessageRequest;
  return proto.messages.MessageRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.MessageRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.MessageRequest}
 */
proto.messages.MessageRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setText(value);
      break;
    case 4:
      var value = new proto.messages.Media;
      reader.readMessage(value,proto.messages.Media.deserializeBinaryFromReader);
      msg.setMedia(value);
      break;
    case 5:
      var value = new proto.messages.OptionalString;
      reader.readMessage(value,proto.messages.OptionalString.deserializeBinaryFromReader);
      msg.setBackgroundcolor(value);
      break;
    case 6:
      var value = new proto.messages.OptionalUInt32;
      reader.readMessage(value,proto.messages.OptionalUInt32.deserializeBinaryFromReader);
      msg.setFont(value);
      break;
    case 7:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setLinkpreview(value);
      break;
    case 8:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setLinkpreviewhighquality(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setReplyto(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.addParticipants(value);
      break;
    case 12:
      var value = new proto.messages.LinkPreview;
      reader.readMessage(value,proto.messages.LinkPreview.deserializeBinaryFromReader);
      msg.setPreview(value);
      break;
    case 13:
      var value = new proto.messages.vCardContact;
      reader.readMessage(value,proto.messages.vCardContact.deserializeBinaryFromReader);
      msg.addContacts(value);
      break;
    case 14:
      var value = new proto.messages.EventMessage;
      reader.readMessage(value,proto.messages.EventMessage.deserializeBinaryFromReader);
      msg.setEvent(value);
      break;
    case 15:
      var value = new proto.messages.PollMessage;
      reader.readMessage(value,proto.messages.PollMessage.deserializeBinaryFromReader);
      msg.setPoll(value);
      break;
    case 16:
      var value = new proto.messages.ListMessage;
      reader.readMessage(value,proto.messages.ListMessage.deserializeBinaryFromReader);
      msg.setList(value);
      break;
    case 17:
      var value = new proto.messages.Location;
      reader.readMessage(value,proto.messages.Location.deserializeBinaryFromReader);
      msg.setLocation(value);
      break;
    case 18:
      var value = new proto.messages.PollVoteMessage;
      reader.readMessage(value,proto.messages.PollVoteMessage.deserializeBinaryFromReader);
      msg.setPollvote(value);
      break;
    case 19:
      var value = /** @type {string} */ (reader.readString());
      msg.addMentions(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.MessageRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.MessageRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.MessageRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MessageRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getText();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMedia();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.messages.Media.serializeBinaryToWriter
    );
  }
  f = message.getBackgroundcolor();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.messages.OptionalString.serializeBinaryToWriter
    );
  }
  f = message.getFont();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.messages.OptionalUInt32.serializeBinaryToWriter
    );
  }
  f = message.getLinkpreview();
  if (f) {
    writer.writeBool(
      7,
      f
    );
  }
  f = message.getLinkpreviewhighquality();
  if (f) {
    writer.writeBool(
      8,
      f
    );
  }
  f = message.getReplyto();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getParticipantsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      11,
      f
    );
  }
  f = message.getPreview();
  if (f != null) {
    writer.writeMessage(
      12,
      f,
      proto.messages.LinkPreview.serializeBinaryToWriter
    );
  }
  f = message.getContactsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      13,
      f,
      proto.messages.vCardContact.serializeBinaryToWriter
    );
  }
  f = message.getEvent();
  if (f != null) {
    writer.writeMessage(
      14,
      f,
      proto.messages.EventMessage.serializeBinaryToWriter
    );
  }
  f = message.getPoll();
  if (f != null) {
    writer.writeMessage(
      15,
      f,
      proto.messages.PollMessage.serializeBinaryToWriter
    );
  }
  f = message.getList();
  if (f != null) {
    writer.writeMessage(
      16,
      f,
      proto.messages.ListMessage.serializeBinaryToWriter
    );
  }
  f = message.getLocation();
  if (f != null) {
    writer.writeMessage(
      17,
      f,
      proto.messages.Location.serializeBinaryToWriter
    );
  }
  f = message.getPollvote();
  if (f != null) {
    writer.writeMessage(
      18,
      f,
      proto.messages.PollVoteMessage.serializeBinaryToWriter
    );
  }
  f = message.getMentionsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      19,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.MessageRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.MessageRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string text = 3;
 * @return {string}
 */
proto.messages.MessageRequest.prototype.getText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.setText = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional Media media = 4;
 * @return {?proto.messages.Media}
 */
proto.messages.MessageRequest.prototype.getMedia = function() {
  return /** @type{?proto.messages.Media} */ (
    jspb.Message.getWrapperField(this, proto.messages.Media, 4));
};


/**
 * @param {?proto.messages.Media|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setMedia = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearMedia = function() {
  return this.setMedia(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasMedia = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional OptionalString backgroundColor = 5;
 * @return {?proto.messages.OptionalString}
 */
proto.messages.MessageRequest.prototype.getBackgroundcolor = function() {
  return /** @type{?proto.messages.OptionalString} */ (
    jspb.Message.getWrapperField(this, proto.messages.OptionalString, 5));
};


/**
 * @param {?proto.messages.OptionalString|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setBackgroundcolor = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearBackgroundcolor = function() {
  return this.setBackgroundcolor(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasBackgroundcolor = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional OptionalUInt32 font = 6;
 * @return {?proto.messages.OptionalUInt32}
 */
proto.messages.MessageRequest.prototype.getFont = function() {
  return /** @type{?proto.messages.OptionalUInt32} */ (
    jspb.Message.getWrapperField(this, proto.messages.OptionalUInt32, 6));
};


/**
 * @param {?proto.messages.OptionalUInt32|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setFont = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearFont = function() {
  return this.setFont(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasFont = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional bool linkPreview = 7;
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.getLinkpreview = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 7, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.setLinkpreview = function(value) {
  return jspb.Message.setProto3BooleanField(this, 7, value);
};


/**
 * optional bool linkPreviewHighQuality = 8;
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.getLinkpreviewhighquality = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 8, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.setLinkpreviewhighquality = function(value) {
  return jspb.Message.setProto3BooleanField(this, 8, value);
};


/**
 * optional string replyTo = 9;
 * @return {string}
 */
proto.messages.MessageRequest.prototype.getReplyto = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.setReplyto = function(value) {
  return jspb.Message.setProto3StringField(this, 9, value);
};


/**
 * optional string id = 10;
 * @return {string}
 */
proto.messages.MessageRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * repeated string participants = 11;
 * @return {!Array<string>}
 */
proto.messages.MessageRequest.prototype.getParticipantsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 11));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.setParticipantsList = function(value) {
  return jspb.Message.setField(this, 11, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.addParticipants = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 11, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearParticipantsList = function() {
  return this.setParticipantsList([]);
};


/**
 * optional LinkPreview preview = 12;
 * @return {?proto.messages.LinkPreview}
 */
proto.messages.MessageRequest.prototype.getPreview = function() {
  return /** @type{?proto.messages.LinkPreview} */ (
    jspb.Message.getWrapperField(this, proto.messages.LinkPreview, 12));
};


/**
 * @param {?proto.messages.LinkPreview|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setPreview = function(value) {
  return jspb.Message.setWrapperField(this, 12, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearPreview = function() {
  return this.setPreview(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasPreview = function() {
  return jspb.Message.getField(this, 12) != null;
};


/**
 * repeated vCardContact contacts = 13;
 * @return {!Array<!proto.messages.vCardContact>}
 */
proto.messages.MessageRequest.prototype.getContactsList = function() {
  return /** @type{!Array<!proto.messages.vCardContact>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.messages.vCardContact, 13));
};


/**
 * @param {!Array<!proto.messages.vCardContact>} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setContactsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 13, value);
};


/**
 * @param {!proto.messages.vCardContact=} opt_value
 * @param {number=} opt_index
 * @return {!proto.messages.vCardContact}
 */
proto.messages.MessageRequest.prototype.addContacts = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 13, opt_value, proto.messages.vCardContact, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearContactsList = function() {
  return this.setContactsList([]);
};


/**
 * optional EventMessage event = 14;
 * @return {?proto.messages.EventMessage}
 */
proto.messages.MessageRequest.prototype.getEvent = function() {
  return /** @type{?proto.messages.EventMessage} */ (
    jspb.Message.getWrapperField(this, proto.messages.EventMessage, 14));
};


/**
 * @param {?proto.messages.EventMessage|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setEvent = function(value) {
  return jspb.Message.setWrapperField(this, 14, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearEvent = function() {
  return this.setEvent(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasEvent = function() {
  return jspb.Message.getField(this, 14) != null;
};


/**
 * optional PollMessage poll = 15;
 * @return {?proto.messages.PollMessage}
 */
proto.messages.MessageRequest.prototype.getPoll = function() {
  return /** @type{?proto.messages.PollMessage} */ (
    jspb.Message.getWrapperField(this, proto.messages.PollMessage, 15));
};


/**
 * @param {?proto.messages.PollMessage|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setPoll = function(value) {
  return jspb.Message.setWrapperField(this, 15, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearPoll = function() {
  return this.setPoll(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasPoll = function() {
  return jspb.Message.getField(this, 15) != null;
};


/**
 * optional ListMessage list = 16;
 * @return {?proto.messages.ListMessage}
 */
proto.messages.MessageRequest.prototype.getList = function() {
  return /** @type{?proto.messages.ListMessage} */ (
    jspb.Message.getWrapperField(this, proto.messages.ListMessage, 16));
};


/**
 * @param {?proto.messages.ListMessage|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setList = function(value) {
  return jspb.Message.setWrapperField(this, 16, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearList = function() {
  return this.setList(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasList = function() {
  return jspb.Message.getField(this, 16) != null;
};


/**
 * optional Location location = 17;
 * @return {?proto.messages.Location}
 */
proto.messages.MessageRequest.prototype.getLocation = function() {
  return /** @type{?proto.messages.Location} */ (
    jspb.Message.getWrapperField(this, proto.messages.Location, 17));
};


/**
 * @param {?proto.messages.Location|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setLocation = function(value) {
  return jspb.Message.setWrapperField(this, 17, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearLocation = function() {
  return this.setLocation(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasLocation = function() {
  return jspb.Message.getField(this, 17) != null;
};


/**
 * optional PollVoteMessage pollVote = 18;
 * @return {?proto.messages.PollVoteMessage}
 */
proto.messages.MessageRequest.prototype.getPollvote = function() {
  return /** @type{?proto.messages.PollVoteMessage} */ (
    jspb.Message.getWrapperField(this, proto.messages.PollVoteMessage, 18));
};


/**
 * @param {?proto.messages.PollVoteMessage|undefined} value
 * @return {!proto.messages.MessageRequest} returns this
*/
proto.messages.MessageRequest.prototype.setPollvote = function(value) {
  return jspb.Message.setWrapperField(this, 18, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearPollvote = function() {
  return this.setPollvote(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageRequest.prototype.hasPollvote = function() {
  return jspb.Message.getField(this, 18) != null;
};


/**
 * repeated string mentions = 19;
 * @return {!Array<string>}
 */
proto.messages.MessageRequest.prototype.getMentionsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 19));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.setMentionsList = function(value) {
  return jspb.Message.setField(this, 19, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.addMentions = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 19, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.MessageRequest} returns this
 */
proto.messages.MessageRequest.prototype.clearMentionsList = function() {
  return this.setMentionsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Row.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Row.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Row} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Row.toObject = function(includeInstance, msg) {
  var f, obj = {
    title: jspb.Message.getFieldWithDefault(msg, 1, ""),
    description: jspb.Message.getFieldWithDefault(msg, 2, ""),
    rowid: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Row}
 */
proto.messages.Row.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Row;
  return proto.messages.Row.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Row} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Row}
 */
proto.messages.Row.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setRowid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Row.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Row.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Row} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Row.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getRowid();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string title = 1;
 * @return {string}
 */
proto.messages.Row.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Row} returns this
 */
proto.messages.Row.prototype.setTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string description = 2;
 * @return {string}
 */
proto.messages.Row.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Row} returns this
 */
proto.messages.Row.prototype.setDescription = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.messages.Row} returns this
 */
proto.messages.Row.prototype.clearDescription = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.Row.prototype.hasDescription = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string rowId = 3;
 * @return {string}
 */
proto.messages.Row.prototype.getRowid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Row} returns this
 */
proto.messages.Row.prototype.setRowid = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.Section.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Section.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Section.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Section} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Section.toObject = function(includeInstance, msg) {
  var f, obj = {
    title: jspb.Message.getFieldWithDefault(msg, 1, ""),
    rowsList: jspb.Message.toObjectList(msg.getRowsList(),
    proto.messages.Row.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Section}
 */
proto.messages.Section.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Section;
  return proto.messages.Section.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Section} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Section}
 */
proto.messages.Section.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 2:
      var value = new proto.messages.Row;
      reader.readMessage(value,proto.messages.Row.deserializeBinaryFromReader);
      msg.addRows(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Section.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Section.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Section} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Section.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRowsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.messages.Row.serializeBinaryToWriter
    );
  }
};


/**
 * optional string title = 1;
 * @return {string}
 */
proto.messages.Section.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Section} returns this
 */
proto.messages.Section.prototype.setTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated Row rows = 2;
 * @return {!Array<!proto.messages.Row>}
 */
proto.messages.Section.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.messages.Row>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.messages.Row, 2));
};


/**
 * @param {!Array<!proto.messages.Row>} value
 * @return {!proto.messages.Section} returns this
*/
proto.messages.Section.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.messages.Row=} opt_value
 * @param {number=} opt_index
 * @return {!proto.messages.Row}
 */
proto.messages.Section.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.messages.Row, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.Section} returns this
 */
proto.messages.Section.prototype.clearRowsList = function() {
  return this.setRowsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.ListMessage.repeatedFields_ = [5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ListMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ListMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ListMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ListMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    title: jspb.Message.getFieldWithDefault(msg, 1, ""),
    description: jspb.Message.getFieldWithDefault(msg, 2, ""),
    footer: jspb.Message.getFieldWithDefault(msg, 3, ""),
    button: jspb.Message.getFieldWithDefault(msg, 4, ""),
    sectionsList: jspb.Message.toObjectList(msg.getSectionsList(),
    proto.messages.Section.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ListMessage}
 */
proto.messages.ListMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ListMessage;
  return proto.messages.ListMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ListMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ListMessage}
 */
proto.messages.ListMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setFooter(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setButton(value);
      break;
    case 5:
      var value = new proto.messages.Section;
      reader.readMessage(value,proto.messages.Section.deserializeBinaryFromReader);
      msg.addSections(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ListMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ListMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ListMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ListMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getButton();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getSectionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.messages.Section.serializeBinaryToWriter
    );
  }
};


/**
 * optional string title = 1;
 * @return {string}
 */
proto.messages.ListMessage.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ListMessage} returns this
 */
proto.messages.ListMessage.prototype.setTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string description = 2;
 * @return {string}
 */
proto.messages.ListMessage.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ListMessage} returns this
 */
proto.messages.ListMessage.prototype.setDescription = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.messages.ListMessage} returns this
 */
proto.messages.ListMessage.prototype.clearDescription = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.ListMessage.prototype.hasDescription = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string footer = 3;
 * @return {string}
 */
proto.messages.ListMessage.prototype.getFooter = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ListMessage} returns this
 */
proto.messages.ListMessage.prototype.setFooter = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.messages.ListMessage} returns this
 */
proto.messages.ListMessage.prototype.clearFooter = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.ListMessage.prototype.hasFooter = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string button = 4;
 * @return {string}
 */
proto.messages.ListMessage.prototype.getButton = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ListMessage} returns this
 */
proto.messages.ListMessage.prototype.setButton = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * repeated Section sections = 5;
 * @return {!Array<!proto.messages.Section>}
 */
proto.messages.ListMessage.prototype.getSectionsList = function() {
  return /** @type{!Array<!proto.messages.Section>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.messages.Section, 5));
};


/**
 * @param {!Array<!proto.messages.Section>} value
 * @return {!proto.messages.ListMessage} returns this
*/
proto.messages.ListMessage.prototype.setSectionsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.messages.Section=} opt_value
 * @param {number=} opt_index
 * @return {!proto.messages.Section}
 */
proto.messages.ListMessage.prototype.addSections = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.messages.Section, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.ListMessage} returns this
 */
proto.messages.ListMessage.prototype.clearSectionsList = function() {
  return this.setSectionsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.MessageReaction.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.MessageReaction.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.MessageReaction} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MessageReaction.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    sender: jspb.Message.getFieldWithDefault(msg, 3, ""),
    messageid: jspb.Message.getFieldWithDefault(msg, 4, ""),
    reaction: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.MessageReaction}
 */
proto.messages.MessageReaction.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.MessageReaction;
  return proto.messages.MessageReaction.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.MessageReaction} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.MessageReaction}
 */
proto.messages.MessageReaction.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setSender(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessageid(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setReaction(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.MessageReaction.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.MessageReaction.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.MessageReaction} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MessageReaction.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSender();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMessageid();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getReaction();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.MessageReaction.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.MessageReaction} returns this
*/
proto.messages.MessageReaction.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageReaction} returns this
 */
proto.messages.MessageReaction.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageReaction.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.MessageReaction.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MessageReaction} returns this
 */
proto.messages.MessageReaction.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string sender = 3;
 * @return {string}
 */
proto.messages.MessageReaction.prototype.getSender = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MessageReaction} returns this
 */
proto.messages.MessageReaction.prototype.setSender = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string messageId = 4;
 * @return {string}
 */
proto.messages.MessageReaction.prototype.getMessageid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MessageReaction} returns this
 */
proto.messages.MessageReaction.prototype.setMessageid = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string reaction = 5;
 * @return {string}
 */
proto.messages.MessageReaction.prototype.getReaction = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MessageReaction} returns this
 */
proto.messages.MessageReaction.prototype.setReaction = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.MessageResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.MessageResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.MessageResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MessageResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    timestamp: jspb.Message.getFieldWithDefault(msg, 2, 0),
    message: (f = msg.getMessage()) && proto.messages.Json.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.MessageResponse}
 */
proto.messages.MessageResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.MessageResponse;
  return proto.messages.MessageResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.MessageResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.MessageResponse}
 */
proto.messages.MessageResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTimestamp(value);
      break;
    case 3:
      var value = new proto.messages.Json;
      reader.readMessage(value,proto.messages.Json.deserializeBinaryFromReader);
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.MessageResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.MessageResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.MessageResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MessageResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTimestamp();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = message.getMessage();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.messages.Json.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.messages.MessageResponse.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MessageResponse} returns this
 */
proto.messages.MessageResponse.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int64 timestamp = 2;
 * @return {number}
 */
proto.messages.MessageResponse.prototype.getTimestamp = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.MessageResponse} returns this
 */
proto.messages.MessageResponse.prototype.setTimestamp = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional Json message = 3;
 * @return {?proto.messages.Json}
 */
proto.messages.MessageResponse.prototype.getMessage = function() {
  return /** @type{?proto.messages.Json} */ (
    jspb.Message.getWrapperField(this, proto.messages.Json, 3));
};


/**
 * @param {?proto.messages.Json|undefined} value
 * @return {!proto.messages.MessageResponse} returns this
*/
proto.messages.MessageResponse.prototype.setMessage = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageResponse} returns this
 */
proto.messages.MessageResponse.prototype.clearMessage = function() {
  return this.setMessage(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageResponse.prototype.hasMessage = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.NewMessageIDResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.NewMessageIDResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.NewMessageIDResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewMessageIDResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.NewMessageIDResponse}
 */
proto.messages.NewMessageIDResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.NewMessageIDResponse;
  return proto.messages.NewMessageIDResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.NewMessageIDResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.NewMessageIDResponse}
 */
proto.messages.NewMessageIDResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.NewMessageIDResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.NewMessageIDResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.NewMessageIDResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewMessageIDResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.messages.NewMessageIDResponse.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.NewMessageIDResponse} returns this
 */
proto.messages.NewMessageIDResponse.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ProfilePictureRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ProfilePictureRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ProfilePictureRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ProfilePictureRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ProfilePictureRequest}
 */
proto.messages.ProfilePictureRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ProfilePictureRequest;
  return proto.messages.ProfilePictureRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ProfilePictureRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ProfilePictureRequest}
 */
proto.messages.ProfilePictureRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ProfilePictureRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ProfilePictureRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ProfilePictureRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ProfilePictureRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.ProfilePictureRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.ProfilePictureRequest} returns this
*/
proto.messages.ProfilePictureRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.ProfilePictureRequest} returns this
 */
proto.messages.ProfilePictureRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.ProfilePictureRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.ProfilePictureRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ProfilePictureRequest} returns this
 */
proto.messages.ProfilePictureRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ProfilePictureResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ProfilePictureResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ProfilePictureResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ProfilePictureResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    url: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ProfilePictureResponse}
 */
proto.messages.ProfilePictureResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ProfilePictureResponse;
  return proto.messages.ProfilePictureResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ProfilePictureResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ProfilePictureResponse}
 */
proto.messages.ProfilePictureResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setUrl(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ProfilePictureResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ProfilePictureResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ProfilePictureResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ProfilePictureResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUrl();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string url = 2;
 * @return {string}
 */
proto.messages.ProfilePictureResponse.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ProfilePictureResponse} returns this
 */
proto.messages.ProfilePictureResponse.prototype.setUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ButtonReplyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ButtonReplyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ButtonReplyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ButtonReplyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    selecteddisplaytext: jspb.Message.getFieldWithDefault(msg, 3, ""),
    selectedbuttonid: jspb.Message.getFieldWithDefault(msg, 4, ""),
    replyto: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ButtonReplyRequest}
 */
proto.messages.ButtonReplyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ButtonReplyRequest;
  return proto.messages.ButtonReplyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ButtonReplyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ButtonReplyRequest}
 */
proto.messages.ButtonReplyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setSelecteddisplaytext(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setSelectedbuttonid(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setReplyto(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ButtonReplyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ButtonReplyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ButtonReplyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ButtonReplyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSelecteddisplaytext();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getSelectedbuttonid();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getReplyto();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.ButtonReplyRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.ButtonReplyRequest} returns this
*/
proto.messages.ButtonReplyRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.ButtonReplyRequest} returns this
 */
proto.messages.ButtonReplyRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.ButtonReplyRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.ButtonReplyRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ButtonReplyRequest} returns this
 */
proto.messages.ButtonReplyRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string selectedDisplayText = 3;
 * @return {string}
 */
proto.messages.ButtonReplyRequest.prototype.getSelecteddisplaytext = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ButtonReplyRequest} returns this
 */
proto.messages.ButtonReplyRequest.prototype.setSelecteddisplaytext = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string selectedButtonID = 4;
 * @return {string}
 */
proto.messages.ButtonReplyRequest.prototype.getSelectedbuttonid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ButtonReplyRequest} returns this
 */
proto.messages.ButtonReplyRequest.prototype.setSelectedbuttonid = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string replyTo = 5;
 * @return {string}
 */
proto.messages.ButtonReplyRequest.prototype.getReplyto = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ButtonReplyRequest} returns this
 */
proto.messages.ButtonReplyRequest.prototype.setReplyto = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.PresenceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.PresenceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.PresenceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PresenceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    status: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.PresenceRequest}
 */
proto.messages.PresenceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.PresenceRequest;
  return proto.messages.PresenceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.PresenceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.PresenceRequest}
 */
proto.messages.PresenceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {!proto.messages.Presence} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.PresenceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.PresenceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.PresenceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PresenceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.PresenceRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.PresenceRequest} returns this
*/
proto.messages.PresenceRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.PresenceRequest} returns this
 */
proto.messages.PresenceRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.PresenceRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Presence status = 2;
 * @return {!proto.messages.Presence}
 */
proto.messages.PresenceRequest.prototype.getStatus = function() {
  return /** @type {!proto.messages.Presence} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.messages.Presence} value
 * @return {!proto.messages.PresenceRequest} returns this
 */
proto.messages.PresenceRequest.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ChatPresenceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ChatPresenceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ChatPresenceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ChatPresenceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    status: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ChatPresenceRequest}
 */
proto.messages.ChatPresenceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ChatPresenceRequest;
  return proto.messages.ChatPresenceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ChatPresenceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ChatPresenceRequest}
 */
proto.messages.ChatPresenceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {!proto.messages.ChatPresence} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ChatPresenceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ChatPresenceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ChatPresenceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ChatPresenceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.ChatPresenceRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.ChatPresenceRequest} returns this
*/
proto.messages.ChatPresenceRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.ChatPresenceRequest} returns this
 */
proto.messages.ChatPresenceRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.ChatPresenceRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.ChatPresenceRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ChatPresenceRequest} returns this
 */
proto.messages.ChatPresenceRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional ChatPresence status = 3;
 * @return {!proto.messages.ChatPresence}
 */
proto.messages.ChatPresenceRequest.prototype.getStatus = function() {
  return /** @type {!proto.messages.ChatPresence} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.messages.ChatPresence} value
 * @return {!proto.messages.ChatPresenceRequest} returns this
 */
proto.messages.ChatPresenceRequest.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SubscribePresenceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SubscribePresenceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SubscribePresenceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SubscribePresenceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SubscribePresenceRequest}
 */
proto.messages.SubscribePresenceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SubscribePresenceRequest;
  return proto.messages.SubscribePresenceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SubscribePresenceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SubscribePresenceRequest}
 */
proto.messages.SubscribePresenceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SubscribePresenceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SubscribePresenceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SubscribePresenceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SubscribePresenceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.SubscribePresenceRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.SubscribePresenceRequest} returns this
*/
proto.messages.SubscribePresenceRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SubscribePresenceRequest} returns this
 */
proto.messages.SubscribePresenceRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SubscribePresenceRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.SubscribePresenceRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SubscribePresenceRequest} returns this
 */
proto.messages.SubscribePresenceRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.MarkReadRequest.repeatedFields_ = [6];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.MarkReadRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.MarkReadRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.MarkReadRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MarkReadRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    sender: jspb.Message.getFieldWithDefault(msg, 3, ""),
    messageid: jspb.Message.getFieldWithDefault(msg, 4, ""),
    type: jspb.Message.getFieldWithDefault(msg, 5, 0),
    messageidsList: (f = jspb.Message.getRepeatedField(msg, 6)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.MarkReadRequest}
 */
proto.messages.MarkReadRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.MarkReadRequest;
  return proto.messages.MarkReadRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.MarkReadRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.MarkReadRequest}
 */
proto.messages.MarkReadRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setSender(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessageid(value);
      break;
    case 5:
      var value = /** @type {!proto.messages.ReceiptType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.addMessageids(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.MarkReadRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.MarkReadRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.MarkReadRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MarkReadRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSender();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMessageid();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = message.getMessageidsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      6,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.MarkReadRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.MarkReadRequest} returns this
*/
proto.messages.MarkReadRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MarkReadRequest} returns this
 */
proto.messages.MarkReadRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MarkReadRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.MarkReadRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MarkReadRequest} returns this
 */
proto.messages.MarkReadRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string sender = 3;
 * @return {string}
 */
proto.messages.MarkReadRequest.prototype.getSender = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MarkReadRequest} returns this
 */
proto.messages.MarkReadRequest.prototype.setSender = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string messageId = 4;
 * @return {string}
 */
proto.messages.MarkReadRequest.prototype.getMessageid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.MarkReadRequest} returns this
 */
proto.messages.MarkReadRequest.prototype.setMessageid = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional ReceiptType type = 5;
 * @return {!proto.messages.ReceiptType}
 */
proto.messages.MarkReadRequest.prototype.getType = function() {
  return /** @type {!proto.messages.ReceiptType} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {!proto.messages.ReceiptType} value
 * @return {!proto.messages.MarkReadRequest} returns this
 */
proto.messages.MarkReadRequest.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 5, value);
};


/**
 * repeated string messageIds = 6;
 * @return {!Array<string>}
 */
proto.messages.MarkReadRequest.prototype.getMessageidsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 6));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.MarkReadRequest} returns this
 */
proto.messages.MarkReadRequest.prototype.setMessageidsList = function(value) {
  return jspb.Message.setField(this, 6, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.MarkReadRequest} returns this
 */
proto.messages.MarkReadRequest.prototype.addMessageids = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 6, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.MarkReadRequest} returns this
 */
proto.messages.MarkReadRequest.prototype.clearMessageidsList = function() {
  return this.setMessageidsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.CheckPhonesRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.CheckPhonesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.CheckPhonesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.CheckPhonesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CheckPhonesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    phonesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.CheckPhonesRequest}
 */
proto.messages.CheckPhonesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.CheckPhonesRequest;
  return proto.messages.CheckPhonesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.CheckPhonesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.CheckPhonesRequest}
 */
proto.messages.CheckPhonesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addPhones(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.CheckPhonesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.CheckPhonesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.CheckPhonesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CheckPhonesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getPhonesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.CheckPhonesRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.CheckPhonesRequest} returns this
*/
proto.messages.CheckPhonesRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.CheckPhonesRequest} returns this
 */
proto.messages.CheckPhonesRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.CheckPhonesRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated string phones = 2;
 * @return {!Array<string>}
 */
proto.messages.CheckPhonesRequest.prototype.getPhonesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.CheckPhonesRequest} returns this
 */
proto.messages.CheckPhonesRequest.prototype.setPhonesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.CheckPhonesRequest} returns this
 */
proto.messages.CheckPhonesRequest.prototype.addPhones = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.CheckPhonesRequest} returns this
 */
proto.messages.CheckPhonesRequest.prototype.clearPhonesList = function() {
  return this.setPhonesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ChatUnreadRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ChatUnreadRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ChatUnreadRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ChatUnreadRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    read: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ChatUnreadRequest}
 */
proto.messages.ChatUnreadRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ChatUnreadRequest;
  return proto.messages.ChatUnreadRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ChatUnreadRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ChatUnreadRequest}
 */
proto.messages.ChatUnreadRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setRead(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ChatUnreadRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ChatUnreadRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ChatUnreadRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ChatUnreadRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getRead();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.ChatUnreadRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.ChatUnreadRequest} returns this
*/
proto.messages.ChatUnreadRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.ChatUnreadRequest} returns this
 */
proto.messages.ChatUnreadRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.ChatUnreadRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.ChatUnreadRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ChatUnreadRequest} returns this
 */
proto.messages.ChatUnreadRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool read = 3;
 * @return {boolean}
 */
proto.messages.ChatUnreadRequest.prototype.getRead = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.ChatUnreadRequest} returns this
 */
proto.messages.ChatUnreadRequest.prototype.setRead = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.PhoneInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.PhoneInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.PhoneInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PhoneInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    phone: jspb.Message.getFieldWithDefault(msg, 1, ""),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    registered: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.PhoneInfo}
 */
proto.messages.PhoneInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.PhoneInfo;
  return proto.messages.PhoneInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.PhoneInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.PhoneInfo}
 */
proto.messages.PhoneInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPhone(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setRegistered(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.PhoneInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.PhoneInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.PhoneInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PhoneInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPhone();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getRegistered();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional string phone = 1;
 * @return {string}
 */
proto.messages.PhoneInfo.prototype.getPhone = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.PhoneInfo} returns this
 */
proto.messages.PhoneInfo.prototype.setPhone = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.PhoneInfo.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.PhoneInfo} returns this
 */
proto.messages.PhoneInfo.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool registered = 3;
 * @return {boolean}
 */
proto.messages.PhoneInfo.prototype.getRegistered = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.PhoneInfo} returns this
 */
proto.messages.PhoneInfo.prototype.setRegistered = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.CheckPhonesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.CheckPhonesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.CheckPhonesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.CheckPhonesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CheckPhonesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    infosList: jspb.Message.toObjectList(msg.getInfosList(),
    proto.messages.PhoneInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.CheckPhonesResponse}
 */
proto.messages.CheckPhonesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.CheckPhonesResponse;
  return proto.messages.CheckPhonesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.CheckPhonesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.CheckPhonesResponse}
 */
proto.messages.CheckPhonesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.PhoneInfo;
      reader.readMessage(value,proto.messages.PhoneInfo.deserializeBinaryFromReader);
      msg.addInfos(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.CheckPhonesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.CheckPhonesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.CheckPhonesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CheckPhonesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInfosList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.messages.PhoneInfo.serializeBinaryToWriter
    );
  }
};


/**
 * repeated PhoneInfo infos = 1;
 * @return {!Array<!proto.messages.PhoneInfo>}
 */
proto.messages.CheckPhonesResponse.prototype.getInfosList = function() {
  return /** @type{!Array<!proto.messages.PhoneInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.messages.PhoneInfo, 1));
};


/**
 * @param {!Array<!proto.messages.PhoneInfo>} value
 * @return {!proto.messages.CheckPhonesResponse} returns this
*/
proto.messages.CheckPhonesResponse.prototype.setInfosList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.messages.PhoneInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.messages.PhoneInfo}
 */
proto.messages.CheckPhonesResponse.prototype.addInfos = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.messages.PhoneInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.CheckPhonesResponse} returns this
 */
proto.messages.CheckPhonesResponse.prototype.clearInfosList = function() {
  return this.setInfosList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.RevokeMessageRequest.repeatedFields_ = [5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.RevokeMessageRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.RevokeMessageRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.RevokeMessageRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.RevokeMessageRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    sender: jspb.Message.getFieldWithDefault(msg, 3, ""),
    messageid: jspb.Message.getFieldWithDefault(msg, 4, ""),
    participantsList: (f = jspb.Message.getRepeatedField(msg, 5)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.RevokeMessageRequest}
 */
proto.messages.RevokeMessageRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.RevokeMessageRequest;
  return proto.messages.RevokeMessageRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.RevokeMessageRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.RevokeMessageRequest}
 */
proto.messages.RevokeMessageRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setSender(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessageid(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.addParticipants(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.RevokeMessageRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.RevokeMessageRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.RevokeMessageRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.RevokeMessageRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSender();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMessageid();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getParticipantsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      5,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.RevokeMessageRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.RevokeMessageRequest} returns this
*/
proto.messages.RevokeMessageRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.RevokeMessageRequest} returns this
 */
proto.messages.RevokeMessageRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.RevokeMessageRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.RevokeMessageRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.RevokeMessageRequest} returns this
 */
proto.messages.RevokeMessageRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string sender = 3;
 * @return {string}
 */
proto.messages.RevokeMessageRequest.prototype.getSender = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.RevokeMessageRequest} returns this
 */
proto.messages.RevokeMessageRequest.prototype.setSender = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string messageId = 4;
 * @return {string}
 */
proto.messages.RevokeMessageRequest.prototype.getMessageid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.RevokeMessageRequest} returns this
 */
proto.messages.RevokeMessageRequest.prototype.setMessageid = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * repeated string participants = 5;
 * @return {!Array<string>}
 */
proto.messages.RevokeMessageRequest.prototype.getParticipantsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 5));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.RevokeMessageRequest} returns this
 */
proto.messages.RevokeMessageRequest.prototype.setParticipantsList = function(value) {
  return jspb.Message.setField(this, 5, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.RevokeMessageRequest} returns this
 */
proto.messages.RevokeMessageRequest.prototype.addParticipants = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 5, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.RevokeMessageRequest} returns this
 */
proto.messages.RevokeMessageRequest.prototype.clearParticipantsList = function() {
  return this.setParticipantsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.EditMessageRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.EditMessageRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.EditMessageRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EditMessageRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    messageid: jspb.Message.getFieldWithDefault(msg, 4, ""),
    text: jspb.Message.getFieldWithDefault(msg, 5, ""),
    linkpreview: jspb.Message.getBooleanFieldWithDefault(msg, 6, false),
    linkpreviewhighquality: jspb.Message.getBooleanFieldWithDefault(msg, 7, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.EditMessageRequest}
 */
proto.messages.EditMessageRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.EditMessageRequest;
  return proto.messages.EditMessageRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.EditMessageRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.EditMessageRequest}
 */
proto.messages.EditMessageRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessageid(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setText(value);
      break;
    case 6:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setLinkpreview(value);
      break;
    case 7:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setLinkpreviewhighquality(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.EditMessageRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.EditMessageRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.EditMessageRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EditMessageRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMessageid();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getText();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getLinkpreview();
  if (f) {
    writer.writeBool(
      6,
      f
    );
  }
  f = message.getLinkpreviewhighquality();
  if (f) {
    writer.writeBool(
      7,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.EditMessageRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.EditMessageRequest} returns this
*/
proto.messages.EditMessageRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.EditMessageRequest} returns this
 */
proto.messages.EditMessageRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.EditMessageRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.EditMessageRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EditMessageRequest} returns this
 */
proto.messages.EditMessageRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string messageId = 4;
 * @return {string}
 */
proto.messages.EditMessageRequest.prototype.getMessageid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EditMessageRequest} returns this
 */
proto.messages.EditMessageRequest.prototype.setMessageid = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string text = 5;
 * @return {string}
 */
proto.messages.EditMessageRequest.prototype.getText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EditMessageRequest} returns this
 */
proto.messages.EditMessageRequest.prototype.setText = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional bool linkPreview = 6;
 * @return {boolean}
 */
proto.messages.EditMessageRequest.prototype.getLinkpreview = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 6, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.EditMessageRequest} returns this
 */
proto.messages.EditMessageRequest.prototype.setLinkpreview = function(value) {
  return jspb.Message.setProto3BooleanField(this, 6, value);
};


/**
 * optional bool linkPreviewHighQuality = 7;
 * @return {boolean}
 */
proto.messages.EditMessageRequest.prototype.getLinkpreviewhighquality = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 7, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.EditMessageRequest} returns this
 */
proto.messages.EditMessageRequest.prototype.setLinkpreviewhighquality = function(value) {
  return jspb.Message.setProto3BooleanField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.NewsletterListRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.NewsletterListRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.NewsletterListRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterListRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.NewsletterListRequest}
 */
proto.messages.NewsletterListRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.NewsletterListRequest;
  return proto.messages.NewsletterListRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.NewsletterListRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.NewsletterListRequest}
 */
proto.messages.NewsletterListRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.NewsletterListRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.NewsletterListRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.NewsletterListRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterListRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.NewsletterListRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.NewsletterListRequest} returns this
*/
proto.messages.NewsletterListRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.NewsletterListRequest} returns this
 */
proto.messages.NewsletterListRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.NewsletterListRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Newsletter.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Newsletter.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Newsletter} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Newsletter.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    description: jspb.Message.getFieldWithDefault(msg, 3, ""),
    invite: jspb.Message.getFieldWithDefault(msg, 4, ""),
    preview: jspb.Message.getFieldWithDefault(msg, 6, ""),
    picture: jspb.Message.getFieldWithDefault(msg, 5, ""),
    verified: jspb.Message.getBooleanFieldWithDefault(msg, 7, false),
    role: jspb.Message.getFieldWithDefault(msg, 8, ""),
    subscribercount: jspb.Message.getFieldWithDefault(msg, 9, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Newsletter}
 */
proto.messages.Newsletter.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Newsletter;
  return proto.messages.Newsletter.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Newsletter} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Newsletter}
 */
proto.messages.Newsletter.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setInvite(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setPreview(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPicture(value);
      break;
    case 7:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setVerified(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setRole(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSubscribercount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Newsletter.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Newsletter.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Newsletter} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Newsletter.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDescription();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getInvite();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPreview();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getPicture();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getVerified();
  if (f) {
    writer.writeBool(
      7,
      f
    );
  }
  f = message.getRole();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getSubscribercount();
  if (f !== 0) {
    writer.writeInt64(
      9,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.messages.Newsletter.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Newsletter} returns this
 */
proto.messages.Newsletter.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.messages.Newsletter.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Newsletter} returns this
 */
proto.messages.Newsletter.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string description = 3;
 * @return {string}
 */
proto.messages.Newsletter.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Newsletter} returns this
 */
proto.messages.Newsletter.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string invite = 4;
 * @return {string}
 */
proto.messages.Newsletter.prototype.getInvite = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Newsletter} returns this
 */
proto.messages.Newsletter.prototype.setInvite = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string preview = 6;
 * @return {string}
 */
proto.messages.Newsletter.prototype.getPreview = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Newsletter} returns this
 */
proto.messages.Newsletter.prototype.setPreview = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string picture = 5;
 * @return {string}
 */
proto.messages.Newsletter.prototype.getPicture = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Newsletter} returns this
 */
proto.messages.Newsletter.prototype.setPicture = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional bool verified = 7;
 * @return {boolean}
 */
proto.messages.Newsletter.prototype.getVerified = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 7, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.Newsletter} returns this
 */
proto.messages.Newsletter.prototype.setVerified = function(value) {
  return jspb.Message.setProto3BooleanField(this, 7, value);
};


/**
 * optional string role = 8;
 * @return {string}
 */
proto.messages.Newsletter.prototype.getRole = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Newsletter} returns this
 */
proto.messages.Newsletter.prototype.setRole = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional int64 subscriberCount = 9;
 * @return {number}
 */
proto.messages.Newsletter.prototype.getSubscribercount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.Newsletter} returns this
 */
proto.messages.Newsletter.prototype.setSubscribercount = function(value) {
  return jspb.Message.setProto3IntField(this, 9, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.NewsletterList.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.NewsletterList.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.NewsletterList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.NewsletterList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterList.toObject = function(includeInstance, msg) {
  var f, obj = {
    newslettersList: jspb.Message.toObjectList(msg.getNewslettersList(),
    proto.messages.Newsletter.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.NewsletterList}
 */
proto.messages.NewsletterList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.NewsletterList;
  return proto.messages.NewsletterList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.NewsletterList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.NewsletterList}
 */
proto.messages.NewsletterList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Newsletter;
      reader.readMessage(value,proto.messages.Newsletter.deserializeBinaryFromReader);
      msg.addNewsletters(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.NewsletterList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.NewsletterList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.NewsletterList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNewslettersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.messages.Newsletter.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Newsletter newsletters = 1;
 * @return {!Array<!proto.messages.Newsletter>}
 */
proto.messages.NewsletterList.prototype.getNewslettersList = function() {
  return /** @type{!Array<!proto.messages.Newsletter>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.messages.Newsletter, 1));
};


/**
 * @param {!Array<!proto.messages.Newsletter>} value
 * @return {!proto.messages.NewsletterList} returns this
*/
proto.messages.NewsletterList.prototype.setNewslettersList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.messages.Newsletter=} opt_value
 * @param {number=} opt_index
 * @return {!proto.messages.Newsletter}
 */
proto.messages.NewsletterList.prototype.addNewsletters = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.messages.Newsletter, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.NewsletterList} returns this
 */
proto.messages.NewsletterList.prototype.clearNewslettersList = function() {
  return this.setNewslettersList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.NewsletterInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.NewsletterInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.NewsletterInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    id: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.NewsletterInfoRequest}
 */
proto.messages.NewsletterInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.NewsletterInfoRequest;
  return proto.messages.NewsletterInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.NewsletterInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.NewsletterInfoRequest}
 */
proto.messages.NewsletterInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.NewsletterInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.NewsletterInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.NewsletterInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.NewsletterInfoRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.NewsletterInfoRequest} returns this
*/
proto.messages.NewsletterInfoRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.NewsletterInfoRequest} returns this
 */
proto.messages.NewsletterInfoRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.NewsletterInfoRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string id = 2;
 * @return {string}
 */
proto.messages.NewsletterInfoRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.NewsletterInfoRequest} returns this
 */
proto.messages.NewsletterInfoRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.GetNewsletterMessagesByInviteRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.GetNewsletterMessagesByInviteRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetNewsletterMessagesByInviteRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    invite: jspb.Message.getFieldWithDefault(msg, 2, ""),
    limit: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.GetNewsletterMessagesByInviteRequest}
 */
proto.messages.GetNewsletterMessagesByInviteRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.GetNewsletterMessagesByInviteRequest;
  return proto.messages.GetNewsletterMessagesByInviteRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.GetNewsletterMessagesByInviteRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.GetNewsletterMessagesByInviteRequest}
 */
proto.messages.GetNewsletterMessagesByInviteRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setInvite(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLimit(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.GetNewsletterMessagesByInviteRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.GetNewsletterMessagesByInviteRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetNewsletterMessagesByInviteRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getInvite();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLimit();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.GetNewsletterMessagesByInviteRequest} returns this
*/
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetNewsletterMessagesByInviteRequest} returns this
 */
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string invite = 2;
 * @return {string}
 */
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.getInvite = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.GetNewsletterMessagesByInviteRequest} returns this
 */
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.setInvite = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int64 limit = 3;
 * @return {number}
 */
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.getLimit = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.GetNewsletterMessagesByInviteRequest} returns this
 */
proto.messages.GetNewsletterMessagesByInviteRequest.prototype.setLimit = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SearchPage.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SearchPage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SearchPage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SearchPage.toObject = function(includeInstance, msg) {
  var f, obj = {
    limit: jspb.Message.getFieldWithDefault(msg, 2, 0),
    startcursor: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SearchPage}
 */
proto.messages.SearchPage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SearchPage;
  return proto.messages.SearchPage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SearchPage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SearchPage}
 */
proto.messages.SearchPage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setLimit(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setStartcursor(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SearchPage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SearchPage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SearchPage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SearchPage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLimit();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getStartcursor();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional uint64 limit = 2;
 * @return {number}
 */
proto.messages.SearchPage.prototype.getLimit = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.SearchPage} returns this
 */
proto.messages.SearchPage.prototype.setLimit = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string startCursor = 3;
 * @return {string}
 */
proto.messages.SearchPage.prototype.getStartcursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SearchPage} returns this
 */
proto.messages.SearchPage.prototype.setStartcursor = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.SearchNewslettersByViewRequest.repeatedFields_ = [4,5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SearchNewslettersByViewRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SearchNewslettersByViewRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SearchNewslettersByViewRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SearchNewslettersByViewRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    page: (f = msg.getPage()) && proto.messages.SearchPage.toObject(includeInstance, f),
    view: jspb.Message.getFieldWithDefault(msg, 3, ""),
    categoriesList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
    countriesList: (f = jspb.Message.getRepeatedField(msg, 5)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SearchNewslettersByViewRequest}
 */
proto.messages.SearchNewslettersByViewRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SearchNewslettersByViewRequest;
  return proto.messages.SearchNewslettersByViewRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SearchNewslettersByViewRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SearchNewslettersByViewRequest}
 */
proto.messages.SearchNewslettersByViewRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = new proto.messages.SearchPage;
      reader.readMessage(value,proto.messages.SearchPage.deserializeBinaryFromReader);
      msg.setPage(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setView(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.addCategories(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.addCountries(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SearchNewslettersByViewRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SearchNewslettersByViewRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SearchNewslettersByViewRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SearchNewslettersByViewRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getPage();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.SearchPage.serializeBinaryToWriter
    );
  }
  f = message.getView();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getCategoriesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
  f = message.getCountriesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      5,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.SearchNewslettersByViewRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
*/
proto.messages.SearchNewslettersByViewRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
 */
proto.messages.SearchNewslettersByViewRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SearchNewslettersByViewRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional SearchPage page = 2;
 * @return {?proto.messages.SearchPage}
 */
proto.messages.SearchNewslettersByViewRequest.prototype.getPage = function() {
  return /** @type{?proto.messages.SearchPage} */ (
    jspb.Message.getWrapperField(this, proto.messages.SearchPage, 2));
};


/**
 * @param {?proto.messages.SearchPage|undefined} value
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
*/
proto.messages.SearchNewslettersByViewRequest.prototype.setPage = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
 */
proto.messages.SearchNewslettersByViewRequest.prototype.clearPage = function() {
  return this.setPage(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SearchNewslettersByViewRequest.prototype.hasPage = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string view = 3;
 * @return {string}
 */
proto.messages.SearchNewslettersByViewRequest.prototype.getView = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
 */
proto.messages.SearchNewslettersByViewRequest.prototype.setView = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * repeated string categories = 4;
 * @return {!Array<string>}
 */
proto.messages.SearchNewslettersByViewRequest.prototype.getCategoriesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
 */
proto.messages.SearchNewslettersByViewRequest.prototype.setCategoriesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
 */
proto.messages.SearchNewslettersByViewRequest.prototype.addCategories = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
 */
proto.messages.SearchNewslettersByViewRequest.prototype.clearCategoriesList = function() {
  return this.setCategoriesList([]);
};


/**
 * repeated string countries = 5;
 * @return {!Array<string>}
 */
proto.messages.SearchNewslettersByViewRequest.prototype.getCountriesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 5));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
 */
proto.messages.SearchNewslettersByViewRequest.prototype.setCountriesList = function(value) {
  return jspb.Message.setField(this, 5, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
 */
proto.messages.SearchNewslettersByViewRequest.prototype.addCountries = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 5, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.SearchNewslettersByViewRequest} returns this
 */
proto.messages.SearchNewslettersByViewRequest.prototype.clearCountriesList = function() {
  return this.setCountriesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.SearchNewslettersByTextRequest.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SearchNewslettersByTextRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SearchNewslettersByTextRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SearchNewslettersByTextRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SearchNewslettersByTextRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    page: (f = msg.getPage()) && proto.messages.SearchPage.toObject(includeInstance, f),
    text: jspb.Message.getFieldWithDefault(msg, 3, ""),
    categoriesList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SearchNewslettersByTextRequest}
 */
proto.messages.SearchNewslettersByTextRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SearchNewslettersByTextRequest;
  return proto.messages.SearchNewslettersByTextRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SearchNewslettersByTextRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SearchNewslettersByTextRequest}
 */
proto.messages.SearchNewslettersByTextRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = new proto.messages.SearchPage;
      reader.readMessage(value,proto.messages.SearchPage.deserializeBinaryFromReader);
      msg.setPage(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setText(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.addCategories(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SearchNewslettersByTextRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SearchNewslettersByTextRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SearchNewslettersByTextRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SearchNewslettersByTextRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getPage();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.SearchPage.serializeBinaryToWriter
    );
  }
  f = message.getText();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getCategoriesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.SearchNewslettersByTextRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.SearchNewslettersByTextRequest} returns this
*/
proto.messages.SearchNewslettersByTextRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SearchNewslettersByTextRequest} returns this
 */
proto.messages.SearchNewslettersByTextRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SearchNewslettersByTextRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional SearchPage page = 2;
 * @return {?proto.messages.SearchPage}
 */
proto.messages.SearchNewslettersByTextRequest.prototype.getPage = function() {
  return /** @type{?proto.messages.SearchPage} */ (
    jspb.Message.getWrapperField(this, proto.messages.SearchPage, 2));
};


/**
 * @param {?proto.messages.SearchPage|undefined} value
 * @return {!proto.messages.SearchNewslettersByTextRequest} returns this
*/
proto.messages.SearchNewslettersByTextRequest.prototype.setPage = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.SearchNewslettersByTextRequest} returns this
 */
proto.messages.SearchNewslettersByTextRequest.prototype.clearPage = function() {
  return this.setPage(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.SearchNewslettersByTextRequest.prototype.hasPage = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string text = 3;
 * @return {string}
 */
proto.messages.SearchNewslettersByTextRequest.prototype.getText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SearchNewslettersByTextRequest} returns this
 */
proto.messages.SearchNewslettersByTextRequest.prototype.setText = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * repeated string categories = 4;
 * @return {!Array<string>}
 */
proto.messages.SearchNewslettersByTextRequest.prototype.getCategoriesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.SearchNewslettersByTextRequest} returns this
 */
proto.messages.SearchNewslettersByTextRequest.prototype.setCategoriesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.SearchNewslettersByTextRequest} returns this
 */
proto.messages.SearchNewslettersByTextRequest.prototype.addCategories = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.SearchNewslettersByTextRequest} returns this
 */
proto.messages.SearchNewslettersByTextRequest.prototype.clearCategoriesList = function() {
  return this.setCategoriesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SearchPageResult.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SearchPageResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SearchPageResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SearchPageResult.toObject = function(includeInstance, msg) {
  var f, obj = {
    startcursor: jspb.Message.getFieldWithDefault(msg, 1, ""),
    endcursor: jspb.Message.getFieldWithDefault(msg, 2, ""),
    hasnextpage: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
    haspreviouspage: jspb.Message.getBooleanFieldWithDefault(msg, 4, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SearchPageResult}
 */
proto.messages.SearchPageResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SearchPageResult;
  return proto.messages.SearchPageResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SearchPageResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SearchPageResult}
 */
proto.messages.SearchPageResult.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStartcursor(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEndcursor(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setHasnextpage(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setHaspreviouspage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SearchPageResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SearchPageResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SearchPageResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SearchPageResult.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartcursor();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getEndcursor();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getHasnextpage();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getHaspreviouspage();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
};


/**
 * optional string startCursor = 1;
 * @return {string}
 */
proto.messages.SearchPageResult.prototype.getStartcursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SearchPageResult} returns this
 */
proto.messages.SearchPageResult.prototype.setStartcursor = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string endCursor = 2;
 * @return {string}
 */
proto.messages.SearchPageResult.prototype.getEndcursor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SearchPageResult} returns this
 */
proto.messages.SearchPageResult.prototype.setEndcursor = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool hasNextPage = 3;
 * @return {boolean}
 */
proto.messages.SearchPageResult.prototype.getHasnextpage = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.SearchPageResult} returns this
 */
proto.messages.SearchPageResult.prototype.setHasnextpage = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * optional bool hasPreviousPage = 4;
 * @return {boolean}
 */
proto.messages.SearchPageResult.prototype.getHaspreviouspage = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.SearchPageResult} returns this
 */
proto.messages.SearchPageResult.prototype.setHaspreviouspage = function(value) {
  return jspb.Message.setProto3BooleanField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.NewsletterSearchPageResult.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.NewsletterSearchPageResult.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.NewsletterSearchPageResult} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterSearchPageResult.toObject = function(includeInstance, msg) {
  var f, obj = {
    page: (f = msg.getPage()) && proto.messages.SearchPageResult.toObject(includeInstance, f),
    newsletters: (f = msg.getNewsletters()) && proto.messages.NewsletterList.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.NewsletterSearchPageResult}
 */
proto.messages.NewsletterSearchPageResult.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.NewsletterSearchPageResult;
  return proto.messages.NewsletterSearchPageResult.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.NewsletterSearchPageResult} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.NewsletterSearchPageResult}
 */
proto.messages.NewsletterSearchPageResult.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.SearchPageResult;
      reader.readMessage(value,proto.messages.SearchPageResult.deserializeBinaryFromReader);
      msg.setPage(value);
      break;
    case 2:
      var value = new proto.messages.NewsletterList;
      reader.readMessage(value,proto.messages.NewsletterList.deserializeBinaryFromReader);
      msg.setNewsletters(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.NewsletterSearchPageResult.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.NewsletterSearchPageResult.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.NewsletterSearchPageResult} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterSearchPageResult.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPage();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.SearchPageResult.serializeBinaryToWriter
    );
  }
  f = message.getNewsletters();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.NewsletterList.serializeBinaryToWriter
    );
  }
};


/**
 * optional SearchPageResult page = 1;
 * @return {?proto.messages.SearchPageResult}
 */
proto.messages.NewsletterSearchPageResult.prototype.getPage = function() {
  return /** @type{?proto.messages.SearchPageResult} */ (
    jspb.Message.getWrapperField(this, proto.messages.SearchPageResult, 1));
};


/**
 * @param {?proto.messages.SearchPageResult|undefined} value
 * @return {!proto.messages.NewsletterSearchPageResult} returns this
*/
proto.messages.NewsletterSearchPageResult.prototype.setPage = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.NewsletterSearchPageResult} returns this
 */
proto.messages.NewsletterSearchPageResult.prototype.clearPage = function() {
  return this.setPage(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.NewsletterSearchPageResult.prototype.hasPage = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional NewsletterList newsletters = 2;
 * @return {?proto.messages.NewsletterList}
 */
proto.messages.NewsletterSearchPageResult.prototype.getNewsletters = function() {
  return /** @type{?proto.messages.NewsletterList} */ (
    jspb.Message.getWrapperField(this, proto.messages.NewsletterList, 2));
};


/**
 * @param {?proto.messages.NewsletterList|undefined} value
 * @return {!proto.messages.NewsletterSearchPageResult} returns this
*/
proto.messages.NewsletterSearchPageResult.prototype.setNewsletters = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.NewsletterSearchPageResult} returns this
 */
proto.messages.NewsletterSearchPageResult.prototype.clearNewsletters = function() {
  return this.setNewsletters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.NewsletterSearchPageResult.prototype.hasNewsletters = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.CreateNewsletterRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.CreateNewsletterRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.CreateNewsletterRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CreateNewsletterRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    description: jspb.Message.getFieldWithDefault(msg, 3, ""),
    picture: msg.getPicture_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.CreateNewsletterRequest}
 */
proto.messages.CreateNewsletterRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.CreateNewsletterRequest;
  return proto.messages.CreateNewsletterRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.CreateNewsletterRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.CreateNewsletterRequest}
 */
proto.messages.CreateNewsletterRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPicture(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.CreateNewsletterRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.CreateNewsletterRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.CreateNewsletterRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CreateNewsletterRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDescription();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getPicture_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.CreateNewsletterRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.CreateNewsletterRequest} returns this
*/
proto.messages.CreateNewsletterRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.CreateNewsletterRequest} returns this
 */
proto.messages.CreateNewsletterRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.CreateNewsletterRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.messages.CreateNewsletterRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.CreateNewsletterRequest} returns this
 */
proto.messages.CreateNewsletterRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string description = 3;
 * @return {string}
 */
proto.messages.CreateNewsletterRequest.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.CreateNewsletterRequest} returns this
 */
proto.messages.CreateNewsletterRequest.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional bytes picture = 4;
 * @return {!(string|Uint8Array)}
 */
proto.messages.CreateNewsletterRequest.prototype.getPicture = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes picture = 4;
 * This is a type-conversion wrapper around `getPicture()`
 * @return {string}
 */
proto.messages.CreateNewsletterRequest.prototype.getPicture_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPicture()));
};


/**
 * optional bytes picture = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPicture()`
 * @return {!Uint8Array}
 */
proto.messages.CreateNewsletterRequest.prototype.getPicture_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPicture()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.messages.CreateNewsletterRequest} returns this
 */
proto.messages.CreateNewsletterRequest.prototype.setPicture = function(value) {
  return jspb.Message.setProto3BytesField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.NewsletterToggleMuteRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.NewsletterToggleMuteRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.NewsletterToggleMuteRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterToggleMuteRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    mute: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.NewsletterToggleMuteRequest}
 */
proto.messages.NewsletterToggleMuteRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.NewsletterToggleMuteRequest;
  return proto.messages.NewsletterToggleMuteRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.NewsletterToggleMuteRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.NewsletterToggleMuteRequest}
 */
proto.messages.NewsletterToggleMuteRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setMute(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.NewsletterToggleMuteRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.NewsletterToggleMuteRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.NewsletterToggleMuteRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterToggleMuteRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMute();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.NewsletterToggleMuteRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.NewsletterToggleMuteRequest} returns this
*/
proto.messages.NewsletterToggleMuteRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.NewsletterToggleMuteRequest} returns this
 */
proto.messages.NewsletterToggleMuteRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.NewsletterToggleMuteRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.NewsletterToggleMuteRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.NewsletterToggleMuteRequest} returns this
 */
proto.messages.NewsletterToggleMuteRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool mute = 3;
 * @return {boolean}
 */
proto.messages.NewsletterToggleMuteRequest.prototype.getMute = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.NewsletterToggleMuteRequest} returns this
 */
proto.messages.NewsletterToggleMuteRequest.prototype.setMute = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.NewsletterToggleFollowRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.NewsletterToggleFollowRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.NewsletterToggleFollowRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterToggleFollowRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    follow: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.NewsletterToggleFollowRequest}
 */
proto.messages.NewsletterToggleFollowRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.NewsletterToggleFollowRequest;
  return proto.messages.NewsletterToggleFollowRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.NewsletterToggleFollowRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.NewsletterToggleFollowRequest}
 */
proto.messages.NewsletterToggleFollowRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setFollow(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.NewsletterToggleFollowRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.NewsletterToggleFollowRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.NewsletterToggleFollowRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.NewsletterToggleFollowRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getFollow();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.NewsletterToggleFollowRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.NewsletterToggleFollowRequest} returns this
*/
proto.messages.NewsletterToggleFollowRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.NewsletterToggleFollowRequest} returns this
 */
proto.messages.NewsletterToggleFollowRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.NewsletterToggleFollowRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.NewsletterToggleFollowRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.NewsletterToggleFollowRequest} returns this
 */
proto.messages.NewsletterToggleFollowRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool follow = 3;
 * @return {boolean}
 */
proto.messages.NewsletterToggleFollowRequest.prototype.getFollow = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.NewsletterToggleFollowRequest} returns this
 */
proto.messages.NewsletterToggleFollowRequest.prototype.setFollow = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.DownloadMediaRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.DownloadMediaRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.DownloadMediaRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.DownloadMediaRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    message: jspb.Message.getFieldWithDefault(msg, 2, ""),
    jid: jspb.Message.getFieldWithDefault(msg, 3, ""),
    messageid: jspb.Message.getFieldWithDefault(msg, 4, ""),
    contentpath: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.DownloadMediaRequest}
 */
proto.messages.DownloadMediaRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.DownloadMediaRequest;
  return proto.messages.DownloadMediaRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.DownloadMediaRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.DownloadMediaRequest}
 */
proto.messages.DownloadMediaRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessage(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessageid(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setContentpath(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.DownloadMediaRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.DownloadMediaRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.DownloadMediaRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.DownloadMediaRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMessageid();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getContentpath();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.DownloadMediaRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.DownloadMediaRequest} returns this
*/
proto.messages.DownloadMediaRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.DownloadMediaRequest} returns this
 */
proto.messages.DownloadMediaRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.DownloadMediaRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.messages.DownloadMediaRequest.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.DownloadMediaRequest} returns this
 */
proto.messages.DownloadMediaRequest.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string jid = 3;
 * @return {string}
 */
proto.messages.DownloadMediaRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.DownloadMediaRequest} returns this
 */
proto.messages.DownloadMediaRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string messageId = 4;
 * @return {string}
 */
proto.messages.DownloadMediaRequest.prototype.getMessageid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.DownloadMediaRequest} returns this
 */
proto.messages.DownloadMediaRequest.prototype.setMessageid = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string contentPath = 5;
 * @return {string}
 */
proto.messages.DownloadMediaRequest.prototype.getContentpath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.DownloadMediaRequest} returns this
 */
proto.messages.DownloadMediaRequest.prototype.setContentpath = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.DownloadMediaResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.DownloadMediaResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.DownloadMediaResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.DownloadMediaResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    content: msg.getContent_asB64(),
    contentpath: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.DownloadMediaResponse}
 */
proto.messages.DownloadMediaResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.DownloadMediaResponse;
  return proto.messages.DownloadMediaResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.DownloadMediaResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.DownloadMediaResponse}
 */
proto.messages.DownloadMediaResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setContent(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setContentpath(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.DownloadMediaResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.DownloadMediaResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.DownloadMediaResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.DownloadMediaResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getContent_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getContentpath();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional bytes content = 1;
 * @return {!(string|Uint8Array)}
 */
proto.messages.DownloadMediaResponse.prototype.getContent = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes content = 1;
 * This is a type-conversion wrapper around `getContent()`
 * @return {string}
 */
proto.messages.DownloadMediaResponse.prototype.getContent_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getContent()));
};


/**
 * optional bytes content = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getContent()`
 * @return {!Uint8Array}
 */
proto.messages.DownloadMediaResponse.prototype.getContent_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getContent()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.messages.DownloadMediaResponse} returns this
 */
proto.messages.DownloadMediaResponse.prototype.setContent = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional string contentPath = 5;
 * @return {string}
 */
proto.messages.DownloadMediaResponse.prototype.getContentpath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.DownloadMediaResponse} returns this
 */
proto.messages.DownloadMediaResponse.prototype.setContentpath = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.EntityByIdRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.EntityByIdRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.EntityByIdRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EntityByIdRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    id: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.EntityByIdRequest}
 */
proto.messages.EntityByIdRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.EntityByIdRequest;
  return proto.messages.EntityByIdRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.EntityByIdRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.EntityByIdRequest}
 */
proto.messages.EntityByIdRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.EntityByIdRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.EntityByIdRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.EntityByIdRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.EntityByIdRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.EntityByIdRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.EntityByIdRequest} returns this
*/
proto.messages.EntityByIdRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.EntityByIdRequest} returns this
 */
proto.messages.EntityByIdRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.EntityByIdRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string id = 2;
 * @return {string}
 */
proto.messages.EntityByIdRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.EntityByIdRequest} returns this
 */
proto.messages.EntityByIdRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Json.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Json.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Json} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Json.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Json}
 */
proto.messages.Json.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Json;
  return proto.messages.Json.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Json} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Json}
 */
proto.messages.Json.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Json.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Json.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Json} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Json.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string data = 1;
 * @return {string}
 */
proto.messages.Json.prototype.getData = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Json} returns this
 */
proto.messages.Json.prototype.setData = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.JsonList.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.JsonList.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.JsonList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.JsonList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.JsonList.toObject = function(includeInstance, msg) {
  var f, obj = {
    elementsList: jspb.Message.toObjectList(msg.getElementsList(),
    proto.messages.Json.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.JsonList}
 */
proto.messages.JsonList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.JsonList;
  return proto.messages.JsonList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.JsonList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.JsonList}
 */
proto.messages.JsonList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Json;
      reader.readMessage(value,proto.messages.Json.deserializeBinaryFromReader);
      msg.addElements(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.JsonList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.JsonList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.JsonList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.JsonList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getElementsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.messages.Json.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Json elements = 1;
 * @return {!Array<!proto.messages.Json>}
 */
proto.messages.JsonList.prototype.getElementsList = function() {
  return /** @type{!Array<!proto.messages.Json>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.messages.Json, 1));
};


/**
 * @param {!Array<!proto.messages.Json>} value
 * @return {!proto.messages.JsonList} returns this
*/
proto.messages.JsonList.prototype.setElementsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.messages.Json=} opt_value
 * @param {number=} opt_index
 * @return {!proto.messages.Json}
 */
proto.messages.JsonList.prototype.addElements = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.messages.Json, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.JsonList} returns this
 */
proto.messages.JsonList.prototype.clearElementsList = function() {
  return this.setElementsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Pagination.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Pagination.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Pagination} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Pagination.toObject = function(includeInstance, msg) {
  var f, obj = {
    limit: jspb.Message.getFieldWithDefault(msg, 1, 0),
    offset: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Pagination}
 */
proto.messages.Pagination.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Pagination;
  return proto.messages.Pagination.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Pagination} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Pagination}
 */
proto.messages.Pagination.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setLimit(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setOffset(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Pagination.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Pagination.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Pagination} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Pagination.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLimit();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getOffset();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
};


/**
 * optional uint64 limit = 1;
 * @return {number}
 */
proto.messages.Pagination.prototype.getLimit = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.Pagination} returns this
 */
proto.messages.Pagination.prototype.setLimit = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint64 offset = 2;
 * @return {number}
 */
proto.messages.Pagination.prototype.getOffset = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.Pagination} returns this
 */
proto.messages.Pagination.prototype.setOffset = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.SortBy.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.SortBy.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.SortBy} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SortBy.toObject = function(includeInstance, msg) {
  var f, obj = {
    field: jspb.Message.getFieldWithDefault(msg, 1, ""),
    order: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.SortBy}
 */
proto.messages.SortBy.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.SortBy;
  return proto.messages.SortBy.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.SortBy} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.SortBy}
 */
proto.messages.SortBy.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setField(value);
      break;
    case 2:
      var value = /** @type {!proto.messages.SortBy.Order} */ (reader.readEnum());
      msg.setOrder(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.SortBy.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.SortBy.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.SortBy} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.SortBy.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getField();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getOrder();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.messages.SortBy.Order = {
  ASC: 0,
  DESC: 1
};

/**
 * optional string field = 1;
 * @return {string}
 */
proto.messages.SortBy.prototype.getField = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.SortBy} returns this
 */
proto.messages.SortBy.prototype.setField = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional Order order = 2;
 * @return {!proto.messages.SortBy.Order}
 */
proto.messages.SortBy.prototype.getOrder = function() {
  return /** @type {!proto.messages.SortBy.Order} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.messages.SortBy.Order} value
 * @return {!proto.messages.SortBy} returns this
 */
proto.messages.SortBy.prototype.setOrder = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.MessageFilters.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.MessageFilters.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.MessageFilters} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MessageFilters.toObject = function(includeInstance, msg) {
  var f, obj = {
    jid: (f = msg.getJid()) && proto.messages.OptionalString.toObject(includeInstance, f),
    timestampgte: (f = msg.getTimestampgte()) && proto.messages.OptionalUInt64.toObject(includeInstance, f),
    timestamplte: (f = msg.getTimestamplte()) && proto.messages.OptionalUInt64.toObject(includeInstance, f),
    fromme: (f = msg.getFromme()) && proto.messages.OptionalBool.toObject(includeInstance, f),
    status: (f = msg.getStatus()) && proto.messages.OptionalUInt32.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.MessageFilters}
 */
proto.messages.MessageFilters.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.MessageFilters;
  return proto.messages.MessageFilters.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.MessageFilters} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.MessageFilters}
 */
proto.messages.MessageFilters.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.OptionalString;
      reader.readMessage(value,proto.messages.OptionalString.deserializeBinaryFromReader);
      msg.setJid(value);
      break;
    case 2:
      var value = new proto.messages.OptionalUInt64;
      reader.readMessage(value,proto.messages.OptionalUInt64.deserializeBinaryFromReader);
      msg.setTimestampgte(value);
      break;
    case 3:
      var value = new proto.messages.OptionalUInt64;
      reader.readMessage(value,proto.messages.OptionalUInt64.deserializeBinaryFromReader);
      msg.setTimestamplte(value);
      break;
    case 4:
      var value = new proto.messages.OptionalBool;
      reader.readMessage(value,proto.messages.OptionalBool.deserializeBinaryFromReader);
      msg.setFromme(value);
      break;
    case 5:
      var value = new proto.messages.OptionalUInt32;
      reader.readMessage(value,proto.messages.OptionalUInt32.deserializeBinaryFromReader);
      msg.setStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.MessageFilters.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.MessageFilters.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.MessageFilters} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.MessageFilters.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getJid();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.OptionalString.serializeBinaryToWriter
    );
  }
  f = message.getTimestampgte();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.OptionalUInt64.serializeBinaryToWriter
    );
  }
  f = message.getTimestamplte();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.messages.OptionalUInt64.serializeBinaryToWriter
    );
  }
  f = message.getFromme();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.messages.OptionalBool.serializeBinaryToWriter
    );
  }
  f = message.getStatus();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.messages.OptionalUInt32.serializeBinaryToWriter
    );
  }
};


/**
 * optional OptionalString jid = 1;
 * @return {?proto.messages.OptionalString}
 */
proto.messages.MessageFilters.prototype.getJid = function() {
  return /** @type{?proto.messages.OptionalString} */ (
    jspb.Message.getWrapperField(this, proto.messages.OptionalString, 1));
};


/**
 * @param {?proto.messages.OptionalString|undefined} value
 * @return {!proto.messages.MessageFilters} returns this
*/
proto.messages.MessageFilters.prototype.setJid = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageFilters} returns this
 */
proto.messages.MessageFilters.prototype.clearJid = function() {
  return this.setJid(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageFilters.prototype.hasJid = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional OptionalUInt64 timestampGte = 2;
 * @return {?proto.messages.OptionalUInt64}
 */
proto.messages.MessageFilters.prototype.getTimestampgte = function() {
  return /** @type{?proto.messages.OptionalUInt64} */ (
    jspb.Message.getWrapperField(this, proto.messages.OptionalUInt64, 2));
};


/**
 * @param {?proto.messages.OptionalUInt64|undefined} value
 * @return {!proto.messages.MessageFilters} returns this
*/
proto.messages.MessageFilters.prototype.setTimestampgte = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageFilters} returns this
 */
proto.messages.MessageFilters.prototype.clearTimestampgte = function() {
  return this.setTimestampgte(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageFilters.prototype.hasTimestampgte = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional OptionalUInt64 timestampLte = 3;
 * @return {?proto.messages.OptionalUInt64}
 */
proto.messages.MessageFilters.prototype.getTimestamplte = function() {
  return /** @type{?proto.messages.OptionalUInt64} */ (
    jspb.Message.getWrapperField(this, proto.messages.OptionalUInt64, 3));
};


/**
 * @param {?proto.messages.OptionalUInt64|undefined} value
 * @return {!proto.messages.MessageFilters} returns this
*/
proto.messages.MessageFilters.prototype.setTimestamplte = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageFilters} returns this
 */
proto.messages.MessageFilters.prototype.clearTimestamplte = function() {
  return this.setTimestamplte(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageFilters.prototype.hasTimestamplte = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional OptionalBool fromMe = 4;
 * @return {?proto.messages.OptionalBool}
 */
proto.messages.MessageFilters.prototype.getFromme = function() {
  return /** @type{?proto.messages.OptionalBool} */ (
    jspb.Message.getWrapperField(this, proto.messages.OptionalBool, 4));
};


/**
 * @param {?proto.messages.OptionalBool|undefined} value
 * @return {!proto.messages.MessageFilters} returns this
*/
proto.messages.MessageFilters.prototype.setFromme = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageFilters} returns this
 */
proto.messages.MessageFilters.prototype.clearFromme = function() {
  return this.setFromme(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageFilters.prototype.hasFromme = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional OptionalUInt32 status = 5;
 * @return {?proto.messages.OptionalUInt32}
 */
proto.messages.MessageFilters.prototype.getStatus = function() {
  return /** @type{?proto.messages.OptionalUInt32} */ (
    jspb.Message.getWrapperField(this, proto.messages.OptionalUInt32, 5));
};


/**
 * @param {?proto.messages.OptionalUInt32|undefined} value
 * @return {!proto.messages.MessageFilters} returns this
*/
proto.messages.MessageFilters.prototype.setStatus = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.MessageFilters} returns this
 */
proto.messages.MessageFilters.prototype.clearStatus = function() {
  return this.setStatus(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.MessageFilters.prototype.hasStatus = function() {
  return jspb.Message.getField(this, 5) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.GetMessagesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.GetMessagesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.GetMessagesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetMessagesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    filters: (f = msg.getFilters()) && proto.messages.MessageFilters.toObject(includeInstance, f),
    pagination: (f = msg.getPagination()) && proto.messages.Pagination.toObject(includeInstance, f),
    sortby: (f = msg.getSortby()) && proto.messages.SortBy.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.GetMessagesRequest}
 */
proto.messages.GetMessagesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.GetMessagesRequest;
  return proto.messages.GetMessagesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.GetMessagesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.GetMessagesRequest}
 */
proto.messages.GetMessagesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = new proto.messages.MessageFilters;
      reader.readMessage(value,proto.messages.MessageFilters.deserializeBinaryFromReader);
      msg.setFilters(value);
      break;
    case 3:
      var value = new proto.messages.Pagination;
      reader.readMessage(value,proto.messages.Pagination.deserializeBinaryFromReader);
      msg.setPagination(value);
      break;
    case 4:
      var value = new proto.messages.SortBy;
      reader.readMessage(value,proto.messages.SortBy.deserializeBinaryFromReader);
      msg.setSortby(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.GetMessagesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.GetMessagesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.GetMessagesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetMessagesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getFilters();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.MessageFilters.serializeBinaryToWriter
    );
  }
  f = message.getPagination();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.messages.Pagination.serializeBinaryToWriter
    );
  }
  f = message.getSortby();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.messages.SortBy.serializeBinaryToWriter
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.GetMessagesRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.GetMessagesRequest} returns this
*/
proto.messages.GetMessagesRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetMessagesRequest} returns this
 */
proto.messages.GetMessagesRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetMessagesRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional MessageFilters filters = 2;
 * @return {?proto.messages.MessageFilters}
 */
proto.messages.GetMessagesRequest.prototype.getFilters = function() {
  return /** @type{?proto.messages.MessageFilters} */ (
    jspb.Message.getWrapperField(this, proto.messages.MessageFilters, 2));
};


/**
 * @param {?proto.messages.MessageFilters|undefined} value
 * @return {!proto.messages.GetMessagesRequest} returns this
*/
proto.messages.GetMessagesRequest.prototype.setFilters = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetMessagesRequest} returns this
 */
proto.messages.GetMessagesRequest.prototype.clearFilters = function() {
  return this.setFilters(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetMessagesRequest.prototype.hasFilters = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional Pagination pagination = 3;
 * @return {?proto.messages.Pagination}
 */
proto.messages.GetMessagesRequest.prototype.getPagination = function() {
  return /** @type{?proto.messages.Pagination} */ (
    jspb.Message.getWrapperField(this, proto.messages.Pagination, 3));
};


/**
 * @param {?proto.messages.Pagination|undefined} value
 * @return {!proto.messages.GetMessagesRequest} returns this
*/
proto.messages.GetMessagesRequest.prototype.setPagination = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetMessagesRequest} returns this
 */
proto.messages.GetMessagesRequest.prototype.clearPagination = function() {
  return this.setPagination(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetMessagesRequest.prototype.hasPagination = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional SortBy sortBy = 4;
 * @return {?proto.messages.SortBy}
 */
proto.messages.GetMessagesRequest.prototype.getSortby = function() {
  return /** @type{?proto.messages.SortBy} */ (
    jspb.Message.getWrapperField(this, proto.messages.SortBy, 4));
};


/**
 * @param {?proto.messages.SortBy|undefined} value
 * @return {!proto.messages.GetMessagesRequest} returns this
*/
proto.messages.GetMessagesRequest.prototype.setSortby = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetMessagesRequest} returns this
 */
proto.messages.GetMessagesRequest.prototype.clearSortby = function() {
  return this.setSortby(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetMessagesRequest.prototype.hasSortby = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.UpdateContactRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.UpdateContactRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.UpdateContactRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.UpdateContactRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    firstname: jspb.Message.getFieldWithDefault(msg, 3, ""),
    lastname: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.UpdateContactRequest}
 */
proto.messages.UpdateContactRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.UpdateContactRequest;
  return proto.messages.UpdateContactRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.UpdateContactRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.UpdateContactRequest}
 */
proto.messages.UpdateContactRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setFirstname(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setLastname(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.UpdateContactRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.UpdateContactRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.UpdateContactRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.UpdateContactRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getFirstname();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getLastname();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.UpdateContactRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.UpdateContactRequest} returns this
*/
proto.messages.UpdateContactRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.UpdateContactRequest} returns this
 */
proto.messages.UpdateContactRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.UpdateContactRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.UpdateContactRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.UpdateContactRequest} returns this
 */
proto.messages.UpdateContactRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string firstName = 3;
 * @return {string}
 */
proto.messages.UpdateContactRequest.prototype.getFirstname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.UpdateContactRequest} returns this
 */
proto.messages.UpdateContactRequest.prototype.setFirstname = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string lastName = 4;
 * @return {string}
 */
proto.messages.UpdateContactRequest.prototype.getLastname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.UpdateContactRequest} returns this
 */
proto.messages.UpdateContactRequest.prototype.setLastname = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.GetContactsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.GetContactsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.GetContactsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetContactsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    sortby: (f = msg.getSortby()) && proto.messages.SortBy.toObject(includeInstance, f),
    pagination: (f = msg.getPagination()) && proto.messages.Pagination.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.GetContactsRequest}
 */
proto.messages.GetContactsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.GetContactsRequest;
  return proto.messages.GetContactsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.GetContactsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.GetContactsRequest}
 */
proto.messages.GetContactsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = new proto.messages.SortBy;
      reader.readMessage(value,proto.messages.SortBy.deserializeBinaryFromReader);
      msg.setSortby(value);
      break;
    case 3:
      var value = new proto.messages.Pagination;
      reader.readMessage(value,proto.messages.Pagination.deserializeBinaryFromReader);
      msg.setPagination(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.GetContactsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.GetContactsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.GetContactsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetContactsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getSortby();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.SortBy.serializeBinaryToWriter
    );
  }
  f = message.getPagination();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.messages.Pagination.serializeBinaryToWriter
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.GetContactsRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.GetContactsRequest} returns this
*/
proto.messages.GetContactsRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetContactsRequest} returns this
 */
proto.messages.GetContactsRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetContactsRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional SortBy sortBy = 2;
 * @return {?proto.messages.SortBy}
 */
proto.messages.GetContactsRequest.prototype.getSortby = function() {
  return /** @type{?proto.messages.SortBy} */ (
    jspb.Message.getWrapperField(this, proto.messages.SortBy, 2));
};


/**
 * @param {?proto.messages.SortBy|undefined} value
 * @return {!proto.messages.GetContactsRequest} returns this
*/
proto.messages.GetContactsRequest.prototype.setSortby = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetContactsRequest} returns this
 */
proto.messages.GetContactsRequest.prototype.clearSortby = function() {
  return this.setSortby(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetContactsRequest.prototype.hasSortby = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional Pagination pagination = 3;
 * @return {?proto.messages.Pagination}
 */
proto.messages.GetContactsRequest.prototype.getPagination = function() {
  return /** @type{?proto.messages.Pagination} */ (
    jspb.Message.getWrapperField(this, proto.messages.Pagination, 3));
};


/**
 * @param {?proto.messages.Pagination|undefined} value
 * @return {!proto.messages.GetContactsRequest} returns this
*/
proto.messages.GetContactsRequest.prototype.setPagination = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetContactsRequest} returns this
 */
proto.messages.GetContactsRequest.prototype.clearPagination = function() {
  return this.setPagination(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetContactsRequest.prototype.hasPagination = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.ChatFilter.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ChatFilter.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ChatFilter.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ChatFilter} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ChatFilter.toObject = function(includeInstance, msg) {
  var f, obj = {
    jidsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ChatFilter}
 */
proto.messages.ChatFilter.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ChatFilter;
  return proto.messages.ChatFilter.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ChatFilter} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ChatFilter}
 */
proto.messages.ChatFilter.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addJids(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ChatFilter.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ChatFilter.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ChatFilter} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ChatFilter.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getJidsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
};


/**
 * repeated string jids = 1;
 * @return {!Array<string>}
 */
proto.messages.ChatFilter.prototype.getJidsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.ChatFilter} returns this
 */
proto.messages.ChatFilter.prototype.setJidsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.ChatFilter} returns this
 */
proto.messages.ChatFilter.prototype.addJids = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.ChatFilter} returns this
 */
proto.messages.ChatFilter.prototype.clearJidsList = function() {
  return this.setJidsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.GetChatsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.GetChatsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.GetChatsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetChatsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    sortby: (f = msg.getSortby()) && proto.messages.SortBy.toObject(includeInstance, f),
    pagination: (f = msg.getPagination()) && proto.messages.Pagination.toObject(includeInstance, f),
    filter: (f = msg.getFilter()) && proto.messages.ChatFilter.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.GetChatsRequest}
 */
proto.messages.GetChatsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.GetChatsRequest;
  return proto.messages.GetChatsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.GetChatsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.GetChatsRequest}
 */
proto.messages.GetChatsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = new proto.messages.SortBy;
      reader.readMessage(value,proto.messages.SortBy.deserializeBinaryFromReader);
      msg.setSortby(value);
      break;
    case 3:
      var value = new proto.messages.Pagination;
      reader.readMessage(value,proto.messages.Pagination.deserializeBinaryFromReader);
      msg.setPagination(value);
      break;
    case 4:
      var value = new proto.messages.ChatFilter;
      reader.readMessage(value,proto.messages.ChatFilter.deserializeBinaryFromReader);
      msg.setFilter(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.GetChatsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.GetChatsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.GetChatsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetChatsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getSortby();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.SortBy.serializeBinaryToWriter
    );
  }
  f = message.getPagination();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.messages.Pagination.serializeBinaryToWriter
    );
  }
  f = message.getFilter();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.messages.ChatFilter.serializeBinaryToWriter
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.GetChatsRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.GetChatsRequest} returns this
*/
proto.messages.GetChatsRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetChatsRequest} returns this
 */
proto.messages.GetChatsRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetChatsRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional SortBy sortBy = 2;
 * @return {?proto.messages.SortBy}
 */
proto.messages.GetChatsRequest.prototype.getSortby = function() {
  return /** @type{?proto.messages.SortBy} */ (
    jspb.Message.getWrapperField(this, proto.messages.SortBy, 2));
};


/**
 * @param {?proto.messages.SortBy|undefined} value
 * @return {!proto.messages.GetChatsRequest} returns this
*/
proto.messages.GetChatsRequest.prototype.setSortby = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetChatsRequest} returns this
 */
proto.messages.GetChatsRequest.prototype.clearSortby = function() {
  return this.setSortby(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetChatsRequest.prototype.hasSortby = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional Pagination pagination = 3;
 * @return {?proto.messages.Pagination}
 */
proto.messages.GetChatsRequest.prototype.getPagination = function() {
  return /** @type{?proto.messages.Pagination} */ (
    jspb.Message.getWrapperField(this, proto.messages.Pagination, 3));
};


/**
 * @param {?proto.messages.Pagination|undefined} value
 * @return {!proto.messages.GetChatsRequest} returns this
*/
proto.messages.GetChatsRequest.prototype.setPagination = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetChatsRequest} returns this
 */
proto.messages.GetChatsRequest.prototype.clearPagination = function() {
  return this.setPagination(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetChatsRequest.prototype.hasPagination = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional ChatFilter filter = 4;
 * @return {?proto.messages.ChatFilter}
 */
proto.messages.GetChatsRequest.prototype.getFilter = function() {
  return /** @type{?proto.messages.ChatFilter} */ (
    jspb.Message.getWrapperField(this, proto.messages.ChatFilter, 4));
};


/**
 * @param {?proto.messages.ChatFilter|undefined} value
 * @return {!proto.messages.GetChatsRequest} returns this
*/
proto.messages.GetChatsRequest.prototype.setFilter = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetChatsRequest} returns this
 */
proto.messages.GetChatsRequest.prototype.clearFilter = function() {
  return this.setFilter(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetChatsRequest.prototype.hasFilter = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.GetLabelsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.GetLabelsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.GetLabelsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetLabelsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.GetLabelsRequest}
 */
proto.messages.GetLabelsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.GetLabelsRequest;
  return proto.messages.GetLabelsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.GetLabelsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.GetLabelsRequest}
 */
proto.messages.GetLabelsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.GetLabelsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.GetLabelsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.GetLabelsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetLabelsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.GetLabelsRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.GetLabelsRequest} returns this
*/
proto.messages.GetLabelsRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetLabelsRequest} returns this
 */
proto.messages.GetLabelsRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetLabelsRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.Label.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.Label.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.Label} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Label.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    color: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.Label}
 */
proto.messages.Label.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.Label;
  return proto.messages.Label.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.Label} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.Label}
 */
proto.messages.Label.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setColor(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.Label.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.Label.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.Label} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.Label.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getColor();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.messages.Label.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Label} returns this
 */
proto.messages.Label.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.messages.Label.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.Label} returns this
 */
proto.messages.Label.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int32 color = 4;
 * @return {number}
 */
proto.messages.Label.prototype.getColor = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.Label} returns this
 */
proto.messages.Label.prototype.setColor = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.UpsertLabelRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.UpsertLabelRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.UpsertLabelRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.UpsertLabelRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    label: (f = msg.getLabel()) && proto.messages.Label.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.UpsertLabelRequest}
 */
proto.messages.UpsertLabelRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.UpsertLabelRequest;
  return proto.messages.UpsertLabelRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.UpsertLabelRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.UpsertLabelRequest}
 */
proto.messages.UpsertLabelRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = new proto.messages.Label;
      reader.readMessage(value,proto.messages.Label.deserializeBinaryFromReader);
      msg.setLabel(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.UpsertLabelRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.UpsertLabelRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.UpsertLabelRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.UpsertLabelRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getLabel();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.Label.serializeBinaryToWriter
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.UpsertLabelRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.UpsertLabelRequest} returns this
*/
proto.messages.UpsertLabelRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.UpsertLabelRequest} returns this
 */
proto.messages.UpsertLabelRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.UpsertLabelRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Label label = 2;
 * @return {?proto.messages.Label}
 */
proto.messages.UpsertLabelRequest.prototype.getLabel = function() {
  return /** @type{?proto.messages.Label} */ (
    jspb.Message.getWrapperField(this, proto.messages.Label, 2));
};


/**
 * @param {?proto.messages.Label|undefined} value
 * @return {!proto.messages.UpsertLabelRequest} returns this
*/
proto.messages.UpsertLabelRequest.prototype.setLabel = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.UpsertLabelRequest} returns this
 */
proto.messages.UpsertLabelRequest.prototype.clearLabel = function() {
  return this.setLabel(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.UpsertLabelRequest.prototype.hasLabel = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.DeleteLabelRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.DeleteLabelRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.DeleteLabelRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.DeleteLabelRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    label: (f = msg.getLabel()) && proto.messages.Label.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.DeleteLabelRequest}
 */
proto.messages.DeleteLabelRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.DeleteLabelRequest;
  return proto.messages.DeleteLabelRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.DeleteLabelRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.DeleteLabelRequest}
 */
proto.messages.DeleteLabelRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = new proto.messages.Label;
      reader.readMessage(value,proto.messages.Label.deserializeBinaryFromReader);
      msg.setLabel(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.DeleteLabelRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.DeleteLabelRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.DeleteLabelRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.DeleteLabelRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getLabel();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.messages.Label.serializeBinaryToWriter
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.DeleteLabelRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.DeleteLabelRequest} returns this
*/
proto.messages.DeleteLabelRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.DeleteLabelRequest} returns this
 */
proto.messages.DeleteLabelRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.DeleteLabelRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Label label = 2;
 * @return {?proto.messages.Label}
 */
proto.messages.DeleteLabelRequest.prototype.getLabel = function() {
  return /** @type{?proto.messages.Label} */ (
    jspb.Message.getWrapperField(this, proto.messages.Label, 2));
};


/**
 * @param {?proto.messages.Label|undefined} value
 * @return {!proto.messages.DeleteLabelRequest} returns this
*/
proto.messages.DeleteLabelRequest.prototype.setLabel = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.DeleteLabelRequest} returns this
 */
proto.messages.DeleteLabelRequest.prototype.clearLabel = function() {
  return this.setLabel(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.DeleteLabelRequest.prototype.hasLabel = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.ChatLabelRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.ChatLabelRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.ChatLabelRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ChatLabelRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    chatid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    labelid: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.ChatLabelRequest}
 */
proto.messages.ChatLabelRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.ChatLabelRequest;
  return proto.messages.ChatLabelRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.ChatLabelRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.ChatLabelRequest}
 */
proto.messages.ChatLabelRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setChatid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setLabelid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.ChatLabelRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.ChatLabelRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.ChatLabelRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.ChatLabelRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getChatid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLabelid();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.ChatLabelRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.ChatLabelRequest} returns this
*/
proto.messages.ChatLabelRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.ChatLabelRequest} returns this
 */
proto.messages.ChatLabelRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.ChatLabelRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string chatId = 2;
 * @return {string}
 */
proto.messages.ChatLabelRequest.prototype.getChatid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ChatLabelRequest} returns this
 */
proto.messages.ChatLabelRequest.prototype.setChatid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string labelId = 3;
 * @return {string}
 */
proto.messages.ChatLabelRequest.prototype.getLabelid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.ChatLabelRequest} returns this
 */
proto.messages.ChatLabelRequest.prototype.setLabelid = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.CancelEventMessageRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.CancelEventMessageRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.CancelEventMessageRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CancelEventMessageRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    jid: jspb.Message.getFieldWithDefault(msg, 2, ""),
    messageid: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.CancelEventMessageRequest}
 */
proto.messages.CancelEventMessageRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.CancelEventMessageRequest;
  return proto.messages.CancelEventMessageRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.CancelEventMessageRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.CancelEventMessageRequest}
 */
proto.messages.CancelEventMessageRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setJid(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessageid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.CancelEventMessageRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.CancelEventMessageRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.CancelEventMessageRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.CancelEventMessageRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getJid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMessageid();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.CancelEventMessageRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.CancelEventMessageRequest} returns this
*/
proto.messages.CancelEventMessageRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.CancelEventMessageRequest} returns this
 */
proto.messages.CancelEventMessageRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.CancelEventMessageRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string jid = 2;
 * @return {string}
 */
proto.messages.CancelEventMessageRequest.prototype.getJid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.CancelEventMessageRequest} returns this
 */
proto.messages.CancelEventMessageRequest.prototype.setJid = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string messageId = 4;
 * @return {string}
 */
proto.messages.CancelEventMessageRequest.prototype.getMessageid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.CancelEventMessageRequest} returns this
 */
proto.messages.CancelEventMessageRequest.prototype.setMessageid = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.GetLidsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.GetLidsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.GetLidsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetLidsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.GetLidsRequest}
 */
proto.messages.GetLidsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.GetLidsRequest;
  return proto.messages.GetLidsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.GetLidsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.GetLidsRequest}
 */
proto.messages.GetLidsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.GetLidsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.GetLidsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.GetLidsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.GetLidsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.GetLidsRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.GetLidsRequest} returns this
*/
proto.messages.GetLidsRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.GetLidsRequest} returns this
 */
proto.messages.GetLidsRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.GetLidsRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.RejectCallRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.RejectCallRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.RejectCallRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.RejectCallRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    session: (f = msg.getSession()) && proto.messages.Session.toObject(includeInstance, f),
    from: jspb.Message.getFieldWithDefault(msg, 2, ""),
    id: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.RejectCallRequest}
 */
proto.messages.RejectCallRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.RejectCallRequest;
  return proto.messages.RejectCallRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.RejectCallRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.RejectCallRequest}
 */
proto.messages.RejectCallRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.messages.Session;
      reader.readMessage(value,proto.messages.Session.deserializeBinaryFromReader);
      msg.setSession(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setFrom(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.RejectCallRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.RejectCallRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.RejectCallRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.RejectCallRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSession();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.messages.Session.serializeBinaryToWriter
    );
  }
  f = message.getFrom();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional Session session = 1;
 * @return {?proto.messages.Session}
 */
proto.messages.RejectCallRequest.prototype.getSession = function() {
  return /** @type{?proto.messages.Session} */ (
    jspb.Message.getWrapperField(this, proto.messages.Session, 1));
};


/**
 * @param {?proto.messages.Session|undefined} value
 * @return {!proto.messages.RejectCallRequest} returns this
*/
proto.messages.RejectCallRequest.prototype.setSession = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.messages.RejectCallRequest} returns this
 */
proto.messages.RejectCallRequest.prototype.clearSession = function() {
  return this.setSession(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.RejectCallRequest.prototype.hasSession = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string from = 2;
 * @return {string}
 */
proto.messages.RejectCallRequest.prototype.getFrom = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.RejectCallRequest} returns this
 */
proto.messages.RejectCallRequest.prototype.setFrom = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string id = 3;
 * @return {string}
 */
proto.messages.RejectCallRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.RejectCallRequest} returns this
 */
proto.messages.RejectCallRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.PollMessage.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.PollMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.PollMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.PollMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PollMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    optionsList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
    multipleanswers: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.PollMessage}
 */
proto.messages.PollMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.PollMessage;
  return proto.messages.PollMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.PollMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.PollMessage}
 */
proto.messages.PollMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addOptions(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setMultipleanswers(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.PollMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.PollMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.PollMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PollMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getOptionsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
  f = message.getMultipleanswers();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.messages.PollMessage.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.PollMessage} returns this
 */
proto.messages.PollMessage.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated string options = 2;
 * @return {!Array<string>}
 */
proto.messages.PollMessage.prototype.getOptionsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.PollMessage} returns this
 */
proto.messages.PollMessage.prototype.setOptionsList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.PollMessage} returns this
 */
proto.messages.PollMessage.prototype.addOptions = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.PollMessage} returns this
 */
proto.messages.PollMessage.prototype.clearOptionsList = function() {
  return this.setOptionsList([]);
};


/**
 * optional bool multipleAnswers = 3;
 * @return {boolean}
 */
proto.messages.PollMessage.prototype.getMultipleanswers = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.messages.PollMessage} returns this
 */
proto.messages.PollMessage.prototype.setMultipleanswers = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.messages.PollVoteMessage.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.messages.PollVoteMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.messages.PollVoteMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.messages.PollVoteMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PollVoteMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    pollmessageid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    pollserverid: jspb.Message.getFieldWithDefault(msg, 2, 0),
    optionsList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.messages.PollVoteMessage}
 */
proto.messages.PollVoteMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.messages.PollVoteMessage;
  return proto.messages.PollVoteMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.messages.PollVoteMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.messages.PollVoteMessage}
 */
proto.messages.PollVoteMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPollmessageid(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPollserverid(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addOptions(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.messages.PollVoteMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.messages.PollVoteMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.messages.PollVoteMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.messages.PollVoteMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPollmessageid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = message.getOptionsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
};


/**
 * optional string pollMessageId = 1;
 * @return {string}
 */
proto.messages.PollVoteMessage.prototype.getPollmessageid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.messages.PollVoteMessage} returns this
 */
proto.messages.PollVoteMessage.prototype.setPollmessageid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int64 pollServerId = 2;
 * @return {number}
 */
proto.messages.PollVoteMessage.prototype.getPollserverid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.messages.PollVoteMessage} returns this
 */
proto.messages.PollVoteMessage.prototype.setPollserverid = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.messages.PollVoteMessage} returns this
 */
proto.messages.PollVoteMessage.prototype.clearPollserverid = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.messages.PollVoteMessage.prototype.hasPollserverid = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * repeated string options = 3;
 * @return {!Array<string>}
 */
proto.messages.PollVoteMessage.prototype.getOptionsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.messages.PollVoteMessage} returns this
 */
proto.messages.PollVoteMessage.prototype.setOptionsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.messages.PollVoteMessage} returns this
 */
proto.messages.PollVoteMessage.prototype.addOptions = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.messages.PollVoteMessage} returns this
 */
proto.messages.PollVoteMessage.prototype.clearOptionsList = function() {
  return this.setOptionsList([]);
};


/**
 * @enum {number}
 */
proto.messages.LogLevel = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4
};

/**
 * @enum {number}
 */
proto.messages.ParticipantAction = {
  ADD: 0,
  REMOVE: 1,
  PROMOTE: 2,
  DEMOTE: 3
};

/**
 * @enum {number}
 */
proto.messages.MediaType = {
  IMAGE: 0,
  AUDIO: 1,
  VIDEO: 2,
  DOCUMENT: 3,
  PTV: 4
};

/**
 * @enum {number}
 */
proto.messages.Presence = {
  AVAILABLE: 0,
  UNAVAILABLE: 1
};

/**
 * @enum {number}
 */
proto.messages.ChatPresence = {
  TYPING: 0,
  RECORDING: 1,
  PAUSED: 2
};

/**
 * @enum {number}
 */
proto.messages.ReceiptType = {
  READ: 0,
  PLAYED: 1
};

goog.object.extend(exports, proto.messages);
