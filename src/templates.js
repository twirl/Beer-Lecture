export default {
    pageBreak: '<div class="page-break"></div>',
    h5Value: ({ value }) => value,
    alignClassName: (align) => `text-align-${align}`,

    frontPage: (l10n) => `
<div class="cover">
    <h1>
    <span class="author">${l10n.author}</span><br /><span class="title"
        >${l10n.frontPage.title}</span
    ><br /><em>${l10n.frontPage.subTitle}</em>
    </h1>
</div><div class="page-break"></div><div class="annotation"><p>
    <strong>${l10n.author}. ${l10n.title}.</strong><br />
    <a target="_blank" href="mailto:${l10n.links.email}">${
        l10n.links.emailString
    }</a> &middot; <a target="_blank" href="${l10n.links.linkedinHref}">${
        l10n.links.linkedinString
    }</a> &middot; <a target="_blank" href="${l10n.links.patreonHref}">${
        l10n.links.patreonString
    }</a></p>
    ${l10n.frontPage.contents.join('\n')}
    <p>${l10n.sourceCodeAt} <a target="_blank" href="${
        l10n.links.githubHref
    }">${l10n.links.githubString}</a></p>
</div><div class="page-break"></div>`,

    landing: (structure, l10n, lang) => {
        const link = (anchor, type = 'html') =>
            `${encodeURIComponent(l10n.file)}.${lang}.${type}${
                anchor ? '#' + anchor : ''
            }`;
        let chapterCounter = 0;
        return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/jpg" href="assets/favicon.jpg" />
        <title>
            ${l10n.author}. ${l10n.title}
        </title>
        <meta
            name="description"
            content="${l10n.description}"
        />
        <meta property="og:type" content="article" />
        <meta
            property="og:title"
            content="${l10n.author}. ${l10n.title}"
        />
        <meta
            property="og:description"
            content="${l10n.description}"
        />
        <meta property="og:image" content="assets/header.png" />
        <meta
            property="og:url"
            content="${l10n.links.githubHref}"
        />
        <style>
            @font-face {
                font-family: local-serif;
                src: url(assets/Vollkorn-VariableFont_wght.ttf);
            }

            * {
                margin: 0;
                padding: 0;
                border: none;
                font-family: local-serif, Arial, Helvetica, sans-serif;
                font-size: 14pt;
                list-style-type: none;
            }

            ul > li {
                padding-left: 1em;
            }

            p {
                margin: 1em 0;
            }

            body {
                margin: 5px;
            }

            nav {
                text-align: center;
            }

            nav a {
                vertical-align: -12%;
                content: ' ';
                width: 1em;
                height: 1em;
                display: inline-block;
                background-position: 0 0;
                background-size: auto 100%;
                background-repeat: no-repeat;
                text-decoration: none;
            }

            h1, h2 {
                padding: unset;
                margin: unset;
                line-height: unset;
            }

            h1 {
                font-size: 1.2em;
            }

            h3 {
                font-size: 1em;
            }

            a.instagram {
                background-image: url(assets/instagram.svg);
            }

            a.facebook {
                background-image: url(assets/facebook.png);
            }

            a.github {
                background-image: url(assets/github.jpg);
                width: 1.2em;
            }

            a.reddit {
                background-image: url(assets/reddit.png);
            }

            a.linkedin {
                background-image: url(assets/linkedin.png);
                width: 1.176em;
            }

            a.twitter {
                background-image: url(assets/twitter.svg);
                width: 1.392em;
            }

            a.telegram {
                background-image: url(assets/telegram.png);
            }

            a.patreon,
            a.medium {
                width: auto;
                padding-left: 1em;
                vertical-align: baseline;
                background-position: 0 0.1em;
            }

            a.patreon {
                background-image: url(assets/patreon.png);
            }

            a.medium {
                background-image: url(assets/medium.png);
                padding-left: 1.3em;
                background-size: 1.42em 1em;
            }

            a.pikabu {
                background-image: url(assets/pikabu.png);
                width: auto;
                padding-left: 1em;
                vertical-align: baseline;
                background-position: 0 0.1em;
            }

            a.zen {
                background-image: url(assets/zen.svg);
                background-position: 0 0.2em;
                background-size: 0.8em;
                width: auto;
                padding-left: 1em;
                vertical-align: baseline;
            }

            body img {
                width: 80%;
            }

            @media (min-width: 1010px) {
                body {
                    width: 1000px;
                    margin: 5px auto;
                    text-align: justify;
                }
            }

            @media (min-width: 2000px) {
                body {
                    width: auto;
                    margin: 5px 25%;
                    text-align: justify;
                }
            }
        </style>
    </head>
    <body>
        <nav>
            <img
                src="assets/header.jpg"
                alt="${l10n.author}. ${l10n.title}"
            /><br />
            <h1>${l10n.author}<br/>${l10n.title}</h1>
            <h2>${l10n.landing.subTitle}</h2>
            <br />${l10n.landing.subscribeOn} ${l10n.landing.updates
            .map(
                (source) =>
                    `<a class="${source}" href="${
                        l10n.links[source + 'Href']
                    }">${l10n.links[source + 'Tag'] || ''}</a>`
            )
            .join(' &middot; ')}
            ${
                l10n.landing.follow && l10n.landing.follow.length
                    ? `<br/>${l10n.landing.followOn} ${l10n.landing.follow
                          .map(
                              (source) =>
                                  `<a class="${source}" href="${
                                      l10n.links[source + 'Href']
                                  }">${l10n.links[source + 'Tag'] || ''}</a>`
                          )
                          .join(' &middot; ')}`
                    : ''
            }
            <br />${l10n.landing.supportThisWork} ${l10n.landing.support
            .map(
                (source) =>
                    `<a class="${source}" href="${
                        l10n.links[source + 'Href']
                    }">${l10n.links[source + 'Tag'] || ''}</a>`
            )
            .join(' &middot; ')}
            <br />🍻🍻🍻
        </nav>
        ${l10n.landing.content.join('\n')}
        <p>${l10n.landing.download} <a href="${link(
            null,
            'pdf'
        )}">PDF</a>, <a href="${link(null, 'epub')}">EPUB</a>, ${
            l10n.landing.or
        } <a href="${link()}">${l10n.landing.readOnline}</a>.
        </p>
        <h3>${l10n.toc}</h3>
        <ul>${l10n.contents
            .map((section, i) => {
                const written = structure.sections.slice(
                    0,
                    structure.sections.length - 1
                )[i];
                return `<li>
                    <h4>${
                        written
                            ? `<a href="${link(written.anchor)}">${
                                  written.title
                              }</a>`
                            : `${section.title}`
                    }</h4>
                    ${
                        section.chapters.length
                            ? `<ul>
                        ${section.chapters
                            .map((chapter, j) => {
                                const writtenChapter =
                                    written && written.chapters[j];
                                chapterCounter++;
                                return writtenChapter
                                    ? `<li><a href="${link(
                                          writtenChapter.anchor
                                      )}">${writtenChapter.title}</a></li>`
                                    : `<li>${l10n.chapter} ${chapterCounter}. ${chapter}</li>`;
                            })
                            .join('\n')}
                                </ul>`
                            : ''
                    }
                </li>`;
            })
            .join('\n')}
    <li><h4><a href="${link(
        structure.sections[structure.sections.length - 1].anchor
    )}">${
            structure.sections[structure.sections.length - 1].title
        }</a></h4></li></ul>
        <p>${l10n.landing.license}</p>
        <p>${l10n.sourceCodeAt} <a href="${l10n.links.githubHref}">${
            l10n.links.githubString
        }</a></p>
        ${l10n.landing.footer.join('\n')}
    </body>
</html>`;
    }
};
