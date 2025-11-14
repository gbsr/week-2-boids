
export default function createSpacer(): HTMLElement {
  const wrapper = document.createElement("div");

  const spacer = document.createElement("div");
  spacer.classList.add("spacer");
  wrapper.appendChild(spacer);

  return wrapper;
}