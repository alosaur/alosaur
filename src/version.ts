// From angular core https://github.com/angular/angular/blob/master/packages/core/src/version.ts

/**
 * @description Represents the version of Alosaur
**/
export class Version {
  public readonly major: string;
  public readonly minor: string;
  public readonly patch: string;

  constructor(public full: string) {
    this.major = full.split(".")[0];
    this.minor = full.split(".")[1];
    this.patch = full.split(".").slice(2).join(".");
  }
}

export const VERSION = new Version("0.28.0");
