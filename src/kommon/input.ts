export const enum MouseButton {
    Left = 1,
    Right = 2,
    Middle = 4,
};

// Taken from https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
export const enum KeyCode {
    Escape = "Escape",
    Digit1 = "Digit1",
    Digit2 = "Digit2",
    Digit3 = "Digit3",
    Digit4 = "Digit4",
    Digit5 = "Digit5",
    Digit6 = "Digit6",
    Digit7 = "Digit7",
    Digit8 = "Digit8",
    Digit9 = "Digit9",
    Digit0 = "Digit0",
    Minus = "Minus",
    Equal = "Equal",
    Backspace = "Backspace",
    Tab = "Tab",
    KeyQ = "KeyQ",
    KeyW = "KeyW",
    KeyE = "KeyE",
    KeyR = "KeyR",
    KeyT = "KeyT",
    KeyY = "KeyY",
    KeyU = "KeyU",
    KeyI = "KeyI",
    KeyO = "KeyO",
    KeyP = "KeyP",
    BracketLeft = "BracketLeft",
    BracketRight = "BracketRight",
    Enter = "Enter",
    ControlLeft = "ControlLeft",
    KeyA = "KeyA",
    KeyS = "KeyS",
    KeyD = "KeyD",
    KeyF = "KeyF",
    KeyG = "KeyG",
    KeyH = "KeyH",
    KeyJ = "KeyJ",
    KeyK = "KeyK",
    KeyL = "KeyL",
    Semicolon = "Semicolon",
    Quote = "Quote",
    Backquote = "Backquote",
    ShiftLeft = "ShiftLeft",
    Backslash = "Backslash",
    KeyZ = "KeyZ",
    KeyX = "KeyX",
    KeyC = "KeyC",
    KeyV = "KeyV",
    KeyB = "KeyB",
    KeyN = "KeyN",
    KeyM = "KeyM",
    Comma = "Comma",
    Period = "Period",
    Slash = "Slash",
    ShiftRight = "ShiftRight",
    NumpadMultiply = "NumpadMultiply",
    AltLeft = "AltLeft",
    Space = "Space",
    CapsLock = "CapsLock",
    F1 = "F1",
    F2 = "F2",
    F3 = "F3",
    F4 = "F4",
    F5 = "F5",
    F6 = "F6",
    F7 = "F7",
    F8 = "F8",
    F9 = "F9",
    F10 = "F10",
    Pause = "Pause",
    ScrollLock = "ScrollLock",
    Numpad7 = "Numpad7",
    Numpad8 = "Numpad8",
    Numpad9 = "Numpad9",
    NumpadSubtract = "NumpadSubtract",
    Numpad4 = "Numpad4",
    Numpad5 = "Numpad5",
    Numpad6 = "Numpad6",
    NumpadAdd = "NumpadAdd",
    Numpad1 = "Numpad1",
    Numpad2 = "Numpad2",
    Numpad3 = "Numpad3",
    Numpad0 = "Numpad0",
    NumpadDecimal = "NumpadDecimal",
    PrintScreen = "PrintScreen",
    IntlBackslash = "IntlBackslash",
    F11 = "F11",
    F12 = "F12",
    NumpadEqual = "NumpadEqual",
    F13 = "F13",
    F14 = "F14",
    F15 = "F15",
    F16 = "F16",
    F17 = "F17",
    F18 = "F18",
    F19 = "F19",
    F20 = "F20",
    F21 = "F21",
    F22 = "F22",
    F23 = "F23",
    KanaMode = "KanaMode",
    Lang2 = "Lang2",
    Lang1 = "Lang1",
    IntlRo = "IntlRo",
    F24 = "F24",
    Convert = "Convert",
    NonConvert = "NonConvert",
    IntlYen = "IntlYen",
    NumpadComma = "NumpadComma",
    MediaTrackPrevious = "MediaTrackPrevious",
    MediaTrackNext = "MediaTrackNext",
    NumpadEnter = "NumpadEnter",
    ControlRight = "ControlRight",
    AudioVolumeMute = "AudioVolumeMute",
    LaunchApp2 = "LaunchApp2",
    MediaPlayPause = "MediaPlayPause",
    MediaStop = "MediaStop",
    VolumeDown = "VolumeDown",
    VolumeUp = "VolumeUp",
    BrowserHome = "BrowserHome",
    NumpadDivide = "NumpadDivide",
    AltRight = "AltRight",
    NumLock = "NumLock",
    Home = "Home",
    ArrowUp = "ArrowUp",
    PageUp = "PageUp",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",
    End = "End",
    ArrowDown = "ArrowDown",
    PageDown = "PageDown",
    Insert = "Insert",
    Delete = "Delete",
    MetaLeft = "MetaLeft",
    MetaRight = "MetaRight",
    ContextMenu = "ContextMenu",
    Power = "Power",
    BrowserSearch = "BrowserSearch",
    BrowserFavorites = "BrowserFavorites",
    BrowserRefresh = "BrowserRefresh",
    BrowserStop = "BrowserStop",
    BrowserForward = "BrowserForward",
    BrowserBack = "BrowserBack",
    LaunchApp1 = "LaunchApp1",
    LaunchMail = "LaunchMail",
    MediaSelect = "MediaSelect",
};

