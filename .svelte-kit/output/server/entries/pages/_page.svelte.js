import { V as escape_html, Y as add_styles, S as pop, Z as stringify, Q as push, _ as ensure_array_like } from "../../chunks/index.js";
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean || value === "" && name === "class") return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
const colors = [
  "#648fff",
  "#785ef0",
  "#dc267f",
  "#fe6100",
  "#ffb000",
  "#222",
  "#eee"
];
const barState = { id: -1 };
function Bar($$payload, $$props) {
  push();
  let { id, tabHeight, tabRatio, visible } = $$props;
  let screenWidth = 0;
  let tabPercentageSize = 0.27;
  let tabPixelSize = screenWidth * tabPercentageSize;
  let xOffset = screenWidth - tabPixelSize * (id + 1);
  let xFontOffset = xOffset + tabPixelSize * 0.3;
  let xRectOffset = xOffset - tabPixelSize * (1 / tabRatio - 1) * tabRatio + tabPixelSize;
  let tabNames = ["social", "music", "games", "code"];
  let skew = Math.atan(tabPixelSize * tabRatio / tabHeight) * (-180 / Math.PI);
  let fontSize = "20px";
  let fullStretch = barState.id == id;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<rect${add_styles({
      "--tab-width": `${stringify(tabPixelSize)}px`,
      "--xOffset": `${stringify(xRectOffset)}px`,
      "--full-width": `${stringify(screenWidth)}px`,
      "--skew": `${stringify(skew)}deg`
    })}${attr("class", `barMobile svelte-1jbt5lf ${stringify([barState.id == id ? "mobileBarFull" : ""].filter(Boolean).join(" "))}`)}${attr("width", tabPixelSize)}${attr("height", tabHeight)}${attr("transform", `skewX(${stringify(skew)})`)}${attr("fill", colors[id])}></rect>`;
  }
  $$payload.out += `<!--]-->`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if (fullStretch) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<rect${attr("class", `${stringify("hidden")} svelte-1jbt5lf`)}${attr("y", tabHeight)}${attr("x", xRectOffset)}${attr("transform", `skewX(${stringify(skew)})`)}${attr("width", tabPixelSize)} height="1000"${attr("fill", colors[id])}></rect>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--><text class="tabText"${attr("fill", colors[6])}${attr("y", tabHeight * 0.6)}${attr("x", xFontOffset)}${attr("font-size", fontSize)} pointer-events="none">${escape_html(tabNames[id])}</text>`;
  pop();
}
function Ribbon($$payload, $$props) {
  push();
  let { xOffset, ribbonWidth, ribbonHeight } = $$props;
  let screenWidth = 0;
  let screenHeight = 0;
  $$payload.out += `<!---->`;
  {
    $$payload.out += `<rect${attr("class", ` ${stringify("hidden")} svelte-2e2o1w`)}${attr("x", `${stringify(xOffset)}px`)}${attr("y", `-${stringify(screenHeight)}px`)} transform="scale(1 -1)"${attr("height", `${stringify(ribbonHeight)}px`)}${attr("width", `${stringify(ribbonWidth)}px`)}${attr("fill", colors[barState.id])}></rect><rect${attr("class", ` ${stringify("hidden")} svelte-2e2o1w`)}${attr("x", `-${stringify(screenWidth)}px`)}${attr("y", `${stringify(screenHeight - 150)}px`)} transform="scale(-1 1)" height="100px"${attr("width", `${stringify(ribbonWidth)}px`)}${attr("fill", colors[barState.id])}></rect>`;
  }
  $$payload.out += `<!---->`;
  pop();
}
function _page($$payload, $$props) {
  push();
  const colors2 = [
    "#648fff",
    "#785ef0",
    "#dc267f",
    "#fe6100",
    "#ffb000",
    "#222",
    "#eee"
  ];
  let screenWidth = 0;
  let screenHeight = 0;
  let isDesktop = screenWidth >= 768;
  let visible = true;
  let tabIds = (() => {
    {
      return [3, 2, 1, 0].sort((a, b) => a == barState.id ? 999 : b - a);
    }
  })();
  let tabRatio = 0.1;
  let tabHeight = 100;
  let tabPercentageSize = 0.275;
  let tabPixelSize = screenWidth * tabPercentageSize;
  const ribbonXOffset = 100;
  const ribbonWidth = 150;
  let ribbonHeight = screenHeight - tabHeight;
  const each_array = ensure_array_like(tabIds);
  $$payload.out += `<div${attr("style", `height: ${stringify(tabHeight)}px; background-color: ${stringify(colors2[4])}`)}>`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <svg style="position: absolute;"${attr("viewBox", `0 0 ${stringify(screenWidth)} ${stringify(screenHeight)}`)}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tabId = each_array[$$index];
    Bar($$payload, { id: tabId, tabHeight, tabRatio, visible });
  }
  $$payload.out += `<!--]-->`;
  Ribbon($$payload, {
    xOffset: ribbonXOffset,
    ribbonWidth,
    ribbonHeight
  });
  $$payload.out += `<!----></svg></div> <div${attr("style", `background-color: colors[${stringify(barState.id)}]`)} hidden>barState.id: ${escape_html(barState.id)} <br> screenWidth: ${escape_html(screenWidth)} <br> isDesktop: ${escape_html(isDesktop)} <br> tabPercentageSize: ${escape_html(tabPercentageSize)} <br> tabPixelSize: ${escape_html(tabPixelSize)} <br></div> `;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div style="color: #ddd; z-index: 10; margin: 100px">welcome to my website! it is currently under construction. click on the tabs up top to see my
		various projects :)</div>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _page as default
};
