import { resolve as pathResolve } from 'path';
import templates from './src/templates.js';
//import { init, plugins } from '@twirl/book-builder';
import { init, plugins } from '../The-Book-Builder/index.js';
import { readFileSync, writeFileSync } from 'fs';

const l10n = {
    en: JSON.parse(readFileSync('./src/en/l10n.json', 'utf-8')),
    ru: JSON.parse(readFileSync('./src/ru/l10n.json', 'utf-8'))
};

const SAMPLE_CHAPTERS = '3-3';

const langsToBuild = (process.argv[2] &&
    process.argv[2].split(',').map((s) => s.trim())) || ['ru', 'en'];

const targets = (
    (process.argv[3] && process.argv[3].split(',')) || [
        'html',
        'pdf',
        'epub',
        'landing',
        'sample'
    ]
).reduce((targets, arg) => {
    targets[arg.trim()] = true;
    return targets;
}, {});

const chapters = process.argv[4];

console.log(`Building langs: ${langsToBuild.join(', ')}…`);
build(langsToBuild, targets, chapters).then(() => process.exit(0));

async function build(langsToBuild, targets, chapters) {
    for (const lang of langsToBuild) {
        for (const target of Object.keys(targets)) {
            const builder = await init({
                lang,
                cover: l10n[lang].cover,
                l10n: l10n[lang],
                basePath: pathResolve(`src`),
                path: pathResolve(`src/${lang}/clean-copy`),
                templates,
                pipeline: {
                    css: {
                        beforeAll: [
                            plugins.css.backgroundImageDataUri,
                            plugins.css.fontFaceDataUri
                        ]
                    },
                    ast: {
                        preProcess: [
                            plugins.ast.h3ToTitle,
                            plugins.ast.incuts({
                                funFact: 'Fun Fact. ',
                                beerMyth: 'Beer Myth. '
                            }),
                            plugins.ast.aImg,
                            plugins.ast.imgSrcResolve,
                            plugins.ast.ref,
                            plugins.ast.ghTableFix,
                            plugins.ast.stat
                        ]
                    },
                    htmlSourceValidator: {
                        validator: 'WHATWG',
                        ignore: ['heading-level', 'no-raw-characters']
                    },
                    html: {
                        postProcess: [plugins.html.imgDataUri]
                    }
                },
                chapters: target == 'sample' ? SAMPLE_CHAPTERS : chapters
            });
            if (target == 'landing') {
                const landingHtml = templates.landing(
                    builder.structure,
                    l10n[lang],
                    lang
                );
                writeFileSync(
                    pathResolve('docs', l10n[lang].landingFile),
                    landingHtml
                );

                console.log(
                    `Finished lang=${lang} target=${target}\n${Object.entries({
                        sources: 'Sources',
                        references: 'references',
                        words: 'words',
                        characters: 'characters'
                    })
                        .map(([k, v]) => `${v}: ${builder.structure[k]}`)
                        .join(', ')}`
                );
            } else if (target == 'sample') {
                await builder.build(
                    'epub',
                    pathResolve('docs', `sample.${lang}.epub`)
                );
            } else {
                await builder.build(
                    target,
                    pathResolve('docs', `${l10n[lang].file}.${lang}.${target}`)
                );
            }
        }
    }
}