// Another option:
// export type KeyCode = "Escape" | "Digit1" | "Digit2" | "Digit3" | "Digit4" | "Digit5" | "Digit6" | "Digit7" | "Digit8" | "Digit9" | "Digit0" | "Minus" | "Equal" | "Backspace" | "Tab" | "KeyQ" | "KeyW" | "KeyE" | "KeyR" | "KeyT" | "KeyY" | "KeyU" | "KeyI" | "KeyO" | "KeyP" | "BracketLeft" | "BracketRight" | "Enter" | "ControlLeft" | "KeyA" | "KeyS" | "KeyD" | "KeyF" | "KeyG" | "KeyH" | "KeyJ" | "KeyK" | "KeyL" | "Semicolon" | "Quote" | "Backquote" | "ShiftLeft" | "Backslash" | "KeyZ" | "KeyX" | "KeyC" | "KeyV" | "KeyB" | "KeyN" | "KeyM" | "Comma" | "Period" | "Slash" | "ShiftRight" | "NumpadMultiply" | "AltLeft" | "Space" | "CapsLock" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "Pause" | "ScrollLock" | "Numpad7" | "Numpad8" | "Numpad9" | "NumpadSubtract" | "Numpad4" | "Numpad5" | "Numpad6" | "NumpadAdd" | "Numpad1" | "Numpad2" | "Numpad3" | "Numpad0" | "NumpadDecimal" | "PrintScreen" | "IntlBackslash" | "F11" | "F12" | "NumpadEqual" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19" | "F20" | "F21" | "F22" | "F23" | "KanaMode" | "Lang2" | "Lang1" | "IntlRo" | "F24" | "Convert" | "NonConvert" | "IntlYen" | "NumpadComma" | "" | "" | "MediaTrackPrevious" | "" | "MediaTrackNext" | "NumpadEnter" | "ControlRight" | "AudioVolumeMute" | "LaunchApp2" | "MediaPlayPause" | "MediaStop" | "VolumeDown" | "VolumeUp" | "BrowserHome" | "NumpadDivide" | "PrintScreen" | "AltRight" | "NumLock" | "Pause" | "Home" | "ArrowUp" | "PageUp" | "ArrowLeft" | "ArrowRight" | "End" | "ArrowDown" | "PageDown" | "Insert" | "Delete" | "MetaLeft" | "MetaRight" | "ContextMenu" | "Power" | "BrowserSearch" | "BrowserFavorites" | "BrowserRefresh" | "BrowserStop" | "BrowserForward" | "BrowserBack" | "LaunchApp1" | "LaunchMail" | "MediaSelect" | "Lang2";

// Tracks the state of the mouse
export class MouseListener {
    public clientX: number = 0;
    public clientY: number = 0;
    public buttons: number = 0;
    public wheel: number = 0;
    events: { pointer: (ev: MouseEvent) => void; wheel: (ev: WheelEvent) => void; contextmenu: (ev: MouseEvent) => void; };

    constructor() {
        this.events = {
            pointer: this.onPointerEvent.bind(this),
            wheel: this.onWheelEvent.bind(this),
            contextmenu: (ev: MouseEvent) => ev.preventDefault(),
        }
        document.addEventListener("pointermove", this.events.pointer);
        document.addEventListener("pointerup", this.events.pointer);
        document.addEventListener("pointerdown", this.events.pointer);
        document.addEventListener("wheel", this.events.wheel);
        document.addEventListener("contextmenu", this.events.contextmenu);
    }

