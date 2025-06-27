import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    en: {
        translation: {}
    },
    de: {
        translation: {
            "Search": "Suchen",
            "Search words": "Wörter suchen",
            "Favorite_verb": "Favoritisieren",
            "Translate": "Übersetzen",
            //
            "Favorites": "Favoriten",
            "You currently have no favorites": "Du hast aktuell keine Favoriten",
            //
            "Home": "Home",
            "Start": "Starten",
            "Number of words": "Anzahl der Wörter",
            "Quiz type": "Quiz Art",
            "random": "Zufällig",
            "common mistakes": "Übliche Fehler",
            "frequency": "Häufigkeit",
            "favorites": "Favoriten",
            "Words ending with {{suffix}} are always {{gender}}.": "Wörter die mit {{suffix}} enden, sind immer {{gender}}.",
            "masculine": "männlich",
            "feminine": "weiblich",
            "neuter": "sächlich",
            "Report an issue": "Problem melden",
            "Definition": "Bedeutung",
            "Share": "Teilen",
            "Infinite": "Endlos",
            //
            "Settings": "Einstellungen",
            "Misc": "Misc",
            "Language": "Sprache",
            "Theme": "Design",
            "Feedback": "Bug melden",
            "Notifications": "Nachrichten",
            "Send reminders": "Erinnerung schicken",
            "Accessibility": "Barrierefreiheit",
            "Animations": "Animationen",
            "Sound effects": "Klangeffekte",
            "Haptic feedback": "Haptik",
            "Privacy": "Privatsphäre",
            "Terms of use": "Nutzungsbedingungen",
            "Advertisements": "Werbung",
            "Acknowledgements": "Annerkenungen",
            "Data": "Daten",
            "Import data": "Daten importieren",
            "Export data": "Daten exportieren",
            "Delete data": "Daten löschen",
            "Auto": "Automatisch",
            "dark": "dunkel",
            "light": "hell",
            //
            "Name": "Name",
            "required": "nötig",
            "Your name": "Dein Name",
            "Email": "Email",
            "your.email@example.com": "dein.email@beispiel.com",
            "Description": "Beschreibung",
            "Found a bug? Have some feedback? Tell us here...": "Ein Bug gefunden? Hast Du Feedback? Erzähle uns hier davon",
            "Send feedback": "Rückmeldung senden",
        }
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
