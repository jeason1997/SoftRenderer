export class Dictionary {
  // 关键修复：添加索引签名 { [key: string]: any }，允许用 string 类型索引
  items: { [key: string]: any } = {}; // 直接初始化，避免“未赋值”隐患

  constructor() {
    // 无需重复赋值，已在声明时初始化
  }

  get count(): number {
    return Object.keys(this.items).length;
  }

  // 键类型统一为 string（更符合对象索引的实际场景）
  has(key: string): boolean {
    // 推荐用 Object.prototype.hasOwnProperty，避免原型链污染
    return Object.prototype.hasOwnProperty.call(this.items, key);
  }

  set(key: string, val: any): void {
    this.items[key] = val; // 现在 TS 能识别 key 是合法索引
  }

  // 修复逻辑：删除成功返回 true
  delete(key: string): boolean {
    if (this.has(key)) {
      delete this.items[key];
      return true; // 关键修正：删除成功返回 true
    }
    return false;
  }

  get(key: string): any {
    return this.has(key) ? this.items[key] : undefined;
  }

  clear(): void {
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

  // 关键修复：定义 fun 的类型（key 为 string，val 为 any）
  forEach(fun: (key: string, value: any) => void): void {
    for (let k in this.items) {
      if (this.has(k)) {
        fun(k, this.items[k]);
      }
    }
  }
}