    dispose() {
        document.removeEventListener("pointermove", this.events.pointer);
        document.removeEventListener("pointerup", this.events.pointer);
        document.removeEventListener("pointerdown", this.events.pointer);
        document.removeEventListener("wheel", this.events.wheel);
        document.removeEventListener("contextmenu", this.events.contextmenu);
    }

    private onPointerEvent(ev: MouseEvent) {
        this.buttons = ev.buttons;
        this.clientX = ev.clientX;
        this.clientY = ev.clientY;
    }

    private onWheelEvent(ev: WheelEvent) {
        this.wheel = ev.deltaY;
    }
}

// Tracks the state of the keyboard
export class KeyboardListener {
    public pressed: Set<KeyCode> = new Set();
    events: { keydown: (ev: KeyboardEvent) => void; keyup: (ev: KeyboardEvent) => void; };

    constructor() {
        this.events = {
            keydown: this.onKeyDown.bind(this),
            keyup: this.onKeyUp.bind(this),
        }
        document.addEventListener("keydown", this.events.keydown);
        document.addEventListener("keyup", this.events.keyup);
    }

    dispose() {
        document.removeEventListener("keydown", this.events.keydown);
        document.removeEventListener("keyup", this.events.keyup);
    }

    private onKeyDown(ev: KeyboardEvent) {
        this.pressed.add(ev.code as KeyCode);
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(ev.code)) {
            ev.preventDefault();
            return false;
        }
    }

    private onKeyUp(ev: KeyboardEvent) {
        this.pressed.delete(ev.code as KeyCode);
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(ev.code)) {
            ev.preventDefault();
            return false;
        }
    }
}

// Presents the mouse state
export class Mouse {
    public clientX: number = 0;
    public clientY: number = 0;
    public buttons: number = 0;
    public wheel: number = 0;

    public prev_clientX: number = 0;
    public prev_clientY: number = 0;
    public prev_buttons: number = 0;

    constructor(
        private readonly mouse_listener: MouseListener = new MouseListener(),
    ) { }

    isDown(button: MouseButton): boolean {
        return Boolean(this.buttons & button);
    }

    wasPressed(button: MouseButton): boolean {
        return Boolean(this.buttons & button) && !Boolean(this.prev_buttons & button);
    }

    wasReleased(button: MouseButton): boolean {
        return !Boolean(this.buttons & button) && Boolean(this.prev_buttons & button);
    }

    startFrame() {
        this.prev_clientX = this.clientX;
        this.prev_clientY = this.clientY;
        this.prev_buttons = this.buttons;

        this.clientX = this.mouse_listener.clientX;
        this.clientY = this.mouse_listener.clientY;
        this.buttons = this.mouse_listener.buttons;

        this.wheel = this.mouse_listener.wheel;
        this.mouse_listener.wheel = 0;
    }

    dispose() {
        this.mouse_listener.dispose();
    }
}

// Presents the keyboard state
export class Keyboard {
    public pressed: Set<KeyCode> = new Set();
    public prev_pressed!: Set<KeyCode>;// = new Set();

    constructor(
        private readonly keyboard_listener: KeyboardListener = new KeyboardListener(),
    ) { }

    isDown(code: KeyCode): boolean {
        return this.pressed.has(code);
    }

    wasPressed(code: KeyCode): boolean {
        return this.pressed.has(code) && !this.prev_pressed.has(code);
    }

    wasReleased(code: KeyCode): boolean {
        return !this.pressed.has(code) && this.prev_pressed.has(code);
    }

    startFrame() {
        this.prev_pressed = this.pressed;
        this.pressed = new Set(this.keyboard_listener.pressed);
    }

    dispose() {
        this.keyboard_listener.dispose();
    }
}

// Presents mouse & keyboard states
export class Input {
    constructor(
        public readonly mouse: Mouse = new Mouse(),
        public readonly keyboard: Keyboard = new Keyboard(),
    ) { }

    startFrame() {
        this.mouse.startFrame();
        this.keyboard.startFrame();
    }
}
