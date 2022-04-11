const theming = new Theming("main_page");

theming.addThemeChangeListener("toLight", function() {
    alert("Light");
});