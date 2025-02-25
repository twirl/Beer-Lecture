import { readFile } from 'node:fs/promises';

import {
    type AImgParams,
    type BibliographyItem,
    DefaultTemplates,
    escapeHtml,
    type HtmlString,
    type Path,
    Section,
    type Strings,
    Structure
} from '@twirl/book-builder';
import { resolve } from 'node:path';

export interface ExtraStrings extends Strings {
    file: string;
    links: Record<string, string>;
    sourceCodeAt: string;
    landingFile: string;
    landing: {
        subTitle: string;
        subscribeOn: string;
        updates: string[];
        followOn: string;
        follow: string[];
        supportThisWork: string;
        support: [];
        content: string[];
        download: string;
        or: string;
        readOnline: string;
        license: string;
        footer: string[];
    };
    sidePanel: {
        shareTo: string;
        services: Array<{ key: string; link: string }>;
        shareParameters: Record<string, string>;
        copyLink: string;
        shareLink: string;
    };
    aboutMe: {
        title: string;
        imageCredit: string;
        content: string[];
    };
    subtitle: string;
    frontPage: {
        title: string;
        subTitle: string;
        contents: string[];
    };
    imageCredit: string;
    publicDomain: string;
}

export class CustomTemplates extends DefaultTemplates<ExtraStrings> {
    constructor(
        private readonly target: 'epub' | 'html' | 'pdf',
        ...args: ConstructorParameters<typeof DefaultTemplates<ExtraStrings>>
    ) {
        super(...args);
    }

    public bibliographyItemShortName(bibliographyItem: BibliographyItem) {
        return bibliographyItem.authors !== ''
            ? `${bibliographyItem.authors}${
                  bibliographyItem.publicationDate
                      ? ` (${bibliographyItem.publicationDate})`
                      : ''
              }`
            : bibliographyItem.title;
    }

    public async htmlBibliographyItemFullName(item: BibliographyItem) {
        return (
            item.authors !== ''
                ? `${escapeHtml(
                      this.bibliographyItemShortName(item)
                  )} ${await this.htmlBibliographyItemTitle(item)}`
                : await this.htmlBibliographyItemTitle(item)
        ) as HtmlString;
    }

    htmlImprintPages() {
        return `<div class="cover"><h1><span class="author">${this.string(
            'author'
        )}</span><br/><span class="title">${
            this.strings.frontPage.title
        }</span><em>${this.strings.frontPage.subTitle}</em></h1></div>
        <div class="page-break"></div>
        <div class="annotation"><p class="text-align-left">
        <strong>${this.string('author')}. ${this.string(
            'title'
        )}.</strong><br />
        <a target="_blank" href="mailto:${this.strings.links.email}">${
            this.strings.links.emailString
        }</a> &middot; <a target="_blank" href="${
            this.strings.links.linkedinHref
        }">${
            this.strings.links.linkedinString
        }</a> &middot; <a target="_blank" href="${
            this.strings.links.patreonHref
        }">${
            this.strings.links.patreonString
        }</a></p>${this.strings.frontPage.contents.join('\n')}
        <p class=\"text-align-left\">${
            this.strings.sourceCodeAt
        } <a target="_blank" href="${this.strings.links.githubHref}">${
            this.strings.links.githubString
        }</a></p>
        </div>${this.shareList()}<div class="page-break"></div>`;
    }

