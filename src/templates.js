import { readFileSync } from 'fs';
import { resolve } from 'path';

export default {
    pageBreak: '<div class="page-break"></div>',
    h5Value: ({ value }) => value,
    alignClassName: (align) => `text-align-${align}`,

    mainContent: (content) => `<section class="main-content">
<nav class="page-main"><ul class="nav-folded">
    <li class="share"></li>
    <li class="para">§</li>
</ul></nav>${content}</section>`,

    screenContent: (content, css, { structure, l10n, templates }) =>
        `${templates.sidePanel({
            structure,
            l10n,
            templates
        })}<article>${content}</article>${templates.mainScript(l10n)}`,

    mainScript: () =>
        `<script>${readFileSync(resolve('./src/scripts/sidebar.js'))}</script>`,

    sidePanel: ({
        structure,
        l10n,
        templates
    }) => `<div class="fade display-none"></div>
<aside class="side-panel display-none">
    <h3 class="title">${l10n.author}. ${l10n.title}</h3>
    ${templates.shareControl({ l10n, templates })}
    <section class="side-toc">${templates.toc(structure, l10n)}</section>
    <button type="button" class="close"></button></aside>`,

    shareControl: ({ l10n, templates }) => `<ul class="share text-align-left">
<li>${l10n.sidePanel.shareTo}:</li>
    ${l10n.sidePanel.services
        .map(
            ({ key, link }) =>
                `<li><a class="share share-${key}" href="${templates.shareLink(
                    link,
                    l10n.sidePanel.shareParameters
                )}" target="_blank"> </a></li>`
        )
        .join('')}
        <li class="copy-link">${
            l10n.sidePanel.copyLink
        }: <input type="text" value="${
        l10n.sidePanel.shareParameters.url
    }"/><button type="button" class="copy-button"></button></li>
</ul>`,

    shareList: ({ l10n, templates }) => `<p class="share text-align-left">${
        l10n.sidePanel.shareTo
    }:
${l10n.sidePanel.services
    .map(
        ({ key, link }) =>
            `<a class="share share-${key}" href="${templates.shareLink(
                link,
                l10n.sidePanel.shareParameters
            )}" target="_blank">${key}</a>`
    )
    .join(' · ')}</p>`,

    frontPage: ({ templates, l10n }) => `
<div class="cover">
    <h1>
    <span class="author">${l10n.author}</span><span class="title"
        >${l10n.frontPage.title}</span
    ><em>${l10n.frontPage.subTitle}</em>
    </h1>
</div><div class="page-break"></div><div class="annotation"><p class=\"text-align-left\">
    <strong>${l10n.author}. ${l10n.title}.</strong><br />
    <a target="_blank" href="mailto:${l10n.links.email}">${
        l10n.links.emailString
    }</a> &middot; <a target="_blank" href="${l10n.links.linkedinHref}">${
        l10n.links.linkedinString
    }</a> &middot; <a target="_blank" href="${l10n.links.patreonHref}">${
        l10n.links.patreonString
    }</a></p>
    ${l10n.frontPage.contents.join('\n')}
    <p class=\"text-align-left\">${
        l10n.sourceCodeAt
    } <a target="_blank" href="${l10n.links.githubHref}">${
        l10n.links.githubString
    }</a></p>
</div>${templates.shareList({
        l10n,
        templates
    })}<div class="page-break"></div>`,

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
        <link rel="stylesheet" media="all" href="assets/landing.css" />
    </head>
    <body>
        <nav>
            <img
                class="header"
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
        <h2>${l10n.toc}</h2>
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
        <h3 name="about-author">${l10n.aboutMe.title}</h3>
        <section class="about-me">
            <aside><img src="https://konstantinov.cc/static/me.png"/><br/>${
                l10n.aboutMe.imageCredit
            }</aside>
            <div class="content">${l10n.aboutMe.content.join('\n')}</div>
        </section>
        ${l10n.landing.footer.join('\n')}
    </body>
</html>`;
    },

    shareLink: (link, parameters) => {
        let result = link;
        for (const [key, value] of Object.entries(parameters)) {
            result = result.replace(
                new RegExp(`\\$\\{${key}\\}`, 'g'),
                encodeURIComponent(value)
            );
        }
        return result;
    }
};
