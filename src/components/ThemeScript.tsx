/**
 * Runs before paint so the page never flashes the wrong theme. Kept in sync
 * with readStoredTheme() in the ui slice.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem("neyrosoft-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
