import { Overlay } from "../UiOverlay";
import { ConfigStorage } from "../Path";
import { getFallbackLayouts } from "./tools/ScreenBoardTools";
import {
  ScreenBoardCreateButtonRequest,
  ScreenBoardCreateIconButtonRequest,
  ScreenBoardCreateTextButtonRequest,
  ScreenBoardInitOptions,
  ScreenBoardRenderer
} from "./Interfaces";
import { CapsState } from "./Enums";
import { ZeppGroupInstance, ZeppWidget } from "../../zosx/ui/Types";
import {
  ZeppButtonWidgetOptions,
  ZeppFillRectWidgetOptions,
  ZeppImgWidgetOptions,
  ZeppTextWidgetOptions,
  ZeppWidgetPositionOptions
} from "../../zosx/ui/WidgetOptionTypes";
import { align, createWidget, event, prop, text_style, widget } from "../../zosx/ui";
import { DEVICE_SHAPE, SCREEN_HEIGHT, SCREEN_WIDTH } from "../UiProperties";
import { getScrollTop, scrollTo } from "../../zosx/page";
import { UiTheme } from "../UiCompositor";
import {
  SB_CONFIRM_BUTTON_HEIGHT,
  SB_DEFAULT_RENDERER,
  SB_FONT_DELTA,
  SB_ICON_SIZE,
  SB_ROW_HEIGHT,
  SB_VIEWPORT_HEIGHT
} from "./tools/ScreenBoardConstants";
import { ScreenBoardT9 } from "./renderer/ScreenBoardT9";
import { ScreenBoardT14 } from "./renderer/ScreenBoardT14";
import { ScreenBoardQWERTY } from "./renderer/ScreenBoardQWERTY";

export class ScreenBoard implements Overlay {
  public capsState: CapsState = CapsState.CAPS_OFF;

  private readonly config: ConfigStorage = new ConfigStorage("mzfw_sb");
  private readonly options: ScreenBoardInitOptions;
  private readonly layouts: string[];
  private readonly theme: UiTheme;
  private readonly renderer: ScreenBoardRenderer;
  private readonly group: ZeppWidget<ZeppWidgetPositionOptions, ZeppGroupInstance>;
  private readonly valueScreen: ZeppWidget<ZeppTextWidgetOptions, {}>;
  private readonly backspaceView?: ZeppWidget<ZeppImgWidgetOptions, {}>;
  private readonly confirmButton: ZeppWidget<ZeppButtonWidgetOptions, {}>;
  private titleValue: string = "Input";
  private displayValue: string = "";
  private activeLayout: string;
  private lastLayerY: number = 0;

