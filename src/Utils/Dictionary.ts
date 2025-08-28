export class Dictionary {

  items: object;

  constructor() {
    this.items = {};
  }

  get count(): number {
    return Object.keys(this.items).length;
  }

  has(key: any): boolean {
    return this.items.hasOwnProperty(key);
  }

  set(key: any, val: any) {
    this.items[key] = val;
  }

  delete(key: any): boolean {
    if (this.has(key)) {
      delete this.items[key];
    }
    return false;
  }

  get(key: any): any {
    return this.has(key) ? this.items[key] : undefined;
  }

  clear() {
    this.items = {};
  }

  values(): any[] {
    let values: any[] = [];
    for (let k in this.items) {
      if (this.has(k)) {
        values.push(this.items[k]);
      }
    }
    return values;
  }

  forEach(fun) {
    for (let k in this.items) {
      fun(k, this.items[k]);
    }
  }
}