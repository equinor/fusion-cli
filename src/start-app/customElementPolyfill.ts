// TODO: @odinr please fix me
const _customElementsDefine = window.customElements.define;
window.customElements.define = (name, cl, conf) => {
  if (!customElements.get(name)) {
    _customElementsDefine.call(window.customElements, name, cl, conf);
  } else {
    console.debug(`${name} has been defined twice`);
  }
};