    public shareList() {
        return `<p class="share text-align-left">${
            this.strings.sidePanel.shareTo
        }: ${this.strings.sidePanel.services
            .map(
                ({ key, link }) =>
                    `<a class="share share-${key}" href="${this.shareLink(
                        link
                    )}" target="_blank">${key}</a>`
            )
            .join(' · ')}</p>`;
    }

    public shareLink(link: string) {
        let result = link;
        for (const [key, value] of Object.entries(
            this.strings.sidePanel.shareParameters
        )) {
            result = result.replace(
                new RegExp(`\\$\\{${key}\\}`, 'g'),
                encodeURIComponent(value)
            );
        }
        return result;
    }

    public async htmlAImgTitle(params: AImgParams) {
        return `<h6>${escapeHtml(this.imageTitle(params))}${
            params.size || (this.target !== 'html' && !params.href)
                ? ''
                : `${
                      (params.title.at(-1) ?? '').match(/[\.\?\!\)]/)
                          ? ' '
                          : '. '
                  }${await this.htmlAImgRef(params)}</h6>`
        }` as HtmlString;
    }

    public async htmlAImgRef(params: AImgParams) {
        return params.href && params.alt !== 'PD'
            ? `<a href="${escapeHtml(
                  params.href
              )}" target="_black">${this.string('imageCredit')}: ${escapeHtml(
                  params.alt
              )}</a>`
            : this.string('publicDomain');
    }

    public async htmlAImgImage(params: AImgParams) {
        return params.size || this.target !== 'html'
            ? super.htmlAImgImage(params)
            : (`<a href="${escapeHtml(
                  params.src
              )}" target="_black">${await super.htmlAImgImage(
                  params
              )}</a>` as HtmlString);
    }

    public async htmlBody(body: string, structure: Structure) {
        return `${await this.htmlSidePanel(
            structure
        )}<article>${body}</article>${await this.htmlMainScript()}` as HtmlString;
    }

    public async htmlSection(section: Section) {
        if (section.getCounter() === 1) {
            return `<nav class="page-main">
                <ul class="nav-folded"><li class="share"></li><li class="para">§</li></ul>
            </nav>${await super.htmlSection(section)}` as HtmlString;
        } else {
            return super.htmlSection(section);
        }
    }

    public async htmlSidePanel(structure: Structure) {
        return `<div class="fade display-none"></div>
        <aside class="side-panel display-none"><h3 class="title">${this.string(
            'author'
        )}. ${this.string(
            'title'
        )}</h3>${await this.htmlShareControl()}<section class="side-toc">${await toc(
            {
                structure,
                strings: this.strings,
                templates: this,
                lang: this.language
            }
        )}</section><button type="button" class="close"></button></aside>`;
    }

    public async htmlMainScript() {
        return `<script>${await readFile(
            resolve('./src', 'scripts', 'sidebar.js')
        )}</script>`;
    }

    public async htmlShareControl() {
        const sidePanel = this.strings.sidePanel;
        return `<ul class="share text-align-left"><li>${
            sidePanel.shareTo
        }:</li>${sidePanel.services
            .map(
                ({ key, link }) =>
                    `<li><a class="share share-${key}" href="${shareLink(
                        link,
                        sidePanel.shareParameters
                    )}" target="_blank">&nbsp;</a></li>`
            )
            .join('')}<li class="copy-link">${
            sidePanel.copyLink
        }: <input type="text" value="${
            sidePanel.shareParameters.url
        }" aria-label="${
            sidePanel.shareLink
        }"/><button type="button" class="copy-button"></button></li>
</ul>`;
    }
}

export const toc = async ({
    structure,
    strings,
    templates,
    lang
}: {
    structure: Structure;
    strings: ExtraStrings;
    templates: CustomTemplates;
    lang: string;
}) => {
    const link = linker(strings, lang);
    return `<ul class="toc">${structure
        .getSections()
        .map(
            (section) => `<li>
                <h4><a href="${link(section.anchor)}">${escapeHtml(
                templates.sectionTitle(section)
            )}</a></h4>
                ${
                    section.getChapters().length
                        ? `<ul class="section">
                    ${section
                        .getChapters()
                        .map(
                            (chapter) =>
                                `<li><a href="${link(
                                    chapter.anchor
                                )}">${escapeHtml(
                                    templates.chapterTitle(chapter)
                                )}</a></li>`
                        )
                        .join('\n')}
                            </ul>`
                        : ''
                }
            </li>`
        )
        .join('\n')}</ul>`;
};

export const shareLinks = (strings: ExtraStrings) =>
    `${strings.sidePanel.services
        .map(
            ({ key, link }) =>
                `<a class="share share-${key}" href="${shareLink(
                    link,
                    strings.sidePanel.shareParameters
                )}" target="_blank">${key}</a>`
        )
        .join(' · ')}`;

export const shareLink = (link: string, parameters: Record<string, string>) => {
    let result = link;
    for (const [key, value] of Object.entries(parameters)) {
        result = result.replace(
            new RegExp(`\\$\\{${key}\\}`, 'g'),
            encodeURIComponent(value)
        );
    }
    return result;
};

export const linker =
    (strings: ExtraStrings, lang: string) =>
    (anchor?: string, type = 'html') =>
        `${encodeURIComponent(strings.file)}.${lang}.${type}${
            anchor ? '#' + anchor : ''
        }`;
