# Studievereniging BOLD Website

Een moderne, creatieve en volledig responsive website voor Studievereniging BOLD - de studentenvereniging voor CMD studenten aan Avans Hogeschool Breda.

## 🎯 Overzicht

Deze website is ontworpen met een minimalistisch zwart-wit kleurenschema en biedt een unieke, visueel opvallende maar zeer bruikbare ervaring voor zowel desktop als mobiel.

## ✨ Features

### Hoofdpagina's
- **Home** - Hero banner met overzicht van de vereniging
- **Introkamp** - Introductiekamp informatie en aanmelding
- **Planning** - Jaarplanning met kalender en timeline weergave
- **Fotoboek** - Foto galerij met filtering op activiteit/jaar
- **Leden** - Ledenlijst met thumbnail grid en detail weergave
- <!-- **Donaties** - Donatie pagina met betaalintegratie -->
- **Contact** - Contactformulier voor professionele contacten

### Technische Features
- **Volledig Responsive** - Werkt perfect op desktop, tablet en mobiel
- **Moderne CSS** - CSS Grid, Flexbox, en CSS Custom Properties
- **Interactieve JavaScript** - ES6+ modules, event handling, en animaties
- **SEO Geoptimaliseerd** - Meta tags, semantic HTML, en toegankelijkheid
- **Toegankelijk** - WCAG 2.1 compliant, keyboard navigation, screen reader support

## 🛠️ Technologieën

- **HTML5** - Semantic markup met ARIA labels
- **CSS3** - Modern CSS met Grid, Flexbox, en animaties
- **JavaScript ES6+** - Modulaire JavaScript met classes
- **Google Fonts** - Inter font family voor moderne typografie

## 📁 Project Structuur

```
Bold website 2/
├── index.html              # Homepage
├── introkamp.html          # Introkamp pagina
├── planning.html           # Jaarplanning pagina
├── fotoboek.html           # Foto galerij pagina
├── leden.html              # Ledenlijst pagina
├── donaties.html           # Donaties pagina (temporarily disabled)
├── contact.html            # Contact pagina
├── styles.css              # Hoofd CSS bestand
├── script.js               # Hoofd JavaScript bestand
└── README.md               # Project documentatie
```

## 🚀 Installatie & Gebruik

1. **Clone of download** de project bestanden
2. **Open** `index.html` in een moderne webbrowser
3. **Of serveer** de bestanden via een lokale server:
   ```bash
   # Met Python
   python -m http.server 8000
   
   # Met Node.js
   npx serve .
   ```

## 📱 Responsive Design

De website is volledig responsive en geoptimaliseerd voor:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

### Mobile Features
- Hamburger menu navigatie
- Touch-vriendelijke interface
- Geoptimaliseerde afbeeldingen
- Swipe ondersteuning voor galerij

## 🎨 Design Systeem

### Kleuren
- **Primair Zwart**: #000000
- **Secundair Wit**: #FFFFFF
- **Grijs**: #666666, #999999
- **Lichtgrijs**: #E0E0E0, #F8F8F8

### Typografie
- **Font Family**: Inter (Google Fonts)
- **Gewichten**: 300, 400, 500, 600, 700, 800, 900
- **Responsive Sizing**: clamp() functies voor schaalbare tekst

### Componenten
- **Buttons**: Primary, Secondary, Outline varianten
- **Cards**: Hover effecten en schaduwen
- **Forms**: Consistent styling en validatie
- **Modals**: Overlay dialogen met backdrop

## ⚡ Performance

- **Lazy Loading** - Afbeeldingen worden geladen wanneer nodig
- **Debounced Search** - Zoekfuncties zijn geoptimaliseerd
- **Minimale Dependencies** - Geen externe frameworks
- **Compressed Assets** - Geoptimaliseerde bestanden

## 🔧 Customization

### Kleuren Aanpassen
Pas de CSS custom properties aan in `styles.css`:
```css
:root {
  --primary-color: #000000;
  --secondary-color: #ffffff;
  --accent-color: #666666;
}
```

### Content Toevoegen
1. **Nieuwe pagina's**: Kopieer een bestaande HTML file
2. **Navigatie**: Voeg links toe aan `nav-menu` in alle HTML bestanden
3. **Styling**: Voeg CSS toe aan `styles.css`
4. **Functionaliteit**: Voeg JavaScript toe aan `script.js`

## 📊 SEO & Toegankelijkheid

### SEO Features
- Meta descriptions en keywords
- Open Graph tags
- Semantic HTML5 structure
- Clean URL structure

### Toegankelijkheid
- ARIA labels en roles
- Keyboard navigation
- Screen reader support
- High contrast mode support
- Focus indicators

## 🐛 Browser Ondersteuning

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📝 Licentie

Dit project is gemaakt voor Studievereniging BOLD. Alle rechten voorbehouden.

## 🤝 Bijdragen

Voor vragen of suggesties, neem contact op via:
- **E-mail**: studieverenigingbold@gmail.com
- **Website**: [Contact pagina](contact.html)

## 📞 Contact

**Studievereniging BOLD**
- Avans Hogeschool Breda
- Lovensdijkstraat 61, 4818 AJ Breda
- E-mail: studieverenigingbold@gmail.com

---

*Gemaakt met ❤️ voor de CMD community*