  constructor(options: ScreenBoardInitOptions) {
    this.options = options;
    this.renderer = this.getRendererInstance();
    this.theme = options.theme ?? new UiTheme();

    this.layouts = options.forceLayouts ?? this.restoreLayouts();
    this.activeLayout = this.layouts[0];

    this.switchLayout = this.switchLayout.bind(this);
    this.toggleCaps = this.toggleCaps.bind(this);

    // Create native views now
    this.group = createWidget<ZeppWidgetPositionOptions, ZeppGroupInstance>(widget.GROUP, {
      x: 0,
      y: 0,
      w: SCREEN_WIDTH,
      h: SCREEN_HEIGHT,
    });
    this.group.createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: SCREEN_WIDTH,
      h: SCREEN_HEIGHT,
      color: 0x0,
    });

    let valueX = 0,
        valueW = SCREEN_WIDTH;
    if(DEVICE_SHAPE == "circle") {
      valueX = 64;
      valueW = SCREEN_WIDTH - valueX * 2;
    } else if(!this.renderer.hasBackspace) {
      valueW = SCREEN_WIDTH - 36;
    }

    this.valueScreen = this.group.createWidget(widget.TEXT, {
      x: valueX,
      y: 0,
      w: valueW,
      h: SB_VIEWPORT_HEIGHT - 8,
      align_v: align.BOTTOM,
      color: this.theme.TEXT_COLOR_2,
      text: this.titleValue,
      text_size: this.theme.FONT_SIZE + SB_FONT_DELTA,
      text_style: text_style.WRAP,
    });

    if(!this.renderer.hasBackspace) {
      this.backspaceView = this.group.createWidget(widget.IMG, {
        x: valueX + valueW,
        y: SB_VIEWPORT_HEIGHT - 48,
        w: 36,
        h: 48,
        pos_x: 12,
        pos_y: 12,
        src: `mzfw/${SB_ICON_SIZE}/backspace.png`,
      });
      this.backspaceView.addEventListener(event.CLICK_UP, this.doBackspace.bind(this));
    }

    this.confirmButton = this.group.createWidget<ZeppButtonWidgetOptions>(widget.BUTTON, {
      x: 0,
      y: SCREEN_HEIGHT - SB_CONFIRM_BUTTON_HEIGHT,
      w: SCREEN_WIDTH,
      h: SB_CONFIRM_BUTTON_HEIGHT,
      text: "Confirm",
      text_size: this.theme.FONT_SIZE - 4,
      color: 0xFFFFFF,
      normal_color: this.theme.ACCENT_COLOR_DARK,
      press_color: this.theme.ACCENT_COLOR_DARK_2,
      click_func: () => this.onConfirm(this.value)
    });

    this.renderer.build();
    this.renderer.useLayout(this.activeLayout);
  }

  getCurrentRendererName(): string {
    if(this.options.forceRenderer) return this.options.forceRenderer;
    return this.config.getItem("renderer") ?? SB_DEFAULT_RENDERER
  }

  getRendererInstance(): ScreenBoardRenderer {
    const renderer = this.getCurrentRendererName();
    switch (renderer) {
    case "t9":
      return new ScreenBoardT9(this);
    case "t14":
      return new ScreenBoardT14(this);
    case "qwerty":
      return new ScreenBoardQWERTY(this);
    default:
      console.log(`[sb] warn: unknown renderer ${renderer}`);
      return new ScreenBoardT9(this);
    }
  }

  private restoreLayouts(): string[] {
    let layouts = this.config.getItem("layouts") as string[];
    if(!layouts) {
      layouts = getFallbackLayouts(this.renderer.listLayouts());
    }

    return [
      ...layouts,
      ...this.renderer.extraLayouts,
    ]
  }

  switchLayout() {
    const indexNext = (this.layouts.indexOf(this.activeLayout) + 1) % this.layouts.length;
    this.activeLayout = this.layouts[indexNext];

    this.renderer.useLayout(this.activeLayout);
  }

  toggleCaps() {
    this.capsState = (this.capsState + 1) % 3;
    this.renderer.useLayout(this.activeLayout);
  }

  doBackspace() {
    const v = this.value;
    this.value = v.substring(0, v.length - 1);
  }

  createTextButton(options: ScreenBoardCreateTextButtonRequest): ZeppWidget<ZeppButtonWidgetOptions, {}> {
    const {x, y, w, special, handler, ident} = options
    return this.group.createWidget<ZeppButtonWidgetOptions>(widget.BUTTON, {
      x: x + 2,
      y: y + 2,
      w: w - 4,
      h: SB_ROW_HEIGHT - 4,
      text: "",
      text_size: this.theme.FONT_SIZE + SB_FONT_DELTA,
      normal_color: special ? this.theme.KBD_BUTTON_BG_SPECIAL : this.theme.KBD_BUTTON_BG_NORMAL,
      press_color: this.theme.KBD_BUTTON_BG_PRESSED,
      radius: 4,
      color: special ? this.theme.KBD_BUTTON_TEXT_SPECIAL : this.theme.KBD_BUTTON_TEXT_NORMAL,
      click_func: () => handler(ident)
    })
  }

  createSpaceButton(options: ScreenBoardCreateButtonRequest): ZeppWidget<ZeppButtonWidgetOptions, {}> {
    const {x, y, w, handler} = options;
    return this.group.createWidget<ZeppButtonWidgetOptions>(widget.BUTTON, {
      x: x + 2 + (this.theme.KBD_SPACE_SIZE_DELTA / 2),
      y: y + 2 + this.theme.KBD_SPACE_SIZE_DELTA,
      w: w - 4 - this.theme.KBD_SPACE_SIZE_DELTA,
      h: SB_ROW_HEIGHT - 4 - (this.theme.KBD_SPACE_SIZE_DELTA * 2),
      text: "",
      text_size: this.theme.FONT_SIZE + SB_FONT_DELTA - 8,
      normal_color: this.theme.KBD_SPACE_BG,
      press_color: this.theme.KBD_SPACE_BG_PRESSED,
      radius: 4,
      color: this.theme.KBD_SPACE_TEXT,
      click_func: () => handler()
    })
  }

  createIconButton(options: ScreenBoardCreateIconButtonRequest): ZeppWidget<ZeppImgWidgetOptions, {}> {
    const {x, y, w, icon, ident, handler} = options;
    this.group.createWidget<ZeppFillRectWidgetOptions>(widget.FILL_RECT, {
      x: x + 2,
      y: y + 2,
      w: w - 4,
      h: SB_ROW_HEIGHT - 4,
      radius: 4,
      color: this.theme.KBD_BUTTON_BG_NORMAL,
    });

    const view = this.group.createWidget<ZeppImgWidgetOptions>(widget.IMG, {
      x,
      y,
      w,
      h: SB_ROW_HEIGHT,
      pos_x: Math.floor((w - SB_ICON_SIZE) / 2),
      pos_y: Math.floor((SB_ROW_HEIGHT - SB_ICON_SIZE) / 2),
      src: `mzfw/${SB_ICON_SIZE}/${icon}.png`,
    });
    view.addEventListener(event.CLICK_UP, () => {
      handler(ident);
    });

    return view;
  }

  onConfirm(text: string) {
    // Override me
    console.log(text);
  }

  displayFormat(text: string) {
    // Override me
    return text;
  }

 get visible(): boolean {
    return !!this.group.getProperty(prop.VISIBLE);
  }

  set visible(v: boolean) {
    if(this.visible == v) return;
    this.group.setProperty(prop.VISIBLE, v);

    if(v) {
      this.lastLayerY = getScrollTop();
      scrollTo({y: 0});
    } else {
      scrollTo({y: this.lastLayerY});
    }
  }

  set confirmButtonText(v: string) {
    this.confirmButton.setProperty(prop.TEXT, v);
  }

  set title(v: string) {
    this.titleValue = v;
    if(this.displayValue == "") {
      this.valueScreen.setProperty(prop.TEXT, this.displayFormat(v));
      this.valueScreen.setProperty(prop.COLOR, this.theme.TEXT_COLOR_2);
    }
  }

  get value() {
    return this.displayValue;
  }

  set value(v) {
    if(this.displayValue == "" && v != "")
      this.valueScreen.setProperty(prop.COLOR, this.theme.TEXT_COLOR);
    else if(this.displayValue != "" && v == "")
      this.valueScreen.setProperty(prop.COLOR, this.theme.TEXT_COLOR_2);

    this.valueScreen.setProperty(prop.TEXT, v == "" ? this.titleValue : this.displayFormat(v));
    this.displayValue = v;

    if(this.capsState == CapsState.CAPS_ONE_TIME) {
      this.capsState = CapsState.CAPS_OFF;
      this.renderer.useLayout(this.activeLayout);
    }
  }
}
