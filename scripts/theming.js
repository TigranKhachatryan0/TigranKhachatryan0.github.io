class Theming {
    constructor(base) {
        this.dark_listeners = [];
        this.light_listeners = [];

        console.debug("Theming >> Theming.constructor >> Initializing theming...");

        console.debug("Theming >> Theming.constructor >> Checking user's color scheme...");
        this.dark_mode_preferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.debug("Theming >> Theming.constructor >> User prefers dark theme: " + (this.dark_mode_preferred ? "true" : "false"));

        console.debug("Theming >> Theming.constructor >> Fetching theme button's children elements...");
        this.theme_button = document.getElementById("theme_button");
        this.theme_button_icon = theme_button.getElementsByTagName("span")[0];
        this.theme_button_span = theme_button.getElementsByTagName("span")[1];

        console.debug("Theming >> Theming.constructor >> Creating CSS elements...");
        this.theming_common_css = this.createCSSelement();
        this.theming_theme_css = this.createCSSelement();

        console.debug("Theming >> Theming.constructor >> Assigning values to freshly created CSS elements...");
        console.debug("Theming >> Theming.constructor >>> Loading /common.css");
        this.setCommonCSS("styles/" + base + "/common.css");
        if (this.dark_mode_preferred) {
            console.debug("Theming >> Theming.constructor >>> Loading /dark_theme.css");
            this.setThemeCSS("styles/" + base + "/dark_theme.css");

            this.theme_button_icon.innerHTML = "star";
            this.theme_button_span.innerHTML = "ԱՍՏՂ";
        } else {
            console.debug("Theming >> Theming.constructor >>> Loading /light_theme.css");
            this.setThemeCSS("styles/" + base + "/light_theme.css");

            this.theme_button_icon.innerHTML = "light_mode";
            this.theme_button_span.innerHTML = "ԱՐԵՒ";
        }

        console.debug("Theming >> Theming.constructor >> Disabling transitions temporarily\n" +
                      "                                  in order to apply changes instantly...");
        
        document.querySelectorAll("*:not(header > *)").forEach(function(element) {
            element.classList.add("no_transition");
        });

        console.debug("Theming >> Theming.constructor >> Applying changes...");
        document.head.appendChild(this.theming_common_css);
        document.head.appendChild(this.theming_theme_css);

        console.debug("Theming >> Theming.constructor >> Reverting transition changes...");
        setTimeout(function() {
            document.querySelectorAll("*:not(header > *)").forEach(function(element) {
                element.classList.remove("no_transition");

                if (element.classList.length == 0) {
                    element.removeAttribute("class");
                }
            });
        }, 500);

        // Dark/Light theme toggle button
        const parent_this = this;
        theme_button.addEventListener("click", function() {
            console.debug("Theming >> theme_button(event:click) >> Changing theme...");

            const icon = theme_button.getElementsByTagName("span")[0];
            const label = theme_button.getElementsByTagName("span")[1];

            if (label.innerHTML == "ԱՐԵՒ") {
                label.innerHTML = "ԱՍՏՂ";
                icon.innerHTML = "star";
                
                parent_this.setThemeCSS("styles/" + base + "/dark_theme.css");

                console.debug("Theming >> theme_button(event:click) >> Switched to dark mode!");
                this.dark_listeners.forEach(function(listener) {
                    listener();
                });
            } else {
                label.innerHTML = "ԱՐԵՒ";
                icon.innerHTML = "light_mode";

                parent_this.setThemeCSS("styles/" + base + "/light_theme.css");

                console.debug("Theming >> theme_button(event:click) >> Switched to light mode!");
                this.light_listeners.forEach(function(listener) {
                    listener();
                });
            }
        });
    }

    is_dark_mode() {
        return this.theme_button_span.innerHTML == "ԱՍՏՂ";
    }
    
    is_light_mode() {
        return !is_dark_mode();
    }


    setCSS(linkElement, href) {
        linkElement.href = href;
    }

    setCommonCSS(href) {
        this.setCSS(this.theming_common_css, href);
    }

    setThemeCSS(href) {
        this.setCSS(this.theming_theme_css, href);
    }

    createCSSelement() {
        const css_element = document.createElement("link");
        css_element.setAttribute("rel", "stylesheet");

        return css_element;
    }
    
    addThemeChangeListener(event, handler) {
        switch (event) {
            case "toLight": {
                this.light_listeners.push(handler);
                break;
            }

            case "toDark": {
                this.dark_listeners.push(handler);
                break;
            }
            
            case "change": {
                this.light_listeners.push(handler);
                this.dark_listeners.push(handler);
                break;
            }

            default: {
                throw new Error("Invalid event");
                break;
            }
        }
    }
}
