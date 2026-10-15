//#region src/removable.d.ts
declare abstract class Removable {
  #private;
  gcTime: number;
  destroy(): void;
  protected scheduleGc(): void;
  protected updateGcTime(newGcTime: number | undefined): void;
  protected clearGcTimeout(): void;
  protected abstract optionalRemove(): void;
}
//#endregion
export { Removable as t };
//# sourceMappingURL=removable-DeMjhW5M.d.ts.map