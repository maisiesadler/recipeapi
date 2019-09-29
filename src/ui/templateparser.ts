export class TemplateParser {
    public static Parse(o: string, replacer: { [key: string]: any }) {
        let f = TemplateParser.findFors(o);
        while (f !== null) {
            const replacement = TemplateParser.ReplaceFor(f, replacer);
            o = o.replace(f[0], replacement);
            f = TemplateParser.findFors(o);
        }

        let next = TemplateParser.findNext(o);
        while (next !== null) {
            let val = replacer[next[1].trim()] || '';

            o = o.replace(next[0], val);
            next = TemplateParser.findNext(o);
        }

        return o;
    }

    private static ReplaceFor(match: RegExpExecArray, replacer: { [key: string]: any }): string {
        const name = /each="(.*)"/.exec(match[1])

        const replaceobj = replacer[name[1]]
        if (!Array.isArray(replaceobj)) {
            return '';
        }

        return replaceobj.map((replaceContents, _idx) => {
            // using {...} syntax with the mongo objects gives weird results
            replaceContents._idx = _idx
            return TemplateParser.replaceOne(match[2], replaceContents)
        }).join('')
    }

    private static replaceOne(template: string, o: any): string {
        let next = TemplateParser.findNext(template);
        while (next !== null) {
            if (next[0].indexOf('=') > 0) {
                // is expression
                const { replaced, tokens } = TemplateParser.replaceStrings(next[1]);
                const parts = replaced.split(/[= ]/).filter(x => !!x);
                let s = replaced

                parts.forEach(part => {
                    if (/^[A-Za-z_]+$/.exec(part) !== null) {
                        // todo: this won't work if the variable == string name
                        let val = o[part];
                        if (typeof val == 'string') {
                            val = `'${val}'`;
                        }
                        s = s.replace(part, val);
                    }
                })
                s = TemplateParser.replaceStringsBack(s, tokens);

                let evaled = 'not evaled';
                try {
                    evaled = eval(s)
                } catch (e) {
                    evaled = 'error: ' + e
                }
                template = template.replace(next[0], evaled);
            } else {
                let val = o[next[1]];
                if (typeof val === 'undefined') {
                    val = '';
                }
                template = template.replace(next[0], val);
            }
            next = TemplateParser.findNext(template);
        }

        return template;
    }

    private static replaceStrings(o: string): { replaced: string, tokens: { [key: string]: string } } {
        let next = TemplateParser.findStrings(o);
        let num = 0;
        const tokens = {}
        while (next !== null) {
            const token = `__${num++}__`;
            tokens[token] = next[0];
            o = o.replace(next[0], token);
            next = TemplateParser.findStrings(o);
        }

        return { replaced: o, tokens };
    }

    private static replaceStringsBack(o: string, tokens: { [key: string]: string }): string {
        let next = TemplateParser.findTokens(o);
        while (next !== null) {
            const val = tokens[next[0]];
            if (typeof val === 'undefined') {
                console.error('could not find value for token', next[0])
                return '';
            }
            o = o.replace(next[0], val);
            next = TemplateParser.findTokens(o);
        }

        return o;
    }

    private static findNext(o: string): RegExpExecArray {
        return /{{ *([\w='_?:! ]+) *}}/g.exec(o);
    }

    private static findFors(o: string): RegExpExecArray {
        return /<for([^>]*)>(.*?)<\/for>/s.exec(o);
    }

    private static findStrings(o: string): RegExpExecArray {
        return /'(.*?)'/s.exec(o);
    }

    private static findTokens(o: string): RegExpExecArray {
        return /__(.*?)__/s.exec(o);
    }
}