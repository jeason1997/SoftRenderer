export class Input {
    // 键盘状态
    private static currentKeys: Map<string, boolean> = new Map<string, boolean>();
    private static previousKeys: Map<string, boolean> = new Map<string, boolean>();

    // 鼠标状态
    private static currentMouseButtons: boolean[] = [false, false, false]; // 左、中、右键
    private static previousMouseButtons: boolean[] = [false, false, false];
    public static mouseX: number = 0;
    public static mouseY: number = 0;
    public static deltaY: number = 0; // 鼠标滚轮

    // 触摸状态
    private static touches: Touch[] = [];

    // 按键常量
    public static readonly KeyCode = {
        // 字母键
        A: 'KeyA', B: 'KeyB', C: 'KeyC', D: 'KeyD', E: 'KeyE', F: 'KeyF', G: 'KeyG',
        H: 'KeyH', I: 'KeyI', J: 'KeyJ', K: 'KeyK', L: 'KeyL', M: 'KeyM', N: 'KeyN',
        O: 'KeyO', P: 'KeyP', Q: 'KeyQ', R: 'KeyR', S: 'KeyS', T: 'KeyT', U: 'KeyU',
        V: 'KeyV', W: 'KeyW', X: 'KeyX', Y: 'KeyY', Z: 'KeyZ',

        // 数字键
        Alpha0: 'Digit0', Alpha1: 'Digit1', Alpha2: 'Digit2', Alpha3: 'Digit3', Alpha4: 'Digit4',
        Alpha5: 'Digit5', Alpha6: 'Digit6', Alpha7: 'Digit7', Alpha8: 'Digit8', Alpha9: 'Digit9',

        // 功能键
        F1: 'F1', F2: 'F2', F3: 'F3', F4: 'F4', F5: 'F5', F6: 'F6',
        F7: 'F7', F8: 'F8', F9: 'F9', F10: 'F10', F11: 'F11', F12: 'F12',

        // 特殊键
        Space: 'Space',
        Enter: 'Enter',
        Tab: 'Tab',
        Escape: 'Escape',
        Backspace: 'Backspace',
        Shift: 'ShiftLeft',
        Control: 'ControlLeft',
        Alt: 'AltLeft',
        CapsLock: 'CapsLock',

        // 方向键
        UpArrow: 'ArrowUp',
        DownArrow: 'ArrowDown',
        LeftArrow: 'ArrowLeft',
        RightArrow: 'ArrowRight',
    };

    // 初始化输入系统
    public static initialize(): void {
        // 键盘事件
        document.addEventListener('keydown', (event) => {
            Input.currentKeys.set(event.code, true);
        });

        document.addEventListener('keyup', (event) => {
            Input.currentKeys.set(event.code, false);
        });

        // 鼠标事件
        document.addEventListener('mousedown', (event) => {
            if (event.button >= 0 && event.button < 3) {
                Input.currentMouseButtons[event.button] = true;
            }
        });

        document.addEventListener('mouseup', (event) => {
            if (event.button >= 0 && event.button < 3) {
                Input.currentMouseButtons[event.button] = false;
            }
        });

        document.addEventListener('mousemove', (event) => {
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();
            Input.mouseX = event.clientX - rect.left;
            Input.mouseY = event.clientY - rect.top;
        });

        document.addEventListener('wheel', (event) => {
            Input.deltaY = event.deltaY;
        });

        document.addEventListener('scrollend', () => {
            Input.deltaY = 0;
        });

        // 触摸事件
        document.addEventListener('touchstart', (event) => {
            Input.updateTouches(event.touches);
        });

        document.addEventListener('touchmove', (event) => {
            Input.updateTouches(event.touches);
        });

        document.addEventListener('touchend', (event) => {
            Input.updateTouches(event.touches);
        });

        document.addEventListener('touchcancel', (event) => {
            Input.updateTouches(event.touches);
        });
    }

    // 更新输入状态（在每帧开始时调用）
    public static update(): void {
        // 更新键盘状态
        Input.previousKeys = new Map(Input.currentKeys);

        // 更新鼠标状态
        Input.previousMouseButtons = [...Input.currentMouseButtons];
    }

    // 键盘输入检测

    // 检查按键是否被按下（持续触发）
    public static GetKey(keyCode: string): boolean {
        return Input.currentKeys.get(keyCode) === true;
    }

    // 检查按键是否在当前帧被按下（仅一帧触发）
    public static GetKeyDown(keyCode: string): boolean {
        return Input.currentKeys.get(keyCode) === true && Input.previousKeys.get(keyCode) !== true;
    }

    // 检查按键是否在当前帧被释放（仅一帧触发）
    public static GetKeyUp(keyCode: string): boolean {
        return Input.currentKeys.get(keyCode) !== true && Input.previousKeys.get(keyCode) === true;
    }

    // 鼠标输入检测

    // 检查鼠标按钮是否被按下（持续触发）
    public static GetMouseButton(button: number): boolean {
        return button >= 0 && button < 3 ? Input.currentMouseButtons[button] : false;
    }

    // 检查鼠标按钮是否在当前帧被按下（仅一帧触发）
    public static GetMouseButtonDown(button: number): boolean {
        return button >= 0 && button < 3 ?
            (Input.currentMouseButtons[button] && !Input.previousMouseButtons[button]) : false;
    }

    // 检查鼠标按钮是否在当前帧被释放（仅一帧触发）
    public static GetMouseButtonUp(button: number): boolean {
        return button >= 0 && button < 3 ?
            (!Input.currentMouseButtons[button] && Input.previousMouseButtons[button]) : false;
    }

    // 触摸输入检测

    // 更新触摸状态
    private static updateTouches(touchList: TouchList): void {
        Input.touches = [];
        for (let i = 0; i < touchList.length; i++) {
            const touch = touchList[i];
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();

            Input.touches.push({
                fingerId: touch.identifier,
                position: {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top
                },
                deltaPosition: { x: 0, y: 0 }, // 简化实现，实际应该跟踪前一帧位置
                phase: TouchPhase.Moved, // 简化实现
                tapCount: 1 // 简化实现
            });
        }
    }

    // 获取指定索引的触摸
    public static GetTouch(index: number): Touch | null {
        return index >= 0 && index < Input.touches.length ? Input.touches[index] : null;
    }

    // 获取触摸数量
    public static get touchCount(): number {
        return Input.touches.length;
    }
}

// 触摸阶段枚举
export enum TouchPhase {
    Began,
    Moved,
    Stationary,
    Ended,
    Canceled
}

// 触摸信息接口
export interface Touch {
    fingerId: number;
    position: { x: number, y: number };
    deltaPosition: { x: number, y: number };
    phase: TouchPhase;
    tapCount: number;
}