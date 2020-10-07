declare namespace Survicate {
  function initialize(): void;
  function invokeEvent(eventName: string): void;
  function enterScreen(screenName: string): void;
  function leaveScreen(screenName: string): void;
  function setUserId(screenName: string): void;
  function setUserTrait(traitName: string, traitValue: string): void;
  function reset(): void;
}

export = Survicate;
