import {
    applyAstPluginToStructure,
    createStatelessPlugin,
    htmlToAstElements,
    isElement,
    isTextNode,
    Structure,
    type StructureAstState,
    type StructurePluginState
} from '@twirl/book-builder';
import type { ElementContent } from 'hast';

export const incutsAstPlugin = <T, S>(incuts: { [key: string]: string }) =>
    createStatelessPlugin<StructureAstState<T, S>, ElementContent>(
        async (
            node: ElementContent,
            _context,
            state: StructureAstState<T, S>
        ) => {
            if (
                isElement(node) &&
                node.tagName == 'p' &&
                node.children.length &&
                isTextNode(node.children[0])
            ) {
                const textNode = node.children[0];
                const incut = Object.entries(incuts).reduce(
                    (incut: string | null, [type, signature]) => {
                        return incut !== null
                            ? incut
                            : textNode.value.indexOf(signature) == 0
                            ? type
                            : null;
                    },
                    null
                );
                if (typeof incut === 'string') {
                    const newValue = await htmlToAstElements(
                        `<div class="${incut}"><h5>${
                            state.l10n.strings[incut] ?? '[FIXME]'
                        }</h5>${textNode.value.slice(
                            incuts[incut].length
                        )}</div>`
                    );
                    newValue[0].children.push(...node.children.slice(1));
                    return {
                        action: 'replace',
                        newValue
                    };
                }
            }
            return {
                action: 'continue_nested'
            };
        }
    );

export const incuts =
    (incuts: { [key: string]: string }) =>
    <T, S>(structure: Structure, state: StructurePluginState<T, S>) =>
        applyAstPluginToStructure(
            state.context,
            state.l10n,
            structure,
            incutsAstPlugin(incuts)
        );
