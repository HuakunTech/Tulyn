export function syncThemeClass() {
  // console.log("Theme: ", document.documentElement.dataset.theme);
  if (document.documentElement.dataset.theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
