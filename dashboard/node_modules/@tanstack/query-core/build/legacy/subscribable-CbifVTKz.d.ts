//#region src/subscribable.d.ts
declare class Subscribable<TListener extends Function> {
  protected listeners: Set<TListener>;
  constructor();
  subscribe(listener: TListener): () => void;
  hasListeners(): boolean;
  protected onSubscribe(): void;
  protected onUnsubscribe(): void;
}
//#endregion
export { Subscribable as t };
//# sourceMappingURL=subscribable-CbifVTKz.d.ts.map