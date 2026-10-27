// Keep one shared WhatsApp number so every contact action reaches the same account.
const WHATSAPP_NUMBER = "237693697097";

// Send conversion details to any analytics integration and to in-page listeners.
function trackConversion(eventName, parameters = {}) {
    const detail = { eventName, ...parameters };
    window.dispatchEvent(new CustomEvent("bdmh:conversion", { detail }));
    if (typeof window.gtag === "function") window.gtag("event", eventName, parameters);
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

// Close the mobile menu and restore its accessible button labels.
function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
}

if (menuButton && navigation) {
    // Keep the mobile navigation state in sync with the button and the visible menu.
    menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        navigation.classList.toggle("is-open", !isOpen);
    });

    // Close the menu after navigation, when clicking outside it, or when Escape is pressed.
    navigation.addEventListener("click", (event) => {
        if (event.target instanceof HTMLAnchorElement) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
            closeMenu();
            menuButton.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
}

// Keep the copyright year current without editing each page annually.
document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
});

const enquiryForm = document.querySelector("[data-email-form]");

if (enquiryForm instanceof HTMLFormElement) {
    const nameField = enquiryForm.elements.namedItem("name");
    const emailField = enquiryForm.elements.namedItem("email");
    const phoneField = enquiryForm.elements.namedItem("phone");
    const countryField = enquiryForm.elements.namedItem("country");
    const countryLabel = enquiryForm.querySelector('label[for="country"]');
    const phoneInputGroup = phoneField instanceof HTMLInputElement
        ? phoneField.closest(".phone-input-group")
        : null;
    const status = enquiryForm.querySelector(".form-status");
    const params = new URLSearchParams(window.location.search);
    const interestField = enquiryForm.elements.namedItem("interest");
    const messageField = enquiryForm.elements.namedItem("message");
    const validatedFields = [nameField, emailField, phoneField, interestField, messageField];
    const countryCallingCodes = {
        Afghanistan: "+93", Albania: "+355", Algeria: "+213", Andorra: "+376", Angola: "+244",
        "Antigua and Barbuda": "+1268", Argentina: "+54", Armenia: "+374", Australia: "+61",
        Austria: "+43", Azerbaijan: "+994", Bahamas: "+1242", Bahrain: "+973", Bangladesh: "+880",
        Barbados: "+1246", Belarus: "+375", Belgium: "+32", Belize: "+501", Benin: "+229",
        Bhutan: "+975", Bolivia: "+591", "Bosnia and Herzegovina": "+387", Botswana: "+267",
        Brazil: "+55", Brunei: "+673", Bulgaria: "+359", "Burkina Faso": "+226", Burundi: "+257",
        "Cabo Verde": "+238", Cambodia: "+855", Cameroon: "+237", Canada: "+1",
        "Central African Republic": "+236", Chad: "+235", Chile: "+56", China: "+86",
        Colombia: "+57", Comoros: "+269", Congo: "+242", "Costa Rica": "+506",
        "Côte d’Ivoire": "+225", Croatia: "+385", Cuba: "+53", Cyprus: "+357", Czechia: "+420",
        "Democratic Republic of the Congo": "+243", Denmark: "+45", Djibouti: "+253",
        Dominica: "+1767", "Dominican Republic": "+1809", Ecuador: "+593", Egypt: "+20",
        "El Salvador": "+503", "Equatorial Guinea": "+240", Eritrea: "+291", Estonia: "+372",
        Eswatini: "+268", Ethiopia: "+251", Fiji: "+679", Finland: "+358", France: "+33",
        Gabon: "+241", Gambia: "+220", Georgia: "+995", Germany: "+49", Ghana: "+233",
        Greece: "+30", Grenada: "+1473", Guatemala: "+502", Guinea: "+224",
        "Guinea-Bissau": "+245", Guyana: "+592", Haiti: "+509", Honduras: "+504", Hungary: "+36",
        Iceland: "+354", India: "+91", Indonesia: "+62", Iran: "+98", Iraq: "+964", Ireland: "+353",
        Israel: "+972", Italy: "+39", Jamaica: "+1876", Japan: "+81", Jordan: "+962",
        Kazakhstan: "+7", Kenya: "+254", Kiribati: "+686", Kuwait: "+965", Kyrgyzstan: "+996",
        Laos: "+856", Latvia: "+371", Lebanon: "+961", Lesotho: "+266", Liberia: "+231",
        Libya: "+218", Liechtenstein: "+423", Lithuania: "+370", Luxembourg: "+352",
        Madagascar: "+261", Malawi: "+265", Malaysia: "+60", Maldives: "+960", Mali: "+223",
        Malta: "+356", "Marshall Islands": "+692", Mauritania: "+222", Mauritius: "+230",
        Mexico: "+52", Micronesia: "+691", Moldova: "+373", Monaco: "+377", Mongolia: "+976",
        Montenegro: "+382", Morocco: "+212", Mozambique: "+258", Myanmar: "+95", Namibia: "+264",
        Nauru: "+674", Nepal: "+977", Netherlands: "+31", "New Zealand": "+64", Nicaragua: "+505",
        Niger: "+227", Nigeria: "+234", "North Korea": "+850", "North Macedonia": "+389",
        Norway: "+47", Oman: "+968", Pakistan: "+92", Palau: "+680", Palestine: "+970",
        Panama: "+507", "Papua New Guinea": "+675", Paraguay: "+595", Peru: "+51",
        Philippines: "+63", Poland: "+48", Portugal: "+351", Qatar: "+974", Romania: "+40",
        Russia: "+7", Rwanda: "+250", "Saint Kitts and Nevis": "+1869", "Saint Lucia": "+1758",
        "Saint Vincent and the Grenadines": "+1784", Samoa: "+685", "San Marino": "+378",
        "Sao Tome and Principe": "+239", "Saudi Arabia": "+966", Senegal: "+221", Serbia: "+381",
        Seychelles: "+248", "Sierra Leone": "+232", Singapore: "+65", Slovakia: "+421",
        Slovenia: "+386", "Solomon Islands": "+677", Somalia: "+252", "South Africa": "+27",
        "South Korea": "+82", "South Sudan": "+211", Spain: "+34", "Sri Lanka": "+94",
        Sudan: "+249", Suriname: "+597", Sweden: "+46", Switzerland: "+41", Syria: "+963",
        Taiwan: "+886", Tajikistan: "+992", Tanzania: "+255", Thailand: "+66",
        "Timor-Leste": "+670", Togo: "+228", Tonga: "+676", "Trinidad and Tobago": "+1868",
        Tunisia: "+216", "Türkiye": "+90", Turkmenistan: "+993", Tuvalu: "+688", Uganda: "+256",
        Ukraine: "+380", "United Arab Emirates": "+971", "United Kingdom": "+44",
        "United States": "+1", Uruguay: "+598", Uzbekistan: "+998", Vanuatu: "+678",
        "Vatican City": "+379", Venezuela: "+58", Vietnam: "+84", Yemen: "+967", Zambia: "+260",
        Zimbabwe: "+263"
    };
    const serviceOptions = {
        website: "Website development",
        seo: "SEO and search visibility",
        advertising: "Paid advertising"
    };

    // Place the country calling-code selector beside the phone number input.
    if (
        countryField instanceof HTMLSelectElement
        && countryLabel instanceof HTMLLabelElement
        && phoneInputGroup instanceof HTMLElement
    ) {
        countryField.options[0].textContent = "Country code";
        Array.from(countryField.options).slice(1).forEach((option) => {
            const country = option.textContent.trim();
            const callingCode = countryCallingCodes[country];
            option.value = callingCode;
            option.textContent = `${callingCode} ${country}`;
        });
        countryField.id = "phone-country";
        countryField.name = "phone-country";
        countryField.setAttribute("aria-label", "Country calling code");
        countryLabel.remove();
        phoneInputGroup.prepend(countryField);
        countryField.value = "+237";
    }

    // Use service or course links to preselect the relevant enquiry topic.
    if (interestField instanceof HTMLSelectElement) {
        const service = params.get("service");
        if (service && serviceOptions[service]) {
            interestField.value = serviceOptions[service];
        } else if (params.has("interest") || params.has("course")) {
            interestField.value = "BDM&TH Academy training";
        }
    }

    // Add the selected course to the message so the visitor does not need to repeat it.
    if (messageField instanceof HTMLTextAreaElement && params.has("course")) {
        const course = params.get("course").replaceAll("-", " ");
        messageField.value = `I’m interested in the ${course} training track. Please share the available schedule and fees.`;
    }

    // Recheck custom validation as visitors edit the form.
    validatedFields.forEach((field) => {
        if (field instanceof HTMLElement) {
            field.addEventListener("input", () => field.setCustomValidity(""));
            field.addEventListener("change", () => field.setCustomValidity(""));
        }
    });

    // Validate the enquiry and prepare a complete email draft for the visitor to send.
    enquiryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (
            !(nameField instanceof HTMLInputElement)
            || !(emailField instanceof HTMLInputElement)
            || !(phoneField instanceof HTMLInputElement)
            || !(countryField instanceof HTMLSelectElement)
            || !(interestField instanceof HTMLSelectElement)
            || !(messageField instanceof HTMLTextAreaElement)
        ) return;

        nameField.setCustomValidity(nameField.value.trim() ? "" : "Please enter your name.");
        interestField.setCustomValidity(interestField.value.trim() ? "" : "Please select what you're interested in.");
        messageField.setCustomValidity(messageField.value.trim() ? "" : "Please tell us a little about what you need.");
        const hasEmail = Boolean(emailField.value.trim());
        const hasPhone = Boolean(phoneField.value.trim());
        emailField.setCustomValidity(hasEmail || hasPhone ? "" : "Please provide an email address or phone number.");
        phoneField.setCustomValidity(hasEmail || hasPhone ? "" : "Please provide an email address or phone number.");
        if (!enquiryForm.reportValidity()) return;

        const fields = new FormData(enquiryForm);
        trackConversion("contact_form_submit", {
            interest: fields.get("interest"),
            handoff: "email_draft"
        });
        const lines = [
            "Hello BDM&TH, I'd like to discuss a project or training enquiry.",
            "",
            `Name: ${fields.get("name")}`,
            `Business/organization: ${fields.get("business") || "Not provided"}`,
            `Email: ${fields.get("email") || "Not provided"}`,
            `Phone: ${fields.get("phone") ? `${fields.get("phone-country")} ${fields.get("phone")}` : "Not provided"}`,
            `Interested in: ${fields.get("interest")}`,
            `Estimated budget: ${fields.get("budget") || "Prefer to discuss"}`,
            "",
            `Details: ${fields.get("message")}`
        ];
        const subject = `Enquiry: ${fields.get("interest")}`;
        const emailUrl = `mailto:serionmukete237@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\r\n"))}`;
        if (status) {
            status.replaceChildren("Your email draft is ready. If your email app did not open, ");
            const link = document.createElement("a");
            link.href = emailUrl;
            link.textContent = "open the draft here";
            status.append(link, " and press Send in your email app.");
        }
        window.location.href = emailUrl;
    });
}

// Fill in WhatsApp links whose message is stored as a readable data attribute.
document.querySelectorAll("[data-whatsapp-message]").forEach((link) => {
    const message = link.getAttribute("data-whatsapp-message");
    if (message) {
        link.setAttribute("href", `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
    }
});

// Track clicks on WhatsApp links so the site can measure contact intent.
document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const whatsappLink = event.target.closest('a[href*="wa.me/"]');
    if (whatsappLink) {
        trackConversion("whatsapp_click", {
            page: window.location.pathname,
            label: whatsappLink.getAttribute("aria-label") || whatsappLink.textContent.trim()
        });
    }
});
