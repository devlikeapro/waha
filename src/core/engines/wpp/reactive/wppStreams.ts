import { Observable, share } from 'rxjs';
import { Whatsapp as WPPWhatsapp } from '@wppconnect-team/wppconnect';
import { fromWppCallback } from '@waha/core/engines/wpp/reactive/fromWppCallback';
import { EnginePayload } from '@waha/structures/webhooks.dto';

/**
 * One Observable per wppconnect on* listener method we subscribe to.
 * The compile-time guard below ensures every key exists on WPPWhatsapp:
 * if wppconnect removes a method TypeScript will error on that assertion.
 */
export interface WppStreams {
  onMessage: Observable<EnginePayload>;
  onAnyMessage: Observable<EnginePayload>;
  onAck: Observable<EnginePayload>;
  onMessageEdit: Observable<EnginePayload>;
  onNotificationMessage: Observable<EnginePayload>;
  onParticipantsChanged: Observable<EnginePayload>;
  onStateChange: Observable<EnginePayload>;
  onStreamChange: Observable<EnginePayload>;
  onIncomingCall: Observable<EnginePayload>;
  onInterfaceChange: Observable<EnginePayload>;
  onPresenceChanged: Observable<EnginePayload>;
  onLiveLocation: Observable<EnginePayload>;
  onAddedToGroup: Observable<EnginePayload>;
  onRevokedMessage: Observable<EnginePayload>;
  onReactionMessage: Observable<EnginePayload>;
  onPollResponse: Observable<EnginePayload>;
  onUpdateLabel: Observable<EnginePayload>;
  onOrderStatusUpdate: Observable<EnginePayload>;
}

// Compile-time guard: every key of WppStreams must be a real method on WPPWhatsapp.
// If wppconnect removes a listener method this line will produce a TypeScript error.
type _AssertWppStreams = keyof WppStreams extends keyof WPPWhatsapp
  ? true
  : never;
export const _assertWppStreams: _AssertWppStreams = true;
void _assertWppStreams;

/**
 * Builds a map of shared, lazy Observables — one per WPPConnect on* listener.
 *
 * Each Observable registers the underlying wppconnect callback only when
 * subscribed and disposes it on teardown.  Using direct method calls
 * (rather than a generic loop) lets IDEs resolve types and navigate to
 * wppconnect's own declarations.
 *
 * WppStreams is the exhaustiveness guard: if a field is missing here TypeScript
 * will report a missing-property error on the object literal.
 */
export function buildWppStreams(wpp: WPPWhatsapp): WppStreams {
  return {
    onMessage: fromWppCallback('onMessage', (cb) => wpp.onMessage(cb)).pipe(
      share(),
    ),

    onAnyMessage: fromWppCallback('onAnyMessage', (cb) =>
      wpp.onAnyMessage(cb),
    ).pipe(share()),

    onAck: fromWppCallback('onAck', (cb) => wpp.onAck(cb)).pipe(share()),

    onMessageEdit: fromWppCallback('onMessageEdit', (cb) =>
      wpp.onMessageEdit(cb),
    ).pipe(share()),

    onNotificationMessage: fromWppCallback('onNotificationMessage', (cb) =>
      wpp.onNotificationMessage(cb),
    ).pipe(share()),

    onParticipantsChanged: fromWppCallback('onParticipantsChanged', (cb) =>
      wpp.onParticipantsChanged(cb),
    ).pipe(share()),

    onStateChange: fromWppCallback('onStateChange', (cb) =>
      wpp.onStateChange(cb),
    ).pipe(share()),

    onStreamChange: fromWppCallback('onStreamChange', (cb) =>
      wpp.onStreamChange(cb),
    ).pipe(share()),

    onIncomingCall: fromWppCallback('onIncomingCall', (cb) =>
      wpp.onIncomingCall(cb),
    ).pipe(share()),

    onInterfaceChange: fromWppCallback('onInterfaceChange', (cb) =>
      wpp.onInterfaceChange(cb),
    ).pipe(share()),

    onPresenceChanged: fromWppCallback('onPresenceChanged', (cb) =>
      wpp.onPresenceChanged(cb),
    ).pipe(share()),

    onLiveLocation: fromWppCallback('onLiveLocation', (cb) =>
      wpp.onLiveLocation(cb),
    ).pipe(share()),

    onAddedToGroup: fromWppCallback('onAddedToGroup', (cb) =>
      wpp.onAddedToGroup(cb),
    ).pipe(share()),

    onRevokedMessage: fromWppCallback('onRevokedMessage', (cb) =>
      wpp.onRevokedMessage(cb),
    ).pipe(share()),

    onReactionMessage: fromWppCallback('onReactionMessage', (cb) =>
      wpp.onReactionMessage(cb),
    ).pipe(share()),

    onPollResponse: fromWppCallback('onPollResponse', (cb) =>
      wpp.onPollResponse(cb),
    ).pipe(share()),

    onUpdateLabel: fromWppCallback('onUpdateLabel', (cb) =>
      wpp.onUpdateLabel(cb),
    ).pipe(share()),

    onOrderStatusUpdate: fromWppCallback('onOrderStatusUpdate', (cb) =>
      wpp.onOrderStatusUpdate(cb),
    ).pipe(share()),
  };
}
