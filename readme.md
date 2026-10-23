# David Ohimai · Flutter Mobile Developer Portfolio

A single-page portfolio for my Flutter work. It shows real screenshots of apps I've built inside Android and iOS device frames, with a short case study for each.

## What's on the page

| Section | Contents |
| --- | --- |
| Hero | Who I am, what I build, and four headline facts from my CV |
| Apps | Case studies for **Idey** (live on Google Play), **Lábà FOODS** (live on Google Play), **Ridify** (internal testing, APK available) and **Movix** (React Native, web demo), plus smaller cards for KodeHauz apps, Spelling Bee and HNG projects |
| Experience | Roles from my CV, newest first |
| Skills | Each skill paired with the project where I used it |
| Journey | From petroleum engineering to mobile development |
| AI | A link to my separate [AI engineering portfolio](https://david-ohimai.github.io/ai-engineering-portfolio/) |
| Contact | Email, LinkedIn, GitHub, CV |

## Built with

Plain HTML, CSS and JavaScript. No framework and no build step, so it deploys straight to GitHub Pages.

- **Device frames** are pure CSS: an Android punch-hole and an iOS Dynamic Island. Screens exported without a system status bar get a simulated one.
- **Galleries** scroll horizontally with scroll-snap. Tap a phone to open it full size; arrow keys and Esc work in the viewer.
- **Lábà FOODS** has a Customer / Rider toggle because the app serves both roles.
- **Motion** (scroll reveal, floating hero phones, pointer tilt) is turned off when the visitor has reduced motion enabled.
- **Palette:** deep navy with orange accents, taken from Idey. Fonts are Montserrat and Nunito Sans.

## Project structure

```
index.html
css/styles.css
js/main.js            # LINKS config at the top: Play Store, APK, CV URLs
images/apps/idey/     # WebP screenshots, one screen per file
images/apps/laba/
images/apps/ridify/
images/david-portrait.webp
```

## Updating links

All Play Store, APK and CV links live in the `LINKS` object at the top of `js/main.js`. A button with an empty link is shown greyed out as "coming soon", so the page never has a dead link.

## Run locally

```bash
git clone https://github.com/Daveohi/portfolio-website.git
cd portfolio-website
# open index.html in a browser, or serve it:
python -m http.server 8000
```

## Contact

- Email: daveohimai@gmail.com
- LinkedIn: https://www.linkedin.com/in/david-ohimai
- GitHub: https://github.com/Daveohi (mobile) · https://github.com/david-ohimai (AI)
